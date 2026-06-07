// User Service Tests
import { expect } from 'chai';
import sinon from 'sinon';
import UserService from '../../src/services/UserService.js';
import pool from '../../src/config/database.js';

describe('UserService', () => {
  let queryStub: sinon.SinonStub;

  beforeEach(() => {
    queryStub = sinon.stub(pool, 'query');
  });

  afterEach(() => {
    queryStub.restore();
  });

  describe('getUserById', () => {
    it('should fetch a user by ID', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      queryStub.resolves({ rows: [mockUser] });

      const result = await UserService.getUserById('user-id');

      expect(result).to.deep.equal(mockUser);
      expect(queryStub.calledOnce).to.be.true;
    });

    it('should throw error if user not found', async () => {
      queryStub.resolves({ rows: [] });

      try {
        await UserService.getUserById('nonexistent');
        expect.fail('Should throw error');
      } catch (err: any) {
        expect(err.message).to.equal('User not found');
      }
    });
  });

  describe('getOrCreateUser', () => {
    it('should return existing user', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      queryStub.onFirstCall().resolves({ rows: [mockUser] });

      const result = await UserService.getOrCreateUser('user-id', 'test@example.com');

      expect(result).to.deep.equal(mockUser);
    });

    it('should create new user if not found', async () => {
      const mockUser = {
        id: 'new-user-id',
        email: 'new@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      queryStub.onFirstCall().resolves({ rows: [] });
      queryStub.onSecondCall().resolves({ rows: [mockUser] });

      const result = await UserService.getOrCreateUser('new-user-id', 'new@example.com');

      expect(result.email).to.equal('new@example.com');
    });
  });

  describe('updateUser', () => {
    it('should update user email', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'updated@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      queryStub.resolves({ rows: [mockUser] });

      const result = await UserService.updateUser('user-id', 'updated@example.com');

      expect(result.email).to.equal('updated@example.com');
    });
  });
});
