import { insertUser } from "../userModel.js";
import { pool } from '../../db/pool.js';

Jest.mock('../../db/pool.js', () => ({
    pool: {
        query: jest.fn()
    }
}))

beforeEach(() => {
        jest.clearAllmocks();
});

test('inserting a user in the db', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    await insertUser([], 1);

    const [sql, params] = pool.query.mock.calls[0];

    expect(sql).not.toMatch(/NOT IN/);

    expect(params).toEqual([1]);
})