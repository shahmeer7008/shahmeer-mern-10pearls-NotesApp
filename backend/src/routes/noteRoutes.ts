// Note Routes
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import noteController from '../controllers/noteController.js';

const router = Router();

// Apply auth middleware to all note routes
router.use(authMiddleware);

// Create a new note
router.post('/', noteController.createNote);

// Import notes in batch
router.post('/import', noteController.importNotes);

// Get all notes with search and pagination
router.get('/', noteController.getNotes);

// Get a single note
router.get('/:id', noteController.getNoteById);

// Update a note
router.put('/:id', noteController.updateNote);

// Delete a note
router.delete('/:id', noteController.deleteNote);

// Export notes
router.get('/export/:format', noteController.exportNotes);

export default router;
