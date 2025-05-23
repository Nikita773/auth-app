import { MockUser } from '../models/user.model';

export const MOCK_API_DELAY_MS = 1000;
export const SHOW_ERROR_TOAST_MS = 10000;

export const MOCK_USERS: MockUser[] = [
  {
    email: 'alice@example.com',
    password: 'Password_123',
    fullName: 'Alice Anderson',
    token: 'token-alice-123',
  },
  {
    email: 'bob@example.com',
    password: 'SecurePass+456',
    fullName: 'Bob Brown',
    token: 'token-bob-456',
  },
  {
    email: 'carol@example.com',
    password: 'Carol-789!',
    fullName: 'Carol Clark',
    token: 'token-carol-789',
  },
];
