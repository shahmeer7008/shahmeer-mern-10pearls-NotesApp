// User Model
export interface User {
  id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateInput(email: string): string[] {
    const errors: string[] = [];

    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
    }

    if (email && !this.validateEmail(email)) {
      errors.push('Invalid email format');
    }

    return errors;
  }
}

export default UserModel;
