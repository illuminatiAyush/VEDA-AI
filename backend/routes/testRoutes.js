/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  TEST ROUTES — Assessment Lifecycle Router                      ║
 * ║  Hardened: Zod Validation on all inputs                         ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const TestService = require('../services/testService');
const { authenticate } = require('../utils/authMiddleware');
const { validateBody, createTestSchema, testStatusSchema } = require('../utils/validators');
const Test = require('../models/Test');

async function testRoutes(fastify, options) {
  fastify.addHook('preHandler', authenticate);

  /**
   * GET /api/tests
   * Lists all tests created by the teacher.
   */
  fastify.get('/tests', async (request, reply) => {
    const userId = request.user.id;

    try {
      const tests = await Test.find({ created_by: userId }).sort({ createdAt: -1 });

      const formatted = tests.map(t => t.toObject({ virtuals: true }));

      return reply.send({ success: true, data: formatted });
    } catch (error) {
      request.log.error({ err: error }, 'Failed to fetch tests');
      return reply.status(500).send({ success: false, error: 'Failed to fetch assessments' });
    }
  });

  /**
   * GET /api/tests/:id
   * Fetches test details.
   */
  fastify.get('/tests/:id', async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.id;

    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(id)) {
      return reply.status(400).send({ success: false, error: 'Invalid test ID format' });
    }

    try {
      const test = await Test.findById(id);
      if (!test) {
        return reply.status(404).send({ success: false, error: 'Test not found' });
      }

      if (test.created_by.toString() !== userId) {
        return reply.status(403).send({ success: false, error: 'Unauthorized to view this test' });
      }

      return reply.send({ success: true, data: test.toObject({ virtuals: true }) });
    } catch (error) {
      request.log.error({ err: error, id }, 'Failed to fetch test details');
      return reply.status(500).send({ success: false, error: error.message || 'Failed to fetch test details' });
    }
  });

  /**
   * POST /api/create-test
   * Creates a new assessment with validated payload.
   */
  fastify.post('/create-test', {
    preHandler: [validateBody(createTestSchema)],
    handler: async (request, reply) => {
      try {
        const data = request.body; // Already validated & coerced by Zod
        const token = request.headers.authorization.replace('Bearer ', '');
        const userId = request.user.id;

        request.log.info({ userId, title: data.title }, 'Creating new assessment');
        
        const test = await TestService.createTest(token, userId, data);

        return reply.send({
          success: true,
          data: test,
        });
      } catch (error) {
        request.log.error({ err: error }, 'Failed to create test');
        return reply.status(500).send({
          success: false,
          error: error.message || 'Failed to create test',
        });
      }
    },
  });

  /**
   * POST /api/test-status/:id
   * Manages test lifecycle: publish, start, end
   */
  fastify.post('/test-status/:id', {
    preHandler: [validateBody(testStatusSchema)],
    handler: async (request, reply) => {
      try {
        const { id } = request.params;
        const { action } = request.body;
        const token = request.headers.authorization.replace('Bearer ', '');
        const userId = request.user.id;

        // Validate MongoDB ObjectId format for param
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!objectIdRegex.test(id)) {
          return reply.status(400).send({ success: false, error: 'Invalid test ID format' });
        }

        request.log.info({ userId, testId: id, action }, 'Test status change');

        const test = await TestService.updateTestStatus(token, userId, id, action);

        return reply.send({
          success: true,
          data: test,
        });
      } catch (error) {
        request.log.error({ err: error }, 'Failed to update test status');
        return reply.status(500).send({
          success: false,
          error: error.message || 'Failed to update test status',
        });
      }
    },
  });

  /**
   * GET /api/dashboard/teacher/stats
   * Simplified stats for Teacher Dashboard.
   */
  fastify.get('/dashboard/teacher/stats', async (request, reply) => {
    const userId = request.user.id;

    try {
      const testsCount = await Test.countDocuments({ created_by: userId });
      
      return reply.send({ success: true, data: { totalAssessments: testsCount } });
    } catch (error) {
      request.log.error({ err: error }, 'Failed to load teacher stats');
      return reply.status(500).send({ success: false, error: 'Failed to aggregate dashboard analytics' });
    }
  });

}

module.exports = testRoutes;
