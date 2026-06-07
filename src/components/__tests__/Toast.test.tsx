// Test: Toast Component
import { render, screen } from '@testing-library/react';
import { ToastContainer } from '../Toast';
import { ToastProvider } from '../../contexts/ToastContext';

describe('Toast Component', () => {
  it('should render toast container', () => {
    render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    );

    const container = screen.getByRole('region');
    expect(container).toBeInTheDocument();
  });
});
