const axios = require('axios');
const mongoose = require('mongoose');
const Model = mongoose.model('Invoice');
require('dotenv').config();

const findAIDocument = async (req, res) => {
  try {

    const result = await Model.findOne({
      _id: req.params.id,
      removed: false,
    }).populate('client')
      .populate('createdBy', 'name')
      .exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found',
      });
    }
    const summary = await generateGeminiSummary(JSON.stringify(result.items));
    const summarytext = summary?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available"
    result.aiSummary = summarytext;
    await result.save();

    return res.status(200).json({
      success: true,
      result,
      message: 'AI summary generated successfully',
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const generateGeminiSummary = async (notes) => {
  const GEMINI_API_KEY = process.env.OPENAI_API_KEY;
  const GEMINI_API_URL = process.env.API_URL;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: notes,
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data || "No summary available.";
  } catch (error) {
    console.error("Error generating AI summary with Gemini API:", error);
    return "Error generating summary.";
  }
};

module.exports = findAIDocument;
