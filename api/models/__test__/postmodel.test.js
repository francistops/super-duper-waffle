import { fetchNextAppointments } from "../appointmentModel.js";
import { pool } from '../../db/pool.js';

Jest.mock('../../db/pool.js', () => ({
    pool: {
        query: jest.fn()
    }
}))

beforeEach(() => {
        jest.clearAllmoxks();
});

test('test when no id are provided fetchNextpost', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    await fetchNextPosts([], 1);

    const [sql, params] = pool.query.mock.calls[0];

    expect(sql).not.toMatch(/NOT IN/);

    expect(params).toEqual([1]);
})