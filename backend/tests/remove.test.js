// Mock mongoose BEFORE importing controller
const mongoose = require('mongoose');

// Mock chainable mongoose query
const execMock = jest.fn();
const findOneAndUpdateMock = jest.fn(() => ({ exec: execMock }));
mongoose.model = jest.fn().mockReturnValue({ findOneAndUpdate: findOneAndUpdateMock });

// Import after mocks
const remove = require('@/controllers/appControllers/queryController/delete');

describe('remove controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: 'queryId',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should return 200 when a query is successfully soft-deleted', async () => {
    execMock.mockResolvedValue({ _id: 'queryId', removed: true });

    await remove(req, res);

    expect(findOneAndUpdateMock).toHaveBeenCalledWith(
      { _id: 'queryId', removed: false },
      { $set: { removed: true } },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Query deleted successfully',
      })
    );
  });

  it('should return 404 if the query is not found', async () => {
    execMock.mockResolvedValue(null);

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Query not found',
      })
    );
  });

  it('should return 400 if an error occurs during deletion', async () => {
    execMock.mockRejectedValue(new Error('Deletion failed'));

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Failed to delete query',
        error: expect.any(Error),
      })
    );
  });
});