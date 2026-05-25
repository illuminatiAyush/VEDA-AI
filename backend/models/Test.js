/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  TEST MODEL — MongoDB/Mongoose Schema                            ║
 * ║  Contains embedded questions and virtual mapping helper fields   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  options: {
    type: [String],
    default: [],
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['mcq', 'short', 'long'],
    default: 'mcq',
  },
  sort_order: {
    type: Number,
    default: 0,
  },
});

// Configure embedded question subdocument virtuals
QuestionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
QuestionSchema.set('toJSON', { virtuals: true });
QuestionSchema.set('toObject', { virtuals: true });

const TestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    instructions: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    duration_minutes: {
      type: Number,
      default: 30,
    },
    total_questions: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'active', 'ended'],
      default: 'draft',
    },
    start_time: {
      type: Date,
      default: null,
    },
    end_time: {
      type: Date,
      default: null,
    },
    source_document: {
      type: mongoose.Schema.Types.Mixed, // Storing metadata if AI-generated or custom
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: {
      type: [QuestionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id virtual getter for frontend compatibility
TestSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
TestSchema.set('toJSON', { virtuals: true });
TestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Test', TestSchema);
