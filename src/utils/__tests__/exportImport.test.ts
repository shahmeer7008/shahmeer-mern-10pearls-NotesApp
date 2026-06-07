// Test: Export/Import Utilities
import { exportNotesAsJSON, exportNotesAsCSV } from '../../utils/exportImport';
import type { Note } from '../../types';

describe('Export/Import Utilities', () => {
  const mockNotes: Note[] = [
    {
      id: '1',
      user_id: 'user-1',
      title: 'Test Note',
      content: 'Test content',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:mock');
    global.URL.revokeObjectURL = jest.fn();

    // Mock document.createElement for download
    const createElementSpy = jest.spyOn(document, 'createElement');
    createElementSpy.mockReturnValue({
      click: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should export notes as JSON', () => {
    expect(() => {
      exportNotesAsJSON(mockNotes);
    }).not.toThrow();
  });

  it('should export notes as CSV', () => {
    expect(() => {
      exportNotesAsCSV(mockNotes);
    }).not.toThrow();
  });
});
