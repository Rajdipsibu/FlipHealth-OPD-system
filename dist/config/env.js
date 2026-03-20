import dotenv from 'dotenv';
const PORT = process.env.PORT || 3300;
const DB_NAME = process.env.DB_NAME || 'fliphealth';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_HOST = process.env.DB_HOST || 'localhost';
const JWT_SECRET = process.env.JWT_SECRET || 'jyS0c9E9XkbSP0DxiC3EKzxagOPZ9WsoG6NXUGtSrUw=';
export default {
    PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    JWT_SECRET
};
//# sourceMappingURL=env.js.map