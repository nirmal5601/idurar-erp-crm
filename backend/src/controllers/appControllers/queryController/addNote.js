const mongoose = require('mongoose');
const Model = mongoose.model('Query');
const Joi = require('joi');

const noteSchema = Joi.object({
  noteId: Joi.string().optional(),
  content: Joi.string().required(),
  createdAt: Joi.date().optional(),
  createdBy: Joi.string().optional(),
});

const addNote = async (req, res) => {
  try {
    const { error, value } = noteSchema.validate(req.body);
    if (error) {
      const { details } = error;
      return res.status(400).json({
        success: false,
        result: null,
        message: details[0]?.message,
      });
    }

    const { content } = value;

    const query = await Model.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    const newNote = {
      content,
      createdBy: req.admin?._id,
      createdAt: new Date(),
    };

    query.notes.push(newNote);
    await query.save();

    return res.status(201).json({
      success: true,
      result: query,
      message: 'Note added successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to add note',
      error,
    });
  }
};

module.exports = addNote;