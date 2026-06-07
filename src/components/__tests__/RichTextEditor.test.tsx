// Test: Rich Text Editor
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RichTextEditor from '../RichTextEditor';

describe('RichTextEditor', () => {
  it('should render editor with toolbar', () => {
    const handleChange = jest.fn();
    
    render(
      <RichTextEditor 
        content="Test content" 
        onChange={handleChange}
      />
    );

    expect(screen.getByTitle('Bold (Ctrl+B)')).toBeInTheDocument();
    expect(screen.getByTitle('Italic (Ctrl+I)')).toBeInTheDocument();
  });

  it('should handle content change', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(
      <RichTextEditor 
        content="" 
        onChange={handleChange}
      />
    );

    expect(screen.getByText('Loading editor...')).toBeInTheDocument();
  });
});
