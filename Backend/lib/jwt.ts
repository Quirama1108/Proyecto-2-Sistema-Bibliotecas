import { createHmac, timingSafeEqual } from "crypto";

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  exp: number;
};

function getSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 24) {
    throw new Error("JWT_SECRET must be configured with at least 24 characters.");
  }

  return secret;
}

function base64Url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function parseExpiresIn(value = process.env.JWT_EXPIRES_IN || "7d") {
  const match = /^(\d+)([hdm])$/.exec(value);

  if (!match) {
    return 7 * 24 * 60 * 60;
  }

  const amount = Number(match[1]);
  const unit = match[2];

  if (unit === "m") return amount * 60;
  if (unit === "h") return amount * 60 * 60;
  return amount * 24 * 60 * 60;
}

function signData(data: string) {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

export function signJwt(payload: Omit<JwtPayload, "exp">) {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64Url(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + parseExpiresIn()
    })
  );
  const unsignedToken = `${header}.${body}`;
  const signature = signData(unsignedToken);

  return `${unsignedToken}.${signature}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  const [header, body, signature] = token.split(".");

  if (!header || !body || !signature) {
    return null;
  }

  const expectedSignature = signData(`${header}.${body}`);
  const actual = Buffer.from(signature, "base64url");
  const expected = Buffer.from(expectedSignature, "base64url");

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as JwtPayload;

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}
