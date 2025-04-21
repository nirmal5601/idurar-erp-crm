const mongoose = require('mongoose');
const Model = mongoose.model('Query');

const paginatedList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page - 1) * limit;

    const filter = { removed: { $ne: true } };

    const { filter: field, equal: value } = req.query;
    if (field && value) {
      filter[field] = value;
    }

    const total = await Model.countDocuments(filter);
    const result = await Model.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('client')
      .populate('createdBy', 'name')
      .exec();

    return res.status(200).json({
      success: true,
      result,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        count: total,
      },
      message: 'Successfully found all documents',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to retrieve queries',
      error,
    });
  }
};

module.exports = paginatedList;
