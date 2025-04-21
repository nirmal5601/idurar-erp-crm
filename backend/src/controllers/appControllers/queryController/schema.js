const Joi = require('joi');
const querySchema = Joi.object({
    client: Joi.alternatives().try(Joi.string(), Joi.object()).required(),
    description: Joi.string().required(),
    resolution: Joi.string().allow('', null),
    status: Joi.string().valid('Open', 'Closed').required(),
  });

module.exports = querySchema;
