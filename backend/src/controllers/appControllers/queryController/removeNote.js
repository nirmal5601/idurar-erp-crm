const mongoose = require('mongoose');
const Model = mongoose.model('Query');

const removeNote = async (req, res) => {
  try {
    const { id, noteId } = req.params;

    const query = await Model.findById(id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    if (!Array.isArray(query.notes)) {
      query.notes = [];
    }

    const noteIndex = query.notes.findIndex((note) => note?._id?.toString() === noteId);
    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }

    query.notes.splice(noteIndex, 1);
    await query.save();

    return res.status(200).json({
      success: true,
      result: query,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Failed to delete note',
      error: error.message,
    });
  }
};

module.exports = removeNote;