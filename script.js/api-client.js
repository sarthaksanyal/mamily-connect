(() => {
  const config = window.MAMILY_CONFIG || {};
  const baseUrl = new URL(config.apiBaseUrl || "/api/", window.location.href);
  if (!baseUrl.pathname.endsWith("/")) {
    baseUrl.pathname += "/";
  }

  function getCookie(name) {
    const cookie = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`));
    if (!cookie) {
      return "";
    }
    try {
      return decodeURIComponent(cookie.slice(name.length + 1));
    } catch {
      return cookie.slice(name.length + 1);
    }
  }

  class ApiError extends Error {
    constructor(message, status, data) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.data = data;
    }
  }

  async function request(path, options = {}) {
    const url = new URL(String(path).replace(/^\/+/, ""), baseUrl);
    const method = (options.method || "GET").toUpperCase();
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");

    let body = options.body;
    if (
      body !== undefined &&
      body !== null &&
      typeof body === "object" &&
      !(body instanceof FormData)
    ) {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(body);
    }

    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
      const csrfToken = getCookie("csrftoken");
      if (csrfToken) {
        headers.set("X-CSRFToken", csrfToken);
      }
    }

    const response = await fetch(url, {
      ...options,
      method,
      headers,
      body,
      credentials: "include",
    });
    const contentType = response.headers.get("content-type") || "";
    const data =
      response.status === 204
        ? null
        : contentType.includes("application/json")
          ? await response.json()
          : await response.text();

    if (!response.ok) {
      const message =
        data && typeof data === "object"
          ? data.detail ||
            data.message ||
            `Request failed (${response.status}).`
          : data || `Request failed (${response.status}).`;
      throw new ApiError(String(message), response.status, data);
    }

    return data;
  }

  window.MamilyApi = {
    request,
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, body, options) =>
      request(path, { ...options, method: "POST", body }),
    put: (path, body, options) =>
      request(path, { ...options, method: "PUT", body }),
    patch: (path, body, options) =>
      request(path, { ...options, method: "PATCH", body }),
    delete: (path, options) => request(path, { ...options, method: "DELETE" }),
    ApiError,
  };
})();
