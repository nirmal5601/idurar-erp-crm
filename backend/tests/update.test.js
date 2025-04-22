// Move the mocks ABOVE the import of update
const mongoose = require('mongoose');

// Mock Mongoose model
const saveMock = jest.fn();
const findOneMock = jest.fn();
const mockModelInstance = {
  save: saveMock,
};
const mockModel = jest.fn(() => mockModelInstance);
mockModel.findOne = findOneMock;
mongoose.model = jest.fn().mockReturnValue(mockModel);

// Import update AFTER mocks
const update = require('@/controllers/appControllers/queryController/update');

describe('update controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'queryId' },
      body: {
        client: { _id: 'clientId' },
        description: 'Updated description',
        resolution: 'Resolved',
        status: 'Closed',
        notes: [{ content: 'Updated note' }],
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    saveMock.mockClear();
    findOneMock.mockClear();
  });

  it('should return 200 on successful query update', async () => {
    findOneMock.mockResolvedValue({
      _id: 'queryId',
      save: saveMock,
    });
    saveMock.mockResolvedValue({ _id: 'queryId', ...req.body });

    await update(req, res);

    expect(findOneMock).toHaveBeenCalledWith({
      _id: req.params.id,
      removed: false,
    });
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Query updated successfully',
      })
    );
  });

  it('should return 400 on Joi validation error', async () => {
    req.body.description = null;

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.any(String),
      })
    );
  });

  it('should return 404 if query is not found or already removed', async () => {
    findOneMock.mockResolvedValue(null); // No query found

    await update(req, res);

    expect(findOneMock).toHaveBeenCalledWith({
      _id: req.params.id,
      removed: false,
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Query not found or already removed',
      })
    );
  });

  it('should return 500 on MongoDB save error', async () => {
    findOneMock.mockResolvedValue({
      _id: 'queryId',
      save: saveMock,
    });
    saveMock.mockRejectedValue(new Error('DB error'));

    await update(req, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Failed to update query',
        error: expect.any(Error),
      })
    );
  });
});