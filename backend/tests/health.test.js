"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../src/server")); // Assuming app is exported from server.js
describe('GET /api/v1/health', () => {
    it('should return health status', async () => {
        const res = await (0, supertest_1.default)(server_1.default).get('/api/v1/health');
        // It might return 200 or 503 depending on database connection
        expect([200, 503]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('environment');
        expect(res.body).toHaveProperty('database');
    });
});
//# sourceMappingURL=health.test.js.map