const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;

const noteSchema = Joi.object({
  content: Joi.string().required(),
  createdAt: Joi.date().optional(),
  createdBy: Joi.custom((value) => {
    if (!ObjectId.isValid(value)) {
      throw new Error('createdBy must be a valid ObjectId');
    }
    return value;
  }).optional(),
});

const querySchema = Joi.object({
  client: Joi.alternatives().try(Joi.string(), Joi.object()).required(),
  description: Joi.string().required(),
  resolution: Joi.string().allow('', null),
  status: Joi.string().valid('Open', 'InProgress', 'Closed').required(),
  notes: Joi.array().items(noteSchema).optional()
});

module.exports = querySchema;