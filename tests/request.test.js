jest.mock('../db');
const db = require('../db');
const { createRequest } = require('../controllers/requestController');

describe('Request Controller', () => {
  test('should create a new request', async () => {
    // Mock: nenhuma solicitação recente
    db.execute
      .mockResolvedValueOnce([[]])  // Verificação de última solicitação
      .mockResolvedValueOnce([{ insertId: 1 }]);  // Inserção da nova solicitação

    const req = { body: { person_id: 2 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Request created', request_id: 1 });
  });
});
