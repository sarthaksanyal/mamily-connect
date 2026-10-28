# mamily-connect

Communication model for the managers, hr and employees

Tech Stack- Frontend- HTML, CSS and JavaScript

Features- Attendance, Leaves, Performance Review, Task Allocation, Work Log, and other Self Service Features

Basically, a complete company's daily internal functioning can be done

## Django API integration

The frontend exposes a shared `window.MamilyApi` client for JSON requests. Its
default API base URL is `/api/`; change `apiBaseUrl` in
`script.js/api-config.js` to match the Django API URL. For example, a Django
development server on another local port can use `http://localhost:8000/api/`.

```js
const employees = await MamilyApi.get("employees/");
await MamilyApi.post("leave-requests/", { start_date: "2026-11-02" });
```

The client sends cookies, adds Django's `csrftoken` cookie as `X-CSRFToken` on
state-changing requests, serializes object bodies as JSON, and throws
`MamilyApi.ApiError` for non-success responses. Django should provide a CSRF
cookie before the first state-changing request. For a frontend hosted on a
different origin, configure Django CORS to allow that exact origin and
credentials, and configure trusted CSRF origins.

Login and dashboard data still use the current demo/browser-storage behavior;
they are not connected to Django yet. API endpoint paths, payloads, response
shapes, and the authentication flow should be agreed with the backend before
those workflows are switched over.
