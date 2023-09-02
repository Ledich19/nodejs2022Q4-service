import * as dotenv from 'dotenv';
dotenv.config();

export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  logs: {
    level: parseInt(process.env.LOG_LEVEl, 10) || 3,
    size: parseInt(process.env.MAX_LOG_SIZE_KB, 10) || 100,
  },
  auth: {
    salt: parseInt(process.env.CRYPT_SALT, 10) || 10,
    jwrAccess: process.env.JWT_SECRET_KEY,
    jwrAccessTime: process.env.TOKEN_EXPIRE_TIME,
    jwrRefresh: process.env.JWT_SECRET_REFRESH_KEY,
    jwrRefreshTime: process.env.TOKEN_REFRESH_EXPIRE_TIME,
  },
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DB,
    url: process.env.DATABASE_URL,
  },
});
