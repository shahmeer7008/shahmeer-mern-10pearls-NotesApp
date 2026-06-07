// Note Service - Business Logic
import pool from '../config/database.js';
import { Note } from '../models/Note.js';
import logger from '../config/logger.js';
import { AppError } from '../middleware/errorHandler.js';

export class NoteService {
  // Create a new note
  static async createNote(
    userId: string,
    title: string,
    content: string,
    searchQuery?: string
  ): Promise<Note> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const query = `
        INSERT INTO notes (user_id, title, content, search_vector)
        VALUES ($1, $2, $3, to_tsvector('english', $2 || ' ' || COALESCE($4, '')))
        RETURNING *
      `;

      const result = await client.query(query, [userId, title, content, searchQuery || title]);

      await client.query('COMMIT');

      logger.info({
        type: 'NOTE_CREATED',
        userId,
        noteId: result.rows[0].id,
      });

      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      logger.error({ type: 'NOTE_CREATE_ERROR', error: err, userId });
      throw new AppError('Failed to create note', 500, 'NOTE_CREATE_ERROR');
    } finally {
      client.release();
    }
  }

  // Get all notes for a user with optional search and pagination
  static async getNotes(
    userId: string,
    searchQuery?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ notes: Note[]; total: number }> {
    const offset = (page - 1) * limit;

    try {
      let query = `
        SELECT * FROM notes 
        WHERE user_id = $1
      `;
      const params: any[] = [userId];

      if (searchQuery) {
        query += ` AND (
          title ILIKE $${params.length + 1} OR
          content ILIKE $${params.length + 1}
        )`;
        params.push(`%${searchQuery}%`);
      }

      query += ` ORDER BY updated_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM notes WHERE user_id = $1';
      const countParams: any[] = [userId];

      if (searchQuery) {
        countQuery += ` AND (
          title ILIKE $${countParams.length + 1} OR
          content ILIKE $${countParams.length + 1}
        )`;
        countParams.push(`%${searchQuery}%`);
      }

      const countResult = await pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count, 10);

      logger.info({
        type: 'NOTES_FETCHED',
        userId,
        count: result.rows.length,
        searchQuery,
      });

      return { notes: result.rows, total };
    } catch (err) {
      logger.error({ type: 'NOTES_FETCH_ERROR', error: err, userId });
      throw new AppError('Failed to fetch notes', 500, 'NOTES_FETCH_ERROR');
    }
  }

  // Get a single note by ID
  static async getNoteById(userId: string, noteId: string): Promise<Note> {
    try {
      const query = 'SELECT * FROM notes WHERE id = $1 AND user_id = $2';
      const result = await pool.query(query, [noteId, userId]);

      if (result.rows.length === 0) {
        throw new AppError('Note not found', 404, 'NOTE_NOT_FOUND');
      }

      logger.info({
        type: 'NOTE_FETCHED',
        userId,
        noteId,
      });

      return result.rows[0];
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error({ type: 'NOTE_FETCH_ERROR', error: err, userId, noteId });
      throw new AppError('Failed to fetch note', 500, 'NOTE_FETCH_ERROR');
    }
  }

  // Update a note
  static async updateNote(
    userId: string,
    noteId: string,
    title: string,
    content: string
  ): Promise<Note> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const query = `
        UPDATE notes 
        SET title = $1, content = $2, updated_at = NOW(), 
            search_vector = to_tsvector('english', $1 || ' ' || $2)
        WHERE id = $3 AND user_id = $4
        RETURNING *
      `;

      const result = await client.query(query, [title, content, noteId, userId]);

      if (result.rows.length === 0) {
        throw new AppError('Note not found', 404, 'NOTE_NOT_FOUND');
      }

      await client.query('COMMIT');

      logger.info({
        type: 'NOTE_UPDATED',
        userId,
        noteId,
      });

      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      if (err instanceof AppError) throw err;
      logger.error({ type: 'NOTE_UPDATE_ERROR', error: err, userId, noteId });
      throw new AppError('Failed to update note', 500, 'NOTE_UPDATE_ERROR');
    } finally {
      client.release();
    }
  }

  // Delete a note
  static async deleteNote(userId: string, noteId: string): Promise<void> {
    try {
      const query = 'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id';
      const result = await pool.query(query, [noteId, userId]);

      if (result.rows.length === 0) {
        throw new AppError('Note not found', 404, 'NOTE_NOT_FOUND');
      }

      logger.info({
        type: 'NOTE_DELETED',
        userId,
        noteId,
      });
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error({ type: 'NOTE_DELETE_ERROR', error: err, userId, noteId });
      throw new AppError('Failed to delete note', 500, 'NOTE_DELETE_ERROR');
    }
  }

  // Export notes to JSON
  static async exportNotes(userId: string, format: 'json' | 'csv' = 'json'): Promise<string> {
    try {
      const query = 'SELECT id, title, content, created_at, updated_at FROM notes WHERE user_id = $1 ORDER BY updated_at DESC';
      const result = await pool.query(query, [userId]);

      if (format === 'csv') {
        return this.convertToCsv(result.rows);
      }

      logger.info({
        type: 'NOTES_EXPORTED',
        userId,
        format,
        count: result.rows.length,
      });

      return JSON.stringify(result.rows, null, 2);
    } catch (err) {
      logger.error({ type: 'NOTES_EXPORT_ERROR', error: err, userId });
      throw new AppError('Failed to export notes', 500, 'NOTES_EXPORT_ERROR');
    }
  }

  static async importNotes(userId: string, notes: Array<{ title: string; content?: string; created_at?: string; updated_at?: string }>) {
    if (!notes || notes.length === 0) {
      throw new AppError('No notes provided for import', 400, 'VALIDATION_ERROR');
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const values: string[] = [];
      const params: any[] = [userId];

      notes.forEach((note, index) => {
        const idx = index * 4;
        values.push(
          `($1, $${idx + 2}, $${idx + 3}, COALESCE($${idx + 4}, NOW()), COALESCE($${idx + 5}, NOW()), to_tsvector('english', $${idx + 2} || ' ' || COALESCE($${idx + 3}, '')))`,
        );
        params.push(note.title || '', note.content || '', note.created_at || null, note.updated_at || null);
      });

      const query = `
        INSERT INTO notes (user_id, title, content, created_at, updated_at, search_vector)
        VALUES ${values.join(', ')}
        RETURNING *
      `;

      const result = await client.query(query, params);
      await client.query('COMMIT');

      logger.info({
        type: 'NOTES_IMPORTED',
        userId,
        count: result.rows.length,
      });

      return result.rows;
    } catch (err) {
      await client.query('ROLLBACK');
      logger.error({ type: 'NOTES_IMPORT_ERROR', error: err, userId });
      throw new AppError('Failed to import notes', 500, 'NOTES_IMPORT_ERROR');
    } finally {
      client.release();
    }
  }

  private static convertToCsv(notes: any[]): string {
    const headers = ['ID', 'Title', 'Content', 'Created At', 'Updated At'];
    const rows = notes.map(note => [
      note.id,
      `"${note.title.replace(/"/g, '""')}"`,
      `"${note.content.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      note.created_at,
      note.updated_at,
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export default NoteService;
