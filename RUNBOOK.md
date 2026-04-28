# Runbook

## Dev environment setup

- Install Node.js 22.18+.
- Run `npm install`.
- Set `REACT_APP_BACKEND` in `.env`.

## EAS build profiles

- `npm run build:android`
- `npm run build:androidDev`
- `npm run build:ios`

## OTA updates

- Ship JS-only changes through Expo Updates.
- Keep native changes for EAS builds.
- Verify the release channel matches the intended app track before publishing.

## Troubleshooting

- If Metro cannot reach the backend, verify `REACT_APP_ANDROID_EMULATOR_HOST` or use a LAN HTTPS URL.
- If auth or locale looks stale, clear app storage and rerun bootstrap.
- If TypeScript fails, run `npx tsc --noEmit` before testing.

## Run E2E baseline (Maestro)

- Start the app locally.
- Run the baseline Maestro flow used by the project’s release checks.
- Verify login, navigation, and a representative home flow.

## Update enums after backend release

- Regenerate API models when backend contracts change.
- Update `enums/` and any `lib/domain` consumers that branch on enum values.
- Re-run `npx tsc --noEmit` and `npm test -- --runInBand`.
