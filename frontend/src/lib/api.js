/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  API SERVICE — Fully Migrated REST Client                        ║
 * ║  Hardened: Local JWT token authority + MongoDB backend REST map  ║
 * ║  Supabase & Student Purge Complete                              ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

const getHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  /**
   * Generates a new test using AI from PDF uploads.
   */
  async generateTest(file, difficulty = 'medium', numQuestions = 10) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('difficulty', difficulty);
    formData.append('numQuestions', numQuestions);

    const response = await fetch(`${BACKEND_URL}/generate-test`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Generation failed');
    }

    return { success: true, jobId: data.jobId };
  },

  /**
   * Polls the background AI generation status.
   */
  async getGenerationStatus(jobId) {
    const response = await fetch(`${BACKEND_URL}/generate-test/status/${jobId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get status');
    }

    return data;
  },

  /**
   * Creates a test in MongoDB.
   */
  async createTest({ title, difficulty, duration_minutes, total_marks, content, is_ai_generated, start_time, end_time, status }) {
    const response = await fetch(`${BACKEND_URL}/create-test`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        title,
        difficulty,
        duration_minutes,
        total_marks,
        content,
        is_ai_generated,
        start_time,
        end_time,
        status,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to create test');
    }

    return data.data;
  },

  /**
   * Fetches tests matching the user's role (created tests for teachers).
   */
  async getMyTests() {
    const response = await fetch(`${BACKEND_URL}/tests`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch tests');
    }

    return data.data || [];
  },

  /**
   * Fetches full assessment details by ID.
   */
  async getTestById(id) {
    const response = await fetch(`${BACKEND_URL}/tests/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch test details');
    }

    return data.data;
  },

  /**
   * Updates test parameters.
   */
  async updateTest(id, updates) {
    const response = await fetch(`${BACKEND_URL}/tests/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update test');
    }

    return data.data;
  },

  /**
   * Publishes, starts, or force-ends tests.
   */
  async updateTestStatus(id, action) {
    const response = await fetch(`${BACKEND_URL}/test-status/${id}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || `Failed to ${action} test`);
    }

    return data.data;
  },

  /**
   * Fetches aggregate telemetry stats for the Teacher Dashboard.
   */
  async getTeacherDashboardStats() {
    const response = await fetch(`${BACKEND_URL}/dashboard/teacher/stats`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return { totalAssessments: 0 };
    }

    return data.data || { totalAssessments: 0 };
  },

  /**
   * Fetches token and AI usage metrics for teacher dashboard billing charts.
   */
  async getAIUsage() {
    const response = await fetch(`${BACKEND_URL}/usage`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch AI telemetry');
    }

    return data;
  },
};
