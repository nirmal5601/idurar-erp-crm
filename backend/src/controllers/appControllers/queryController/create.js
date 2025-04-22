const mongoose = require('mongoose');
const Model = mongoose.model('Query');
const { increaseBySettingKey } = require('@/middlewares/settings');
const querySchema = require('./schema');

const create = async (req, res) => {
  let body = req.body;

  if (Array.isArray(body.notes)) {
    body["notes"] = body.notes.map((note) => ({
      content: note.content,
      createdAt: new Date(),
      createdBy: req.admin?._id,
    }));
  }
  const { error, value } = querySchema.validate(body);
  if (error) {
    const { details } = error;
    return res.status(400).json({
      success: false,
      result: null,
      message: details[0]?.message,
    });
  }

  body = {
    ...value,
    createdBy: req.admin?._id,
    createdAt: new Date(),
  };

  try {
    const result = await new Model(body).save();
    increaseBySettingKey({ settingKey: 'last_query_number' });

    return res.status(200).json({
      success: true,
      result,
      message: 'Query created successfully',
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to create query',
      error,
    });
  }
};

module.exports = create;
