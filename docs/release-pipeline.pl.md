# Pipeline wydania mobile

Repo zawiera pipeline produkcyjnego wydania aplikacji mobile. Konfiguracja celowo trzyma prawdziwe credentials oraz dane operatorskie App Store / Google Play poza gitem.

## Co robi pipeline

- Uruchamia się tylko po zmergowanym PR `dev -> main`.
- Waliduje aplikację przez `npm run lint`, `npm run typecheck` i `npm test`.
- Podbija patch version w `package.json` i tworzy niezmienny tag `mobile-v{version}`.
- Buduje produkcyjne artefakty Android/iOS z tego taga przez EAS.
- Wysyła Androida na produkcyjny track Google Play przez EAS Submit.
- Wysyła binarkę iOS przez EAS Submit, a potem Fastlane wysyła dokładny build do App Review.
- Używa GitHub Environment `production` dla build/submit/review, żeby sekrety były dostępne tylko za tym gate'em.

## Wymagana konfiguracja poza repo

Przed uruchomieniem produkcyjnych release trzeba skonfigurować poza repo:

- GitHub Environment `production`, opcjonalnie z wymaganymi reviewerami.
- `EXPO_TOKEN` w environment `production`.
- Dostęp do projektu EAS oraz jednorazowe ustawienie remote build numbers przez `eas build:version:set` dla Androida i iOS.
- Rekord App Store Connect dla bundle id `com.lesiuuu.lgymappmobile`.
- Rekord Google Play dla package `com.lesiuuu.lgymappmobile`.
- `ASC_APP_ID`, `ASC_KEY_ID`, `ASC_ISSUER_ID` i `ASC_KEY_P8_BASE64` w environment `production`.
- Credentials Google Play skonfigurowane w EAS / Expo, nie w gicie.
- Branch protection albo ruleset exception pozwalający `github-actions[bot]` wypchnąć release commit i tag `mobile-v*`.

## Co może być publiczne

W repo mogą być:

- logika workflow,
- kod lane'a Fastlane,
- publiczne identyfikatory bundle/package,
- nazwy sekretów,
- instrukcje konfiguracji.

W repo nie mogą być:

- surowe pliki `.p8`,
- bloki prywatnych kluczy,
- Google service-account JSON,
- prawdziwe credentials Expo, Apple lub Google,
- pliki tekstowe z review contact, demo account albo store metadata.

`fastlane/metadata/**/*.txt` jest ignorowane celowo. Store metadata i review information są zarządzane operatorsko poza publicznym gitem.

## Runtime-only App Store id

`eas.json` celowo nie zawiera prawdziwego `submit.production.ios.ascAppId`. Workflow wstrzykuje `ASC_APP_ID` z GitHub Environment `production` tylko do workspace runnera w jobie iOS submit.

## Rerun

Release commit zapisuje source merge SHA. Jeśli ten sam merge PR zostanie uruchomiony ponownie i pasujący tag `mobile-v{version}` już istnieje, pipeline reuse'uje ten tag zamiast robić drugi bump wersji.

## Najczęstsze blokery

- Brak `EXPO_TOKEN`.
- Brak `ASC_APP_ID` albo wartość nie jest numeryczna.
- Brak wartości API key App Store Connect.
- Branch protection blokuje push bota.
- EAS remote build numbers nie zostały zainicjalizowane.
- Rekordy lub credentials store nie są gotowe poza gitem.
