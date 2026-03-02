# **EchoMap — Emotional Conversation Analyzer**

**AI-Powered Sentiment Mapping • Conflict De-escalation • Privacy-First Reflection**
**Next.js • FastAPI • Vader Sentiment • Recharts**

<div align="center">
  <img src="https://img.shields.io/badge/Frontend-Next.js%2014-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/NLP-Vader%20Sentiment-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Privacy-Stateless%20Analysis-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Demo-Live%20Link-purple?style=for-the-badge" />
</div>

---

## 🌀 Overview

**EchoMap** is a tool designed to help people see the "emotional shape" of their conversations. 

Communication often feels like a black box. We remember how we felt, but we struggle to see the dynamics of how a conversation shifted from calm to tense. 

EchoMap uses AI to parse dialogue between two speakers and visualize the emotional arc, identifying:
- **Tension Points**: Exact moments where the tone shifted toward escalation.
- **Empathy Moments**: Instances of validation and active listening.
- **Balance Scores**: Visualizing whether the dialogue was collaborative or one-sided.

---

## ✨ Key Features

| Feature | Description |
| --- | --- |
| **Emotional Map** | A rich, interactive area chart showing sentiment over time. |
| **Smart Rewriter** | AI suggestions to rephrase tense moments into constructive "I" statements. |
| **Privacy First** | No database. No logs. Your data disappears as soon as you close the tab. |
| **Tension Detection** | Automatically flags trigger phrases and emotional spikes. |

---

## 🎨 Core Experience

1. **Input**: Paste a transcript of a conversation (e.g., from WhatsApp or SMS).
2. **Analysis**: The FastAPI backend processes sentiment and tone shift markers.
3. **Visualization**: A dynamic dashboard renders the emotional landscape of the exchange.
4. **Reflection**: Users review "Rewrite Paths" to learn better communication habits.

---

## 🧬 Scientific Foundation

EchoMap uses the **VADER (Valence Aware Dictionary and sEntiment Reasoner)** model, specifically tuned for social media and conversational text. It doesn't just look for "bad words"—it looks for intensity, capitalization emphasis, and context-dependent sentiment.

### Scoring Metrics
- **Intensity**: Calculated by tracking the variance in sentiment across message blocks.
- **Empathy Score**: Determined by identifying validating phrases and perspective-taking language.
- **Escalation Detection**: Identifies when consecutive messages move from neutral to high-negative valence.

---

## 📁 Folder Structure

```text
echomap-main/
├─ frontend/
│  ├─ src/app/        # Next.js App Router (Landing & Analysis)
│  ├─ src/components/ # Dashboard, Charts, and Input components
│  └─ next.config.ts  # Dynamic API rewrites
│
├─ backend/
│  ├─ main.py         # FastAPI Entry Point
│  ├─ analyzer.py     # Sentiment logic & Conversation parsing
│  ├─ rewriter.py     # AI Suggestion Engine
│  └─ requirements.txt# Python dependencies
│
└─ .gitignore         # Monorepo git management
```

---

## 🧪 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **Tailwind CSS** (Modern styling)
- **Recharts** (Interactive data visualization)
- **Lucide React** (Beautiful iconography)

### Backend
- **FastAPI** (High-performance Python)
- **VADER Sentiment** (NLP analysis)
- **Uvicorn** (ASGI server)

---

## ▶ Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment

- **Frontend**: Deployed on **Vercel** with dynamic API rewrites.
- **Backend**: Deployed on **Render** (FastAPI service).
- **Environment**: Managed via `NEXT_PUBLIC_API_URL` for seamless communication.

---

## 🎯 Use Cases

- **Relationship Wellness**: Reviewing tense texts to understand "how we got here."
- **Professional Growth**: Analyzing email threads for tone and empathy.
- **Self-Reflection**: Understanding your own emotional patterns in digital speech.

---

<p align="center" style="font-size:18px; color:#7c3aed;">
  <i><b>“Visualize the silence between the words.”</b></i>
</p>
