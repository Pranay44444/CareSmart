const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// ── Helper: safely parse JSON from Gemini response ───────────────────────────
/**
 * Gemini sometimes wraps JSON in markdown code fences (```json ... ```).
 * This helper strips those and extracts the first JSON array found.
 * @param {string} text - raw text from Gemini
 * @returns {Array} parsed array, or [] on failure
 */
const safeParseJSONArray = (text) => {
  // 1. Strip markdown code fences if present
  let cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  // 2. Extract the first JSON array using regex
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (!match) {
    throw new Error('No JSON array found in Gemini response');
  }

  // 3. Parse
  return JSON.parse(match[0]);
};

// ── POST /api/ai/recommend ───────────────────────────────────────────────────
/**
 * @desc    Get AI-powered accessory recommendations based on user's device profile
 * @route   POST /api/ai/recommend
 * @access  Private
 * @body    { deviceType, brand, model, usagePattern, issues }
 */
const getRecommendations = async (req, res) => {
  try {
    const {
      deviceType,
      brand,
      model: deviceModel,
      usagePattern,
      issues,
    } = req.body;

    if (!deviceType || !brand || !deviceModel) {
      return res.status(400).json({
        message: 'deviceType, brand, and model are required',
      });
    }

    const prompt = `You are a device care expert for CareSmart ecommerce platform.
A user has:
- Device: ${deviceType} (${brand} ${deviceModel})
- Usage pattern: ${usagePattern || 'general use'}
- Current issues: ${issues || 'none mentioned'}

Recommend exactly 3-5 accessories from these categories:
For smartphones: protective cases, screen protectors, fast chargers, power banks, wireless chargers
For laptops: laptop stands, cooling pads, USB-C hubs, external SSDs, laptop sleeves

For each accessory explain specifically WHY it helps prevent risks for this exact device model and usage pattern.

IMPORTANT: Respond with ONLY a valid JSON array, no extra text:
[
  {
    "name": "accessory name",
    "category": "smartphone or laptop",
    "reason": "why this helps this specific device",
    "risk": "what problem it prevents"
  }
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let recommendations = [];
    let parseError = null;

    try {
      recommendations = safeParseJSONArray(text);
    } catch (err) {
      console.error('Failed to parse Gemini JSON response:', err.message);
      console.error('Raw Gemini output:', text);
      parseError = 'Could not parse AI response. Raw output logged server-side.';
    }

    res.status(200).json({
      recommendations,
      ...(parseError && { warning: parseError }),
    });
  } catch (error) {
    console.error('getRecommendations error:', error);

    // Handle Gemini API key / quota errors specifically
    if (error.message?.includes('API_KEY')) {
      return res.status(500).json({ message: 'AI service configuration error' });
    }
    if (error.message?.includes('quota') || error.status === 429) {
      return res.status(429).json({ message: 'AI service quota exceeded, please try again later' });
    }

    res.status(500).json({ message: 'Server error generating recommendations' });
  }
};

// ── POST /api/ai/summarize-reviews ───────────────────────────────────────────
/**
 * @desc    Generate an AI summary of product reviews
 * @route   POST /api/ai/summarize-reviews
 * @access  Public
 * @body    { reviews: [{ rating, comment }] }
 */
const summarizeReviews = async (req, res) => {
  try {
    const { reviews } = req.body;

    // Guard: no reviews to summarize
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return res.status(200).json({ summary: 'No reviews yet.' });
    }

    // Filter out reviews with no comment to keep prompt clean
    const validReviews = reviews.filter(
      (r) => r.comment && r.comment.trim().length > 0
    );

    if (validReviews.length === 0) {
      return res.status(200).json({ summary: 'No written reviews available yet.' });
    }

    const reviewText = validReviews
      .map((r) => `Rating: ${r.rating}/5 - ${r.comment}`)
      .join('\n');

    const prompt = `Summarize these product reviews in exactly 2-3 sentences.
Be balanced, mention both positives and negatives if present.
Reviews:
${reviewText}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    res.status(200).json({ summary: text });
  } catch (error) {
    console.error('summarizeReviews error:', error);

    if (error.message?.includes('API_KEY')) {
      return res.status(500).json({ message: 'AI service configuration error' });
    }
    if (error.message?.includes('quota') || error.status === 429) {
      return res.status(429).json({ message: 'AI service quota exceeded, please try again later' });
    }

    res.status(500).json({ message: 'Server error generating review summary' });
  }
};

module.exports = { getRecommendations, summarizeReviews };
