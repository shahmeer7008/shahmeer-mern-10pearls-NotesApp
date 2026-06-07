// Note Model
import { v4 as uuidv4 } from 'uuid';

export interface NoteInput {
  title: string;
  content: string;
  user_id: string;
}

export interface Note extends NoteInput {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export class NoteModel {
  static create(userId: string, title: string, content: string): NoteInput {
    return {
      id: uuidv4(),
      title,
      content,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  static validateInput(title: string, content: string): string[] {
    const errors: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (title && title.length > 255) {
      errors.push('Title must be less than 255 characters');
    }

    if (content && content.length > 10000) {
      errors.push('Content must be less than 10000 characters');
    }

    return errors;
  }
}

export default NoteModel;
