jest.mock('../db');
const db = require('../db');
const { createCoffee, getCoffeesToday, getLastCoffee, getCoffeesByTrainee } = require('../controllers/coffeeController');

describe('Coffee Controller', () => {
  test('should create a coffee record', async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 1 }]);

    const req = { body: { trainee_id: 3, request_id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createCoffee(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Coffee recorded', coffee_id: 1 });
  });

  test('should get today\'s coffees', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, date_created: new Date() }]]);

    const req = {};
    const res = { json: jest.fn() };

    await getCoffeesToday(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  test('should get last coffee record', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, date_created: new Date() }]]);

    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await getLastCoffee(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });

  test('should get coffees by trainee', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, trainee_id: 3 }]]);

    const req = { params: { id: 3 } };
    const res = { json: jest.fn() };

    await getCoffeesByTrainee(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });
});
