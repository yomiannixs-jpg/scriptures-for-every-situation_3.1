function buildPrompt({ situation, topics = [], mode = 'guidance' }) {
  const topicTitles = Array.isArray(topics)
    ? topics.slice(0, 40).map((t) => `${t.title || t.id}: ${t.description || ''}`).join('\n')
    : '';

  const baseSafety = `
You are a careful, scripture-centered, non-denominational Christian assistant.
Use pastoral, humble language. Do not claim certainty about God's private will.
Do not replace professional medical, legal, financial, or emergency support.
When giving Bible references, include concise application. Avoid graphic sexual content; answer moral questions respectfully and biblically.
Use KJV-style references where possible. Keep the tone hopeful, practical, and reverent.`;

  const request = String(situation || '').trim();
  const normalizedMode = String(mode || 'guidance').toLowerCase();

  if (normalizedMode.includes('sermon') || request.toLowerCase().includes('sermon')) {
    return `${baseSafety}

TASK: Generate a complete sermon or teaching outline from the user's request.
USER REQUEST: ${request}

Return with these headings:
1. Sermon Title
2. Primary Bible Text
3. Bible Context / Background
4. Big Idea
5. Introduction
6. Main Points with Scripture Support
7. Biblical Story or Example
8. Real-Life Illustration
9. Practical Applications
10. Prayer Points
11. Closing Prayer
12. Short Altar / Response Call

Make the sermon preach-ready, clear, faithful to Scripture, and practical for church, youth, students, family devotion, or small group.`;
  }

  if (normalizedMode.includes('passage') || normalizedMode.includes('topical') || normalizedMode.includes('character') || normalizedMode.includes('cross') || normalizedMode.includes('application') || normalizedMode.includes('devotion')) {
    return `${baseSafety}

TASK: Create a Bible study response.
MODE: ${mode}
QUESTION / PASSAGE / TOPIC: ${request}

Return with these headings:
1. Direct Answer
2. Bible Context
3. Key Scriptures
4. Interpretation
5. Cross References
6. Life Application
7. Reflection Questions
8. Prayer
9. Suggested Next Study

Use clear explanations and avoid overclaiming where the passage is debated.`;
  }

  if (request.toLowerCase().includes('prayer') || request.toLowerCase().includes('pray for')) {
    return `${baseSafety}

TASK: Generate a scripture-based prayer guide.
USER SITUATION: ${request}

Return with these headings:
1. Relevant Scriptures
2. Short Encouragement
3. Prayer of Surrender
4. Prayer Points
5. Declarations
6. 7-Day Prayer Focus
7. Action Step Today`;
  }

  return `${baseSafety}

TASK: Give scripture-centered Christian guidance for a life situation.
USER SITUATION: ${request}

Available app topics for recommendation:
${topicTitles}

Return with these headings:
1. Relevant Topics
2. Five Bible References
3. Scripture-Centered Encouragement
4. Biblical Wisdom / Interpretation
5. Prayer Points
6. Declarations
7. Seven-Day Reading Plan
8. Practical Action Step Today`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      demo: true,
      message: 'OPENAI_API_KEY is not configured in Vercel. Add it under Project Settings → Environment Variables and redeploy.',
    });
  }

  try {
    const { situation, topics = [], mode = 'guidance' } = req.body || {};
    if (!situation || !String(situation).trim()) {
      return res.status(400).json({ error: 'Please describe your situation, topic, scripture, or sermon request first.' });
    }

    const prompt = buildPrompt({ situation, topics, mode });

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a careful Christian Bible study, prayer, and sermon assistant. Give scripture-centered, non-denominational responses.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.35,
        max_tokens: 1800,
      }),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error('OpenAI API error', data);
      return res.status(r.status).json({ error: data?.error?.message || `OpenAI API request failed with status ${r.status}` });
    }

    return res.status(200).json({
      answer: data?.choices?.[0]?.message?.content || 'No answer was returned.',
      mode,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    });
  } catch (e) {
    console.error('Assistant API crashed', e);
    return res.status(500).json({ error: e?.message || 'Assistant API crashed.' });
  }
}
