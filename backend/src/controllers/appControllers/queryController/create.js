const mongoose = require('mongoose');
const Joi = require('joi');
const Model = mongoose.model('Query');

const { increaseBySettingKey } = require('@/middlewares/settings');
const querySchema = require('./schema');
const create = async (req, res) => {
  let body = req.body;

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
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Failed to create query',
      error,
    });
  }
};

module.exports = create;
