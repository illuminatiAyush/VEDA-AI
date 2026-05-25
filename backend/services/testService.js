/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  TEST SERVICE — MongoDB / Mongoose Version                       ║
 * ║  Hardened: Proper error handling + test lifecycle                ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const Test = require('../models/Test');
const { logger } = require('../utils/logger');

class TestService {
  /**
   * Creates a test and its embedded questions.
   */
  static async createTest(token, userId, data) {
    const { title, instructions, difficulty, duration_minutes, total_marks, content, is_ai_generated, start_time, end_time, status } = data;

    try {
      const questions = (content?.questions || []).map((q, i) => ({
        question: q.question || q.text || '',
        options: q.options || [],
        answer: q.answer || q.correct_answer || '',
        type: q.type || 'mcq',
        sort_order: i,
      }));

      const test = await Test.create({
        title,
        instructions: instructions || '',
        difficulty: difficulty || 'medium',
        duration_minutes: duration_minutes || 30,
        total_questions: questions.length || total_marks || 0,
        status: status || 'draft',
        start_time: start_time || null,
        end_time: end_time || null,
        source_document: is_ai_generated ? { ai_generated: true } : null,
        created_by: userId,
        questions,
      });

      logger.info({ testId: test._id, createdBy: userId }, 'Test record created successfully in MongoDB');
      return test;
    } catch (error) {
      logger.error({ err: error }, 'Failed to create test in MongoDB');
      throw new Error(error.message || 'Failed to create test');
    }
  }

  /**
   * Updates test status (publish/start/end).
   */
  static async updateTestStatus(token, userId, testId, action) {
    try {
      const updates = {};
      if (action === 'publish') {
        updates.status = 'scheduled';
      } else if (action === 'start') {
        updates.status = 'active';
        updates.start_time = new Date();
      } else if (action === 'end') {
        updates.status = 'ended';
        updates.end_time = new Date();
      } else if (action === 'delete') {
        const deleted = await Test.findOneAndDelete({ _id: testId, created_by: userId });
        if (!deleted) {
          throw new Error('Test not found or user unauthorized to delete');
        }
        logger.info({ testId }, 'Test deleted successfully');
        return deleted;
      } else {
        throw new Error('Invalid status action');
      }

      const test = await Test.findOneAndUpdate(
        { _id: testId, created_by: userId },
        updates,
        { new: true }
      );

      if (!test) {
        throw new Error(`Test not found or user unauthorized to ${action}`);
      }

      logger.info({ testId, action, status: test.status }, 'Test status updated successfully');
      return test;
    } catch (error) {
      logger.error({ err: error, testId, action }, 'Failed to update test status in MongoDB');
      throw new Error(error.message || `Failed to ${action} test`);
    }
  }
}

module.exports = TestService;
