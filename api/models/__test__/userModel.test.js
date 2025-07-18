// to test
// cd api; npm test;

import { insertUser, isUserExist, fetchByRole, hash } from "../userModel.js";
import pool from '../../db/pool.js';

jest.mock('../../db/pool.js', () => ({
    __esModule: true,
    default: {
        query: jest.fn()
    }

}));

beforeEach(() => {
    jest.clearAllMocks();
});


describe('insertUser', () => {
    it('should insert a user with default role "client"', async () => {
        const user = {
            email: 'test',
            passhash: 'pass',
        };

        pool.query.mockResolvedValue({});
        const result = await insertUser(user);

        expect(pool.query).toHaveBeenCalledWith(
            `INSERT INTO users ("email", "passhash", "role", "first_name", "last_name")
		 VALUES ($1, $2, $3, $4, $5)`,
            ['test', hash('pass'), 'client', undefined, undefined]
        );
        expect(result).toBe(true);
    });
    // idk why this one isnt working >>> a fucking whitespace really caliss
    it('should insert a user with a specified role', async () => {
        const user = {
            email: 'hd',
            passhash: 'hair',
            role: 'hairdresser',
        };

        pool.query.mockResolvedValue({});
        const result = await insertUser(user);

        expect(pool.query).toHaveBeenCalledWith(
            `INSERT INTO users ("email", "passhash", "role", "first_name", "last_name")
		 VALUES ($1, $2, $3, $4, $5)`,
            ['hd', hash('hair'), 'hairdresser', undefined, undefined]
        );
        expect(result).toBe(true);
    });
});


describe('isUserExist', () => {
    it('should return user info when email and passhash match', async () => {
        const email = 'ce';
        const passhash = '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111';

        const mockUser = {
            id: 1,
            email
        };

        pool.query.mockResolvedValue({ rows: [mockUser] });

        const result = await isUserExist(email, passhash);

        expect(pool.query).toHaveBeenCalledWith(
            `SELECT "id", "email", "role"
		FROM "users"
		WHERE "email" = $1 AND "passhash"= $2;`,
            [email, hash(passhash)]
        );

        expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
        const email = 'notfound@example.com';
        const passhash = 'wrongpass';

        pool.query.mockResolvedValue({ rows: [] });

        const result = await isUserExist(email, passhash);

        expect(result).toBeNull();
    });
});

describe('fetchByRole', () => {
    it('should return users with the specified role', async () => {
        const mockUsers = [
            {
                "id": "4c4a77ac-2ac0-4e9f-989d-ece9554f6800",
                "email": "ce"
            },
            {
                "id": "6dcdf763-92d3-4f9b-9f75-90fb76130b02",
                "email": "c2e"
            },
        ];

        pool.query.mockResolvedValue({ rows: mockUsers });

        const result = await fetchByRole('client');

        expect(pool.query).toHaveBeenCalledWith(
            `SELECT "id", "email" FROM "users" WHERE "role" = $1`,
            ['client']
        );

        expect(result).toEqual(mockUsers);
    });
});
