import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Crisis keywords & patterns
const CRISIS_PATTERNS = [
  /suicid/i,
  /kill(ing)?\s+(my|one)?self/i,
  /want\s+to\s+die/i,
  /end\s+(my|this)\s+life/i,
  /self[- ]?harm/i,
  /hurt(ing)?\s+(my|one)?self/i,
  /cutt(ing)?\s+myself/i,
  /take\s+my\s+own\s+life/i,
  /no\s+reason\s+to\s+live/i,
  /better\s+off\s+dead/i,
  /overdose/i
];

const CRISIS_RESPONSE = {
  message: `I hear how much pain you are experiencing right now, and I want you to know that your life has profound value. Please don't go through this alone. Because I am an AI wellness assistant and not a medical crisis counselor, please reach out immediately to trained compassionate professionals who are available right now to help you:

🚨 **Immediate Crisis Helplines (24/7 Confidential & Free):**
• **India (Tele-MANAS):** Call **14416** or **1800-891-4416** (National Mental Health Helpline)
• **India (Kiran Helpline):** Call **1800-599-0019**
• **India (Vandrevala Foundation):** Call or WhatsApp **+91 9999 666 555**
• **US & Canada:** Call or Text **988** (Suicide & Crisis Lifeline)
• **UK:** Call **111** (NHS Mental Health) or **116 123** (Samaritans)
• **International:** Visit **https://findahelpline.com** for confidential support in your country

Please reach out to one of these services, or contact a trusted friend, family member, or emergency healthcare professional. Help is available, and there are people who care and want to support you through this.`,
  isCrisis: true,
  actionSuggestions: [
    { label: 'Call Tele-MANAS (14416)', action: 'tel:14416' },
    { label: 'Find a Helpline Online', action: 'https://findahelpline.com' }
  ]
};

