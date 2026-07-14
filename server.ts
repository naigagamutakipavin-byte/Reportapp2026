/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client helper to avoid crashes if API key is not yet set
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in environment secrets. Using professional algorithmic fallback.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Full-stack server side API route for Gemini Activity Summary Refining
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }

    const { callsCount, guestsCount, enrollmentsCount, inquiriesCount, rawNotes } = data;
    const { challenges, achievements, observations } = rawNotes || {};

    const ai = getGeminiClient();

    if (!ai) {
      // Robust professional fallback summary draft if API Key is not set yet
      const fallbackSummary = `Today, the admissions officer successfully managed ${callsCount} call(s), received ${guestsCount} guest(s) at reception, logged ${enrollmentsCount} candidate enrollment(s), and handled ${inquiriesCount} customer inquiries. Key actions completed: ${achievements || 'completed standard follow-up duties'}. Observed trends: ${observations || 'steady student/client inquiry flow'}. Ongoing resolutions focus on: ${challenges || 're-verifying transcript credentials'}.`;
      return res.json({ aiSummary: fallbackSummary });
    }

    const prompt = `You are an expert executive reporting assistant. Generate a single, highly polished, formal, third-person paragraph summarizing today's activities as an admissions enrollment officer. Be brief (maximum 4 sentences) and highly professional.

Here are today's metrics:
- Calls Logged: ${callsCount}
- Guests Welcomed: ${guestsCount}
- Students Enrolled: ${enrollmentsCount}
- Client Inquiries Handled: ${inquiriesCount}

Admissions Officer's Raw Notes:
- Challenges Faced: "${challenges || 'None recorded'}"
- Key Achievements: "${achievements || 'Completed standard operational tasks'}"
- Observations: "${observations || 'Normal student interest trends'}"

Write a cohesive, refined daily report summary paragraph. Emphasize achievements and how they align with admissions metrics. Do not include introductory text like "Here is the summary" or "Today is". Output only the polished paragraph text directly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    const aiSummary = response.text?.trim() || 'Successfully refined the report.';
    res.json({ aiSummary });
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    res.status(500).json({ error: error.message || 'Failed to refine summary' });
  }
});

// Configure Vite and Asset Serving
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Daily Activity Reporter server running on http://localhost:${PORT}`);
  });
}

setupVite();
