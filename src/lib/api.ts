const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown>;
};

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const parseResponseBody = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const { body, headers, ...restOptions } = options;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const isFormData = body instanceof FormData;
  const isRawBody =
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof URLSearchParams;

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...restOptions,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body !== undefined && !isFormData && !isRawBody
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    },
    body:
      body === undefined
        ? undefined
        : isFormData || isRawBody
          ? body
          : JSON.stringify(body),
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
};
