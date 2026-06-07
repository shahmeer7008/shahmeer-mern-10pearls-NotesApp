// Export/Import Notes Utility
import { Note } from '../types';

export const exportNotesAsJSON = (notes: Note[]): void => {
  const dataStr = JSON.stringify(notes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  downloadFile(dataBlob, `notes-${new Date().toISOString().split('T')[0]}.json`);
};

export const exportNotesAsCSV = (notes: Note[]): void => {
  const headers = ['ID', 'Title', 'Content', 'Created At', 'Updated At'];
  const rows = notes.map(note => [
    note.id,
    `"${note.title.replace(/"/g, '""')}"`,
    `"${note.content.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    note.created_at,
    note.updated_at,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, `notes-${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportNotesAsMarkdown = (notes: Note[]): void => {
  const markdown = notes
    .map(note => {
      return `# ${note.title}\n\n${note.content}\n\n---\n\n`;
    })
    .join('\n');

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
  downloadFile(blob, `notes-${new Date().toISOString().split('T')[0]}.md`);
};

export const importNotesFromFile = async (file: File): Promise<Note[]> => {
  const text = await file.text();

  if (file.name.endsWith('.json')) {
    return JSON.parse(text);
  } else if (file.name.endsWith('.csv')) {
    return parseCSV(text);
  } else {
    throw new Error('Unsupported file format');
  }
};

const parseCSV = (csv: string): Note[] => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = parseCSVLine(line);
      return {
        id: values[0],
        title: values[1],
        content: values[2],
        user_id: '',
        created_at: values[3],
        updated_at: values[4],
      };
    });
};

const parseCSVLine = (line: string): string[] => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