// Built-in intelligent empathetic response generator
const generateEmpatheticResponse = (userMessage, history = []) => {
  const text = userMessage.toLowerCase();

  if (text.includes('anxious') || text.includes('anxiety') || text.includes('panic') || text.includes('nervous')) {
    return {
      message: `I hear you, and feeling anxious can be really overwhelming. Let's ground ourselves together right now. 

Take a gentle pause. Try placing your feet flat on the floor and taking one slow breath in for 4 seconds, holding for 4, and exhaling softly for 6 seconds. 

Would you like to try our **Box Breathing exercise** or the **5-4-3-2-1 Grounding technique** in the Mindfulness tab? Remember that anxiety is a temporary physical sensation in your body, and it will pass. I'm here with you.`,
      suggestedActivity: 'Box Breathing'
    };
  }

  if (text.includes('stress') || text.includes('overwhelm') || text.includes('burnout') || text.includes('too much work') || text.includes('exam')) {
    return {
      message: `It sounds like you are carrying a very heavy load right now. Acknowledge yourself for managing so much, especially with university and daily pressures.

When stress builds up, breaking things down into the very next 15-minute action helps lower cognitive overload. 

Here is a quick reset you can do right now:
1. Roll your shoulders back and un-clench your jaw.
2. Step away from your screen for a 2-minute glass of water.
3. Write down just the single top priority in your MindCare journal.

Would you like to do a quick 3-minute guided relaxation session?`,
      suggestedActivity: '4-7-8 Breathing'
    };
  }

  if (text.includes('sad') || text.includes('lonely') || text.includes('depressed') || text.includes('down') || text.includes('crying') || text.includes('heartbroken')) {
    return {
      message: `I'm truly sorry you're feeling down today. Please be gentle with yourself. It is completely okay to feel sad or quiet—our emotions ebb and flow like the tide.

You don't have to force yourself to "fix" everything immediately. Pour yourself a warm cup of tea, wrap yourself in comfort, and if you feel up to it, writing out your raw feelings in our private Journal can sometimes lighten the mental weight.

*Reminder: While I am here for gentle support, if feelings of sadness persist for weeks, speaking with a licensed therapist or university counselor is a courageous and supportive step.*`,
      suggestedActivity: 'Private Journaling'
    };
  }

  if (text.includes('happy') || text.includes('grateful') || text.includes('great') || text.includes('good day') || text.includes('excited') || text.includes('proud')) {
    return {
      message: `That brings a smile to hear! Celebrating positive moments—no matter how big or small—builds emotional resilience and neuroplasticity.

What was one specific moment today that made you feel this way? I encourage you to log this in your **Daily Mood Tracker** or write a quick gratitude note in your Journal so you can look back on this sunny day when things feel tougher.

Keep shining and nurturing this joyful energy!`,
      suggestedActivity: 'Daily Mood Tracker'
    };
  }

  if (text.includes('sleep') || text.includes('insomnia') || text.includes('tired') || text.includes('exhausted') || text.includes('cant sleep')) {
    return {
      message: `Rest is the foundation of mental clarity and emotional regulation. When sleep is elusive, try not to fight the clock.

A proven practice for bedtime is the **4-7-8 Relaxing Breath**:
• Inhale quietly through your nose for 4 counts
• Hold your breath gently for 7 counts
• Exhale completely through your mouth for 8 counts

Doing this for 4 rounds triggers your parasympathetic nervous system (rest & digest). Dim your screens and give your mind permission to rest for tonight.`,
      suggestedActivity: '4-7-8 Breathing'
    };
  }

  // Default warm response
  return {
    message: `Thank you for sharing that with me. Acknowledging how you feel in this moment is the very first step toward emotional balance.

As your MindCare wellness guide, I'm here to listen, offer calming perspectives, and guide you through breathing and mindfulness exercises. 

How does your body feel right now? Are your shoulders tense, or is your breath shallow? Let's take one mindful breath together. What would bring you the most comfort right now?`,
    suggestedActivity: 'Guided Meditation'
  };
};

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const trimmedMessage = message.trim();

    // 1. Check for immediate crisis / self-harm
    const isCrisisDetected = CRISIS_PATTERNS.some(pattern => pattern.test(trimmedMessage));
    if (isCrisisDetected) {
      return res.json({
        success: true,
        reply: CRISIS_RESPONSE.message,
        isCrisis: true,
        actionSuggestions: CRISIS_RESPONSE.actionSuggestions,
        source: 'MindCare Safety Crisis Guardrail'
      });
    }

    // 2. Real Gemini API if key is present
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const systemPrompt = `You are MindCare AI, a gentle, empathetic mental wellness companion in a university project application (Case 59 – MindCare Mental Wellness Platform, Dayananda Sagar University).
Your goal is to provide supportive, non-judgmental listening, suggest mindfulness exercises, breathing techniques (like 4-7-8, box breathing), and positive coping tips.
MANDATORY SAFETY RULES:
1. You are NOT a doctor, therapist, or medical diagnostic tool. NEVER diagnose mental illnesses or clinical conditions.
2. NEVER prescribe medications or suggest medical treatments.
3. If the user mentions self-harm, suicide, or crisis, instruct them to contact 14416 (Tele-MANAS) or emergency services immediately.
4. Keep answers warm, conversational, encouraging, and concise (2 to 4 short paragraphs). Encourage seeking professional healthcare when appropriate.`;

        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

        const requestBody = {
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Message: ${trimmedMessage}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        };

        const response = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return res.json({
              success: true,
              reply: replyText,
              isCrisis: false,
              source: 'Gemini 1.5 Flash (Cloud API)'
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to built-in empathetic engine:', geminiError.message);
      }
    }

    // 3. Fallback: Built-in empathetic engine
    const fallback = generateEmpatheticResponse(trimmedMessage, conversationHistory);
    return res.json({
      success: true,
      reply: fallback.message,
      suggestedActivity: fallback.suggestedActivity,
      isCrisis: false,
      source: 'MindCare Empathetic Assistant Engine (Demo & Offline Mode)'
    });
  } catch (error) {
    console.error('Chat Route Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process wellness chat response.' });
  }
});

export default router;
