
// get the db to test (placeholder, dummy db)
import { getDataFromDatabase } from '../db/database';

// passes the dumb db to the test
jest.mock('../db/database', () => ({
  getDataFromDatabase: jest.fn(),
}));

// group of tests for db tests
describe('database retrieval tests', () => {
  // reset the mock after each test 
  afterEach(() => { 
    jest.clearAllMocks();
  });

  // for test: should return data when the mock db responds with an array
  // realdb: would connect to the actual database and return real data
  it('should return data when database retrieval is successful', async () => {
    const mockData = [{ id: 1, name: 'Test Item' }]; // mock data
    getDataFromDatabase.mockResolvedValue(mockData); // mock the db

    const result = await getDataFromDatabase(); // call the db

    expect(result).toEqual(mockData); // expect the result to be the mock data
  });

  // for test: should throw an error when the mock db simulates a failure
  // real db: the function would throw if the DB connection fails or times out
  it('should handle errors when database retrieval fails', async () => {
    getDataFromDatabase.mockRejectedValue(new Error('database error')); // mock the db to throw an error

    await expect(getDataFromDatabase()).rejects.toThrow('database error'); // expect the error to be the mock error
  });

  // for test: should return an empty array if the mock db has no records
  // real db: this might happen if the query matches no results
  it('should return an empty array if no data is found', async () => {
    getDataFromDatabase.mockResolvedValue([]); // mock the db to return an empty array

    const result = await getDataFromDatabase(); // call the db

    expect(result).toEqual([]); // expect the result to be an empty array
  });

  // for test: should ensure the database is called with the correct query object
  // real db: this confirms correct query structure is passed to the DB
  it('should call the database with the correct query', async () => {
    const query = { name: 'Test' }; // mock query
    getDataFromDatabase.mockResolvedValue([]); // mock the db

    await getDataFromDatabase(query); // call the db

    expect(getDataFromDatabase).toHaveBeenCalledWith(query); // expect the db to be called with the query
    expect(getDataFromDatabase).toHaveBeenCalledTimes(1); // Ensure it's called exactly once
    const calledArg = getDataFromDatabase.mock.calls[0][0]; // Capture the argument
    expect(calledArg).toHaveProperty('name', 'Test'); // Validate structure of query
  });

  // for test: should still call the database even with an incomplete query
  // real db: might return broader results or cause validation error
  it('should handle missing query parameters gracefully', async () => {
    const incompleteQuery = {}; // missing 'name'
    getDataFromDatabase.mockResolvedValue([]);

    await getDataFromDatabase(incompleteQuery);

    expect(getDataFromDatabase).toHaveBeenCalledWith(incompleteQuery);
    const calledArg = getDataFromDatabase.mock.calls[0][0];
    expect(calledArg).not.toHaveProperty('name'); // 'name' shouldn't exist
  });
});

// NOTE: When switching from mock to real DB, remove `jest.mock(...)`
// and make sure the real DB is properly configured and seeded for tests