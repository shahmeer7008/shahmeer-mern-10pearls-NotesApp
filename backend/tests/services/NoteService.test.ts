// Note Service Tests
import { expect } from 'chai';
import sinon from 'sinon';
import NoteService from '../../src/services/NoteService.js';
import pool from '../../src/config/database.js';

describe('NoteService', () => {
  let queryStub: sinon.SinonStub;

  beforeEach(() => {
    queryStub = sinon.stub(pool, 'query');
  });

  afterEach(() => {
    queryStub.restore();
  });

  describe('createNote', () => {
    it('should create a note successfully', async () => {
      const mockNote = {
        id: 'test-id',
        user_id: 'user-id',
        title: 'Test Note',
        content: 'Test content',
        created_at: new Date(),
        updated_at: new Date(),
      };

      queryStub.resolves({ rows: [mockNote] });

      const result = await NoteService.createNote(
        'user-id',
        'Test Note',
        'Test content'
      );

      expect(result).to.deep.equal(mockNote);
      expect(queryStub.calledOnce).to.be.true;
    });

    it('should throw error on invalid title', async () => {
      try {
        await NoteService.createNote('user-id', '', 'Content');
        expect.fail('Should throw error');
      } catch (err: any) {
        expect(err.message).to.include('Failed to create note');
      }
    });
  });

  describe('getNotes', () => {
    it('should fetch notes for user', async () => {
      const mockNotes = [
        {
          id: 'note-1',
          user_id: 'user-id',
          title: 'Note 1',
          content: 'Content 1',
        },
      ];

      queryStub.onFirstCall().resolves({ rows: mockNotes });
      queryStub.onSecondCall().resolves({ rows: [{ count: '1' }] });

      const result = await NoteService.getNotes('user-id');

      expect(result.notes).to.have.lengthOf(1);
      expect(result.total).to.equal(1);
    });

    it('should filter notes by search query', async () => {
      queryStub.onFirstCall().resolves({ rows: [] });
      queryStub.onSecondCall().resolves({ rows: [{ count: '0' }] });

      const result = await NoteService.getNotes('user-id', 'search');

      expect(result.notes).to.be.empty;
    });
  });

  describe('getNoteById', () => {
    it('should fetch a single note', async () => {
      const mockNote = {
        id: 'note-id',
        user_id: 'user-id',
        title: 'Test Note',
        content: 'Test content',
      };

      queryStub.resolves({ rows: [mockNote] });

      const result = await NoteService.getNoteById('user-id', 'note-id');

      expect(result).to.deep.equal(mockNote);
    });

    it('should throw error if note not found', async () => {
      queryStub.resolves({ rows: [] });

      try {
        await NoteService.getNoteById('user-id', 'nonexistent');
        expect.fail('Should throw error');
      } catch (err: any) {
        expect(err.message).to.equal('Note not found');
      }
    });
  });

  describe('updateNote', () => {
    it('should update a note', async () => {
      const mockNote = {
        id: 'note-id',
        user_id: 'user-id',
        title: 'Updated Note',
        content: 'Updated content',
      };

      queryStub.resolves({ rows: [mockNote] });

      const result = await NoteService.updateNote(
        'user-id',
        'note-id',
        'Updated Note',
        'Updated content'
      );

      expect(result.title).to.equal('Updated Note');
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      queryStub.resolves({ rows: [{ id: 'note-id' }] });

      await NoteService.deleteNote('user-id', 'note-id');

      expect(queryStub.calledOnce).to.be.true;
    });
  });

  describe('exportNotes', () => {
    it('should export notes as JSON', async () => {
      const mockNotes = [
        {
          id: 'note-1',
          title: 'Note 1',
          content: 'Content 1',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      queryStub.resolves({ rows: mockNotes });

      const result = await NoteService.exportNotes('user-id', 'json');

      expect(result).to.be.a('string');
      expect(JSON.parse(result)).to.be.an('array');
    });
  });
});
