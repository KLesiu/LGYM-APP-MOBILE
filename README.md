# LGYM Mobile

## Installation

```bash
npm install
```

Create a `.env` file with the backend URL:

```env
REACT_APP_BACKEND=https://localhost:7025
REACT_APP_ANDROID_EMULATOR_HOST=10.0.2.2
```

## Running locally

```bash
npm run start
```

Useful targets:

- `npm run android`
- `npm run ios`
- `npm run web`

## Building (EAS)

```bash
npm run build:android
npm run build:androidDev
npm run build:ios
```

## Testing

```bash
npm test -- --runInBand
npx tsc --noEmit
```

## Architecture overview

- `app/` contains expo-router screens, layouts, and feature UI.
- `lib/` contains shared app logic, constants, storage, hooks, validators, and formatting helpers.
- `api/generated/` contains generated backend clients and models.
- `utils/` is reserved for legacy compatibility-free shared helpers during migration.

## Environment variables

- `REACT_APP_BACKEND`: backend base URL.
- `REACT_APP_ANDROID_EMULATOR_HOST`: loopback override for Android emulator.

## Local API setup

The app resolves the backend base URL from `REACT_APP_BACKEND` and normalizes loopback handling in `lib/resolveBackendBaseUrl.ts`.

## Axios behavior

- Base URL is normalized and resolved in `api/custom-instance.ts`.
- `Accept-Language` follows the current i18n language.
- `Authorization: Bearer <token>` is attached when token exists.
- `X-Skip-Auth` can be set per request to skip auth header injection.
