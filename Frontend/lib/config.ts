function normalizeUrl(url: string) {
  return url.replace(/\/+$/, "");
}

const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

if (process.env.NODE_ENV === "production" && !configuredUrl) {
  console.warn(
    "[config] NEXT_PUBLIC_API_URL no esta definida. En Vercel, agregala en Settings > Environment Variables del proyecto Frontend."
  );
}

/** URL base del backend. Local por defecto; en Vercel se define NEXT_PUBLIC_API_URL. */
export const API_URL = normalizeUrl(configuredUrl || "http://localhost:3000");
