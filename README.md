# VedaAI — AI Assessment Creator

VedaAI is a production-grade **AI Assessment Creator** designed to let teachers effortlessly ingest textbook chapters, notes, or classroom snapshots and instantly convert them into balanced, curriculum-aligned exam question papers (complete with MCQ, short-answer, and long-answer sections, marks distribution, and answer keys).

---

## 🏗️ Strict Repository Directory Structure

```text
project-root/
│
├── frontend/             # React SPA (Vite, TailwindCSS, Framer Motion)
├── backend/              # Node.js + Fastify API Server
├── documents/            # System & Architecture Documentation
│   ├── architecture.md   # Hybrid layering & RAG details
│   ├── api-flow.md       # Fastify REST endpoints & JSON shapes
│   ├── db-schema.md      # Mongoose models & validation schemas
│   ├── prompt-structure.md# AI prompting & validation logic
│   ├── setup.md          # Setup, whitelist configurations & cloud guides
│   └── screenshots/      # Application screenshots and assets
│
└── README.md             # This file
```

---

## ⚡ Core Platform Features
1. **AI Question Generator**: Generate Multiple Choice, Short Answer, or Long Answer questions categorised by difficulty (Easy, Moderate, Challenging) based on dynamic contexts.
2. **Textbook Photo Uploads (OCR Vision)**: Take a snapshot of any textbook page or hand-written note from your phone, upload it directly, and watch Gemini 2.0 Flash's multimodal vision engine synthesize full quizzes in seconds.
3. **Professional Question Sheet Renders**: Dynamic layouts that render exam-ready PDF-downloadable worksheets with Delhi Public School branding, student details fields, section markings, and answer keys.
4. **Background Queue Engine**: Safe, asynchronous background job scheduler mimicking BullMQ that runs AI processing tasks without blocking request processes.
5. **Dynamic Token & Usage Graphs**: Real-time interactive graphs displaying AI API consumption rates and remaining quotas.

---

## 🛠️ The Tech Stack
* **Frontend**: React 18, Vite, Framer Motion (premium animations), TailwindCSS (design system), Lucide React.
* **Backend**: Node.js, Fastify (rate-limiting, global error mapping, multipart support).
* **Database**: MongoDB Atlas + Mongoose ODM.
* **AI Engines**: Groq (Llama 3.3 70B & Llama 3.1 8B JSON Object Inference) + Google Gemini 2.0 Flash (Multimodal OCR Vision Fallback).

---

## 🚀 Quick Start & Setup
To run the platform locally or deploy to cloud servers (Fastify backend on Render, React frontend on Vercel), follow our comprehensive step-by-step setup guide:

👉 [**VedaAI Setup & Deployment Guide (documents/setup.md)**](documents/setup.md)
