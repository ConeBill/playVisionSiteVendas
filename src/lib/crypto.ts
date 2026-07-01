const ALGO = 'aes-256-gcm';
const SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

function getKey() {
  const key = Buffer.from(SECRET);
  if (key.length !== 32) {
    const padded = Buffer.alloc(32, 0);
    key.copy(padded);
    return padded;
  }
  return key;
}

export function encrypt(text: string) {
  const iv = Buffer.alloc(16, Math.floor(Math.random() * 0xff));
  const cipher = require('crypto').createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export function decrypt(text: string) {
  const data = Buffer.from(text, 'base64');
  const iv = data.subarray(0, 16);
  const authTag = data.subarray(16, 32);
  const encrypted = data.subarray(32);
  const decipher = require('crypto').createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(authTag);
  return decipher.update(encrypted).toString('utf8');
}
