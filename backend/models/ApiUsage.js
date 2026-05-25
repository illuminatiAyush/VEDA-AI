/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  API USAGE MODEL — Mongoose Schema                               ║
 * ║  Logs AI generation token counts and performance stats.          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const mongoose = require('mongoose');

const ApiUsageSchema = new mongoose.Schema(
  {
    model: { type: String, required: true },
    prompt_tokens: { type: Number, default: 0 },
    completion_tokens: { type: Number, default: 0 },
    total_tokens: { type: Number, default: 0 },
    latency_ms: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ApiUsage', ApiUsageSchema);
