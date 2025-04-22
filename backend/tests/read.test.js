// Mocks must be declared before importing the controller
const mongoose = require('mongoose');

// Mock chainable Mongoose query
const execMock = jest.fn();
const populateMock = jest.fn(() => ({ populate: populateMock, exec: execMock }));
const findOneMock = jest.fn(() => ({ populate: populateMock }));
mongoose.model = jest.fn().mockReturnValue({ findOne: findOneMock });

// Import after mocks
const read = require('@/controllers/appControllers/queryController/read');

describe('read controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: 'testId',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should return 200 with the document if found', async () => {
    execMock.mockResolvedValue({ _id: 'testId', client: {}, createdBy: { name: 'Admin' } });

    await read(req, res);

    expect(findOneMock).toHaveBeenCalledWith({ _id: 'testId', removed: false });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'We found this document',
      })
    );
  });

  it('should return 404 if document not found', async () => {
    execMock.mockResolvedValue(null);

    await read(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'No document found',
      })
    );
  });

  it('should return 500 if findOne throws an error', async () => {
    execMock.mockRejectedValue(new Error('DB error'));

    await read(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Failed to retrieve document',
        error: expect.any(Error),
      })
    );
  });
});