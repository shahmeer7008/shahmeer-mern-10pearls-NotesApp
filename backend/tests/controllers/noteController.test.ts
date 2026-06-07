// Note Controller Tests
import { expect } from 'chai';
import sinon from 'sinon';
import { noteController } from '../../src/controllers/noteController.js';
import NoteService from '../../src/services/NoteService.js';
import { Request, Response } from 'express';

describe('noteController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let createNoteStub: sinon.SinonStub;
  let getNotesStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      userId: 'test-user-id',
      body: {},
      query: {},
      params: {},
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      setHeader: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis(),
    };

    createNoteStub = sinon.stub(NoteService, 'createNote');
    getNotesStub = sinon.stub(NoteService, 'getNotes');
  });

  afterEach(() => {
    createNoteStub.restore();
    getNotesStub.restore();
  });

  describe('createNote', () => {
    it('should create a note successfully', async () => {
      req.body = { title: 'Test', content: 'Content' };

      const mockNote = {
        id: 'note-id',
        user_id: 'test-user-id',
        title: 'Test',
        content: 'Content',
      };

      createNoteStub.resolves(mockNote);

      await noteController.createNote(req as Request, res as Response);

      expect((res.status as sinon.SinonStub).calledWith(201)).to.be.true;
      expect((res.json as sinon.SinonStub).calledOnce).to.be.true;
    });
  });

  describe('getNotes', () => {
    it('should fetch all notes', async () => {
      const mockNotes = {
        notes: [{ id: 'note-1', title: 'Test' }],
        total: 1,
      };

      getNotesStub.resolves(mockNotes);

      await noteController.getNotes(req as Request, res as Response);

      expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
    });
  });
});
