// Note Controller
import { Request, Response, NextFunction } from 'express';
import NoteService from '../services/NoteService.js';
import NoteModel from '../models/Note.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import logger from '../config/logger.js';

export const noteController = {
  // POST /api/notes - Create a new note
  createNote: asyncHandler(async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User ID is required', 401, 'UNAUTHORIZED');
    }

    // Validate input
    const errors = NoteModel.validateInput(title, content);
    if (errors.length > 0) {
      throw new AppError(errors.join(', '), 400, 'VALIDATION_ERROR');
    }

    const note = await NoteService.createNote(userId, title, content, title);

    res.status(201).json({
      success: true,
      data: note,
    });
  }),

  // GET /api/notes - Get all notes for the user
  getNotes: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { search, page = '1', limit = '10' } = req.query;

    if (!userId) {
      throw new AppError('User ID is required', 401, 'UNAUTHORIZED');
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    if (pageNum < 1 || limitNum < 1) {
      throw new AppError('Page and limit must be positive numbers', 400, 'VALIDATION_ERROR');
    }

    const { notes, total } = await NoteService.getNotes(
      userId,
      search as string | undefined,
      pageNum,
      limitNum
    );

    res.status(200).json({
      success: true,
      data: {
        notes,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  }),

  // GET /api/notes/:id - Get a single note
  getNoteById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User ID is required', 401, 'UNAUTHORIZED');
    }

    const note = await NoteService.getNoteById(userId, id);

    res.status(200).json({
      success: true,
      data: note,
    });
  }),

  // PUT /api/notes/:id - Update a note
  updateNote: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User ID is required', 401, 'UNAUTHORIZED');
    }

    // Validate input
    const errors = NoteModel.validateInput(title, content);
    if (errors.length > 0) {
      throw new AppError(errors.join(', '), 400, 'VALIDATION_ERROR');
    }

    const note = await NoteService.updateNote(userId, id, title, content);

    res.status(200).json({
      success: true,
      data: note,
    });
  }),

  // DELETE /api/notes/:id - Delete a note
  deleteNote: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User ID is required', 401, 'UNAUTHORIZED');
    }

    await NoteService.deleteNote(userId, id);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  }),

  // GET /api/notes/export/:format - Export notes
  exportNotes: asyncHandler(async (req: Request, res: Response) => {
    const { format = 'json' } = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User ID is required', 401, 'UNAUTHORIZED');
    }

    if (!['json', 'csv'].includes(format)) {
      throw new AppError('Invalid export format', 400, 'INVALID_FORMAT');
    }

    const data = await NoteService.exportNotes(userId, format as 'json' | 'csv');

    const contentType = format === 'csv' ? 'text/csv' : 'application/json';
    const filename = `notes-export-${new Date().toISOString().split('T')[0]}.${format}`;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(data);
  }),
};

export default noteController;
