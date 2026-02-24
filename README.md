# LGYM Mobile

## Local API setup (APIv3)

The app reads backend base URL from `REACT_APP_BACKEND` in `.env`.

Example:

```env
REACT_APP_BACKEND=https://localhost:7025
# Optional, mainly for Android emulator when localhost should map to emulator loopback:
# REACT_APP_ANDROID_EMULATOR_HOST=10.0.2.2
```

### Which URL should I use?

- iOS simulator: `localhost` usually works.
- Android emulator: if `localhost` is used, set `REACT_APP_ANDROID_EMULATOR_HOST` (usually `10.0.2.2`) so the app rewrites loopback to emulator-reachable host.
- Physical device: runtime tries to replace localhost with Metro host IP when available; if your network blocks this, set `REACT_APP_BACKEND` to your machine LAN IP directly (for example `http://192.168.x.x:4000`).

### Axios behavior

- Base URL is normalized and resolved in `api/custom-instance.ts`.
- `Accept-Language` header is always attached from current i18n language.
- `Authorization: Bearer <token>` is attached when token exists.
- `X-Skip-Auth` can be set per request to skip auth header injection.
