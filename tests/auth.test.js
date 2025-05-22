jest.mock('../db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const db = require('../db');
const { login } = require('../controllers/authController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Auth Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return token when login is successful', async () => {
    db.execute.mockResolvedValueOnce([[
      { id: 1, mail: 'gabriel@email.com.br', pass: '$2b$10$hash', isAdmin: true, isTrainee: false }
    ]]);

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mocked_token');

    const req = { body: { mail: 'gabriel@email.com.br', pass: 'senha1234' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: expect.any(String)
    }));
  });
});
