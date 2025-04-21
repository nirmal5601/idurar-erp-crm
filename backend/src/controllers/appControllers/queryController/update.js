const mongoose = require('mongoose');
const Model = mongoose.model('Query');
const querySchema = require('./schema'); // Reuse the shared Joi schema

const update = async (req, res) => {
  // Validate the request body
  const { error, value } = querySchema.validate(req.body, { allowUnknown: false });
  if (error) {
    const { details } = error;
    return res.status(400).json({
      success: false,
      result: null,
      message: details[0]?.message,
    });
  }

  // Normalize client if it's an object
  if (typeof value.client === 'object' && value.client._id) {
    value.client = value.client._id;
  }

  try {
    const query = await Model.findById(req.params.id);
    if (!query) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Query not found',
      });
    }

    // Dynamically apply validated updates
    Object.entries(value).forEach(([key, val]) => {
      query[key] = val;
    });

    const updatedQuery = await query.save();

    return res.status(200).json({
      success: true,
      result: updatedQuery,
      message: 'Query updated successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Failed to update query',
      error,
    });
  }
};

module.exports = update;
