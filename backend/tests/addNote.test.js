// Mocks setup
const mongoose = require('mongoose');

const saveMock = jest.fn();
const findByIdMock = jest.fn();

class MockModel {
  constructor(data = {}) {
    this.notes = data.notes || [];
    this.save = saveMock;
  }

  static findById = findByIdMock;
}

mongoose.model = jest.fn(() => MockModel);

const addNote = require('@/controllers/appControllers/queryController/addNote');

describe('addNote controller', () => {
  let req, res;
  let freshMockDoc;

  beforeEach(() => {
    freshMockDoc = new MockModel();

    req = {
      params: { id: 'queryId' },
      body: { content: 'This is a new note' },
      admin: { _id: 'adminId' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    saveMock.mockClear();
    findByIdMock.mockReset();
  });

  it('should return 400 on Joi validation error', async () => {
    req.body.content = null;

    await addNote(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.any(String),
      })
    );
  });

  it('should return 404 if query is not found', async () => {
    findByIdMock.mockResolvedValue(null);

    await addNote(req, res);

    expect(findByIdMock).toHaveBeenCalledWith('queryId');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Query not found',
      })
    );
  });
});