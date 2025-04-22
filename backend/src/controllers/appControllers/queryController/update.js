const mongoose = require('mongoose');
const Model = mongoose.model('Query');
const { increaseBySettingKey } = require('@/middlewares/settings');
const querySchema = require('./schema');

const update = async (req, res) => {
  let body = req.body;
  if (Array.isArray(body.notes)) {
    body["notes"] = body.notes.map((note) => ({
      content: note.content,
      createdAt: new Date(),
      createdBy: req.admin?._id,
    }));
  }

  const { error, value } = querySchema.validate(body, { allowUnknown: false });
  if (error) {
    const { details } = error;
    return res.status(400).json({
      success: false,
      result: null,
      message: details[0]?.message,
    }); 
  }

  if (typeof value.client === 'object' && value.client._id) {
    value.client = value.client._id;
  }

  body = {
    ...value,
    updatedBy: req.admin?._id,
    updatedAt: new Date(),
  };

  try {
    const query = await Model.findOne({ _id: req.params.id, removed: false });

    if (!query) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Query not found or already removed',
      });
    }

    // Update fields of the query
    Object.entries(body).forEach(([key, val]) => {
      query[key] = val;
    });

    const updatedQuery = await query.save();

    increaseBySettingKey({ settingKey: 'last_query_number' });
    return res.status(200).json({
      success: true,
      result: updatedQuery,
      message: 'Query updated successfully',
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to update query',
      error,
    });
  }
};

module.exports = update;
