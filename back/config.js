import dotenv from 'dotenv';
dotenv.config();
function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`Key ${key}is undefined`);
  }
  return value;
}
export const config = {
  jwt: {
    secretKey: required('JWT_SECRET'),
    expiresInDays: parseInt(required('JWT_EXPIRES_SEC', 86400)),
  },

  bcrypt: { saltRount: parseInt(required('BCRYPT_STALT_ROUNDS', 12)) },
  host: { port: parseInt(required('PORT', 8080)) },

  db: {
    host: required('DB_HOST', 'localhost'),
    user: required('DB_USER', 'root'),
    database: required('DB_DATABASE'),
    password: required('DB_PASSWORD'),
    port: required('DB_PORT'),
  },
  cors: {
    allowedOrigin: required('CORS_ALLOW_ORIGIN'),
  },
  csrf: {
    plainToken: required('CSRF_SECRET_KEY'),
  },
  rateLimit: {
    windowMs: required('RATE_WINDOW_MS'),
    maxRequest: required('RATE_MAXREQ'),
  },
};
