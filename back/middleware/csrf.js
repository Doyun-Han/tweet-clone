import { config } from '../config.js';
import bcrypt from 'bcrypt';

export const csrfCheck = (req, res, next) => {
  if (req.method == 'GET' || req.method == 'OPTIONS' || req.method == 'HEAD') {
    return next();
  }

  const csrfHeader = req.get('dwitter-csrf-token');

  if (!csrfHeader) {
    console.warn('Missing required "csrf_token" header', req.headers.origin);
    return res.status(403).json({ message: 'failed CSRF check' });
  }

  validateCsrfToken(csrfHeader)
    .then((valid) => {
      if (!valid) {
        console.warn(
          'Value provided in "csrf_token" header does not validate',
          req.headers.origin,
          csrfHeader
        );
        return res.status(403).json({ message: 'failed CSRF check' });
      }
      next();
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: 'something went wrong' });
    });
};

async function validateCsrfToken(csrfHeader) {
  return bcrypt.compare(config.csrf.plainToken, csrfHeader);
}
