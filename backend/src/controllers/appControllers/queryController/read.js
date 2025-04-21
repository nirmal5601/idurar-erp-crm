const mongoose = require('mongoose');
const Model = mongoose.model('Query');

const read = async (req, res) => {
  try {
    const result = await Model.findOne({ _id: req.params.id })
      .populate('client') // full client info
      .populate('createdBy', 'name') // just name of creator
      .exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found',
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'We found this document',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to retrieve document',
      error,
    });
  }
};

module.exports = read;
