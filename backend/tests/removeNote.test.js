// Mock mongoose BEFORE importing the controller
const mongoose = require('mongoose');

// Mock chainable mongoose query
const execMock = jest.fn();
const findByIdMock = jest.fn(() => ({ exec: execMock }));
const saveMock = jest.fn();
mongoose.model = jest.fn().mockReturnValue({ findById: findByIdMock, save: saveMock });

// Import after mocks
const deleteNote = require('@/controllers/appControllers/queryController/removeNote');

describe('deleteNote controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'queryId', noteId: 'noteId' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should return 404 if query is not found', async () => {
    findByIdMock.mockResolvedValue(null);

    await deleteNote(req, res);

    expect(findByIdMock).toHaveBeenCalledWith('queryId');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Query not found' });
  });

  it('should return 404 if note is not found in the query', async () => {
    const mockQuery = {
      _id: 'queryId',
      notes: [{ _id: 'anotherNoteId', content: 'Test note' }],
    };
    findByIdMock.mockResolvedValue(mockQuery);

    await deleteNote(req, res);

    expect(findByIdMock).toHaveBeenCalledWith('queryId');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Note not found' });
  });

  it('should return 200 if note is deleted successfully', async () => {
    const mockQuery = {
      _id: 'queryId',
      notes: [{ _id: 'noteId', content: 'Test note' }],
      save: saveMock,
    };
    findByIdMock.mockResolvedValue(mockQuery);
    saveMock.mockResolvedValue(mockQuery);

    await deleteNote(req, res);

    expect(findByIdMock).toHaveBeenCalledWith('queryId');
    expect(mockQuery.notes.length).toBe(0); // Ensure note is deleted
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Note deleted successfully',
      result: mockQuery,
    });
  });

  it('should handle errors and return 400', async () => {
    findByIdMock.mockRejectedValue(new Error('DB Error'));

    await deleteNote(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Failed to delete note',
        error: expect.any(String),
      })
    );
  });
});