// Test: Auth Context
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

describe('AuthContext', () => {
  it('should provide auth context', async () => {
    const TestComponent = () => {
      const { user, loading } = useAuth();
      
      if (loading) return <div>Loading...</div>;
      return <div>{user ? `User: ${user.email}` : 'Not authenticated'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});
