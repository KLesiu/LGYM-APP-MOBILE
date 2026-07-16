# Mobile Release Pipeline

This repo contains a production release pipeline for the mobile app. It is intentionally configured to keep real credentials and App Store / Google Play operator data outside git.

## What the pipeline does

- Runs only after a merged `dev -> main` pull request.
- Validates the app with `npm run lint`, `npm run typecheck`, and `npm test`.
- Bumps the patch version in `package.json` and creates an immutable `mobile-v{version}` tag.
- Builds Android and iOS production artifacts from that tag through EAS.
- Submits Android to the Google Play production track through EAS Submit.
- Submits the iOS binary through EAS Submit, then uses Fastlane to submit the exact iOS build for App Review.
- Uses GitHub Environment `production` for build, submit, and review jobs so protected secrets are only available behind that gate.

## Required external setup

Before enabling production releases, configure these outside the repository:

- GitHub Environment `production` with required reviewers if approval is needed.
- `EXPO_TOKEN` in the `production` environment.
- EAS project access and one-time remote build-number setup with `eas build:version:set` for Android and iOS.
- App Store Connect app record for bundle id `com.lesiuuu.lgymappmobile`.
- Google Play app record for package `com.lesiuuu.lgymappmobile`.
- `ASC_APP_ID`, `ASC_KEY_ID`, `ASC_ISSUER_ID`, and `ASC_KEY_P8_BASE64` in the `production` environment.
- Google Play submit credentials configured in EAS / Expo, not committed to git.
- Branch protection or ruleset allowance for `github-actions[bot]` to push the release commit and `mobile-v*` tag.

## Public-safe repository contract

The repository may contain:

- workflow logic,
- Fastlane lane code,
- public bundle/package identifiers,
- secret names,
- setup instructions.

The repository must not contain:

- raw `.p8` files,
- private key blocks,
- Google service-account JSON,
- real Expo, Apple, or Google credentials,
- App Store review-contact or demo-account text files.

`fastlane/metadata/**/*.txt` is ignored on purpose. Store metadata and review information are operator-managed and should be supplied outside public git.

## Runtime-only iOS App Store id

`eas.json` intentionally does not contain the real `submit.production.ios.ascAppId`. The workflow injects `ASC_APP_ID` from GitHub Environment `production` into the runner workspace only for the iOS submit job.

## Rerun behavior

The release commit records the source merge SHA. If the same merged PR is re-run and the matching `mobile-v{version}` tag already exists, the pipeline reuses that immutable tag instead of bumping the version again.

## Common blockers

- Missing `EXPO_TOKEN`.
- Missing or non-numeric `ASC_APP_ID`.
- Missing App Store Connect API key values.
- Bot push blocked by branch protection.
- EAS remote build numbers not initialized.
- Store records or credentials not ready outside git.
