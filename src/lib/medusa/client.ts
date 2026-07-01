// Medusa v2 Store API client

const MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000";
const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "";

interface FetchOptions {
  path: string;
  params?: Record<string, string | number>;
}

export async function medusaFetch<T>({ path, params }: FetchOptions): Promise<T> {
  const url = new URL(`/store${path}`, MEDUSA_BACKEND_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (MEDUSA_PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = MEDUSA_PUBLISHABLE_KEY;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    throw new Error(`Medusa API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY };
