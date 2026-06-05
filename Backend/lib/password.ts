import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const algorithm = "pbkdf2_sha256";
const iterations = 120000;
const keyLength = 32;
const digest = "sha256";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("base64url");
  return `${algorithm}$${iterations}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [storedAlgorithm, storedIterations, salt, originalHash] = storedHash.split("$");

  if (storedAlgorithm !== algorithm || !storedIterations || !salt || !originalHash) {
    return false;
  }

  const hash = pbkdf2Sync(password, salt, Number(storedIterations), keyLength, digest);
  const original = Buffer.from(originalHash, "base64url");

  return original.length === hash.length && timingSafeEqual(original, hash);
}
