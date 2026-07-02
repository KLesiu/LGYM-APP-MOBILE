# LGYM Mobile / LGYM Mobile App

> **PL:** Mobilna aplikacja fitness i coachingu dla użytkowników indywidualnych oraz relacji trener–podopieczny.  
> **EN:** A mobile fitness and coaching app for individual users and trainer–trainee collaboration.

---

## PL — Opis produktu

### Czym jest LGYM Mobile?

LGYM Mobile to aplikacja mobilna wspierająca codzienny trening, planowanie, monitorowanie postępów oraz komunikację w modelu trener–podopieczny. Produkt łączy kilka obszarów w jednym doświadczeniu użytkownika:

- zarządzanie planami treningowymi,
- prowadzenie aktywnego treningu krok po kroku,
- historię i rekordy,
- pomiary i śledzenie progresu ciała,
- pracę z ćwiczeniami i siłowniami,
- dostęp do planów dietetycznych,
- onboarding nowego użytkownika,
- powiadomienia in-app oraz aktualizacje live,
- współpracę z trenerem, raporty, feedback, zdjęcia i notatki.

### Cel biznesowy

Głównym celem aplikacji jest uproszczenie ścieżki użytkownika od pierwszego uruchomienia do regularnego korzystania z planu treningowego oraz zapewnienie przestrzeni do współpracy z trenerem bez przełączania się między wieloma narzędziami.

W praktyce aplikacja ma wspierać:

- **retencję użytkownika** przez wygodny dziennik treningowy, historię wyników i pomiary,
- **jakość współpracy trener–podopieczny** przez raporty, komentarze, notatki i powiadomienia live,
- **operacyjność trenerów** przez wysyłanie próśb o raport, zarządzanie planami i przegląd odpowiedzi,
- **skalowalność produktu** przez generowane kontrakty API, modularny frontend i spójny model danych.

### Założenia produktowe

- aplikacja jest rozwijana jako klient mobilny dla backendu LGYM API,
- interfejs jest dwujęzyczny (PL / EN),
- backend odpowiada za autoryzację, dane domenowe i kontrakty API,
- aplikacja zakłada użycie JWT i żądań autoryzowanych do większości zasobów,
- powiadomienia live są realizowane przez SignalR,
- część funkcjonalności jest zależna od roli użytkownika i/lub relacji trener–podopieczny.

### Role użytkowników

#### 1. Użytkownik / podopieczny
Może m.in.:

- logować się i rejestrować,
- tworzyć i wykonywać własne plany,
- śledzić historię, rekordy i pomiary,
- odbierać zaproszenia trenerskie,
- otrzymywać prośby o raport,
- wypełniać raporty,
- przeglądać komentarze trenera do raportów,
- korzystać z planów dietetycznych,
- otrzymywać powiadomienia live o zdarzeniach związanych z trenerem.

#### 2. Trener
Model danych i API wspierają także scenariusze trenerskie, a klient mobilny ma już wbudowaną część trainer-related UX, m.in. obsługę relacji, requestów, raportów, feedbacku, notatek i nawigacji zależnej od notyfikacji.

---

## PL — Główne funkcjonalności

### 1. Uwierzytelnianie i konto

Obsługiwane są podstawowe przepływy konta użytkownika:

- logowanie,
- rejestracja,
- reset hasła,
- forgot password,
- publiczny status zaproszenia.

Główne pliki:

- `app/Login.tsx`
- `app/Register.tsx`
- `app/forgot-password.tsx`
- `app/reset-password.tsx`
- `app/public-invitation-status.tsx`
- `app/AppContext.tsx`

### 2. Shell aplikacji i nawigacja

Aplikacja działa wewnątrz głównego kontenera Home, który przełącza moduły przez wewnętrzny screen router.

Aktualny model nawigacji obejmuje m.in. `START`, `TRAINING`, `PLAN`, `EXERCISES`, `GYM`, `HISTORY`, `RECORDS`, `PROFILE`, `TRAINER`, `NOTIFICATIONS` oraz `MEASUREMENTS`, a ich stan jest koordynowany przez `HomeContext`.

Główne pliki:

- `app/_layout.tsx`
- `app/Start.tsx`
- `app/components/home/homeScreens.ts`
- `app/components/home/HomeContext.tsx`
- `app/components/layout/Header.tsx`
- `app/components/layout/Menu.tsx`

### 3. Onboarding i tutorial

Produkt zawiera system tutoriala oraz blokowania części nawigacji do czasu ukończenia onboardingowego flow.

Główne pliki:

- `app/onboarding/OnboardingContext.tsx`
- `app/onboarding/tutorialStepsConfig.ts`
- `app/onboarding/tutorialBackend.ts`
- `app/components/onboarding/ContextualHelpModal.tsx`

### 4. Start / dashboard

Ekran startowy pokazuje użytkownikowi najważniejsze informacje:

- ranking,
- progres,
- ostatni trening,
- szybki stan aktywności.

Główne pliki:

- `app/components/home/start/Start.tsx`
- `app/components/home/start/UsersRanking.tsx`
- `app/components/home/start/ProgressInfo.tsx`
- `app/components/home/start/LastTrainingStartInfo.tsx`

### 5. Trening aktywny

To jeden z kluczowych obszarów produktu. Obsługuje:

- wybór dnia treningowego,
- wybór siłowni,
- uruchomienie sesji,
- wpisywanie wyników serii,
- podsumowanie treningu,
- obsługę bieżących danych treningowych w kontekście planu.

Główne pliki:

- `app/components/home/training/Training.tsx`
- `app/components/home/training/TrainingView.tsx`
- `app/components/home/training/TrainingSummary.tsx`
- `app/components/home/training/trainingChoices/TrainingDayChoose.tsx`
- `app/components/home/training/trainingChoices/TrainingGymChoose.tsx`
- `app/components/home/training/trainingPlanDay/TrainingPlanDay.tsx`
- `app/components/home/training/trainingPlanDay/TrainingPlanDayContext.tsx`

### 6. Plany treningowe

Aplikacja wspiera zarządzanie planami oraz dniami planu, w tym:

- listę planów,
- tworzenie planu,
- konfigurowanie dni planu,
- dodawanie ćwiczeń,
- porządkowanie serii i powtórzeń,
- kopiowanie/udostępnianie planów.

Główne pliki:

- `app/components/home/plan/TrainingPlan.tsx`
- `app/components/home/plan/PlansList.tsx`
- `app/components/home/plan/PlansListItem.tsx`
- `app/components/home/plan/PlanCopyDialog.tsx`
- `app/components/home/plan/PlanShareDialog.tsx`
- `app/components/home/plan/planDay/CreatePlanDay.tsx`

### 7. Ćwiczenia

Moduł ćwiczeń obejmuje:

- listę ćwiczeń,
- szczegóły ćwiczenia,
- dodawanie nowych ćwiczeń,
- tłumaczenia nazw ćwiczeń,
- powiązanie ćwiczeń z treningami i seriami.

Główne pliki:

- `app/components/home/exercises/Exercises.tsx`
- `app/components/home/exercises/ExercisesList.tsx`
- `app/components/home/exercises/ExerciseDetails.tsx`
- `app/components/home/exercises/CreateExercise.tsx`
- `app/components/home/exercises/ExerciseTranslationDialog.tsx`

### 8. Siłownie

Użytkownik może zarządzać siłowniami i wybierać kontekst miejsca treningu.

Główne pliki:

- `app/components/home/gym/Gym.tsx`
- `app/components/home/gym/GymForm.tsx`
- `app/components/home/gym/GymPlace.tsx`

### 9. Historia i rekordy

Produkt wspiera analizę wcześniejszych aktywności:

- historię treningów,
- sesje w rozbiciu na czas/datę,
- rekordy i popupy rekordów.

Główne pliki:

- `app/components/home/history/History.tsx`
- `app/components/home/history/TrainingSession.tsx`
- `app/components/home/records/Records.tsx`
- `app/components/home/records/RecordsPopUp.tsx`

### 10. Profil

Moduł profilu obejmuje m.in. podstawowe informacje użytkownika i ustawienia związane z kontem.

Główne pliki:

- `app/components/home/profile/Profile.tsx`
- `app/components/home/profile/MainProfileInfo.tsx`

### 11. Pomiary i śledzenie progresu ciała

Nowy moduł `Measurements` rozszerza aplikację o monitorowanie zmian ciała i trendów postępu. Z perspektywy produktu to ważne uzupełnienie klasycznego dziennika treningowego, bo pozwala śledzić efekty współpracy nie tylko przez treningi i rekordy, ale też przez dane antropometryczne.

Obszar obejmuje:

- listę i historię pomiarów,
- podgląd najnowszych wartości,
- widoki trendów i porównań,
- modalny flow dodawania / edycji danych.

Główne pliki:

- `app/components/home/measurements/Measurements.tsx`
- `app/components/home/measurements/MeasurementsPopUp.tsx`

### 12. Trener / współpraca trener–podopieczny

To jeden z bardziej rozbudowanych obszarów biznesowych aplikacji. Obejmuje:

- stany „mam trenera” / „nie mam trenera”,
- zaproszenia trenerskie,
- sekcję współpracy,
- plan aktywny podopiecznego,
- requesty o raport,
- historię raportów,
- preview odpowiedzi,
- komentarze trenera do raportów,
- deep-linki z powiadomień do konkretnych requestów/raportów.

Główne pliki:

- `app/components/trainer/Trainer.tsx`
- `app/components/trainer/WithTrainerState.tsx`
- `app/components/trainer/NoTrainerState.tsx`
- `app/components/trainer/PendingTrainerInvitationCard.tsx`
- `app/components/trainer/CollaborationSection.tsx`
- `app/components/trainer/CurrentPlanSection.tsx`
- `app/components/trainer/ReportRequestsSection.tsx`
- `app/components/trainer/ReportRequestFormModal.tsx`
- `app/components/trainer/ReportsListSection.tsx`
- `app/components/trainer/ReportSubmissionPreviewModal.tsx`

### 13. Dieta, raportowanie zdjęciowe i notatki

Warstwa mobilna obsługuje już nie tylko sam trening, ale też dodatkowe obszary współpracy trener–podopieczny:

- pobieranie i prezentowanie planów dietetycznych,
- reporting zdjęciowy z flow upload init / upload complete,
- historię zdjęć powiązanych z raportowaniem,
- notatki trenera i podopiecznego jako osobny element współpracy.

To rozszerza produkt z „aplikacji treningowej” do narzędzia szerszej opieki treningowo-żywieniowej.

Główne pliki:

- `app/services/dietPlans/dietPlanService.ts`
- `app/services/reporting/reportingPhotos.ts`
- `app/services/reporting/reportingFeedback.ts`
- `app/services/traineeNotes/traineeNoteService.ts`

### 14. Powiadomienia in-app i realtime

System powiadomień wspiera:

- listę nowych i przeczytanych notyfikacji,
- licznik unread,
- oznaczanie jako przeczytane,
- live refresh przez SignalR,
- routing do ekranów związanych z trenerem,
- obsługę eventów typu trainer invitation, report request, report feedback,
- zdarzenia związane z dietą, pomiarami, notatkami i wiadomościami trenerskimi.

Główne pliki:

- `app/components/home/notifications/Notifications.tsx`
- `app/contexts/NotificationContext.tsx`
- `app/services/notifications/NotificationService.ts`
- `hooks/useSignalRNotifications.ts`
- `app/services/signalr/SignalRService.ts`
- `app/types/notification.ts`
- `app/components/SignalRInitializer.tsx`

---

## PL — Informacje techniczne

### Tech stack

- **React Native** `0.81.x`
- **Expo** `54`
- **Expo Router**
- **TypeScript**
- **React Query** (`@tanstack/react-query`)
- **Axios**
- **SignalR** (`@microsoft/signalr`)
- **Zustand**
- **expo-image-picker**
- **expo-location**
- **expo-clipboard**
- **NativeWind / Tailwind utilities**
- **Victory Native**
- **react-native-calendar-strip**
- **@shopify/react-native-skia**
- **react-native-toast-message**
- **React Native SVG**
- **React Native Vector Icons**
- **i18next + react-i18next**
- **EAS Build / Submit**
- **Orval** do generowania kontraktów API

### Architektura aplikacji

#### Provider tree

Top-level provider chain w `app/_layout.tsx`:

1. `QueryClientProvider`
2. `AppProvider`
3. `NotificationProvider`
4. `OnboardingProvider`
5. `SignalRInitializer`
6. `Stack` z `expo-router`

To oznacza, że:

- cache API jest globalny,
- stan użytkownika i tokenu jest globalny,
- notyfikacje są dostępne w całej aplikacji,
- onboarding może wpływać na routing między ekranami,
- SignalR startuje centralnie po starcie aplikacji.

#### Warstwy odpowiedzialności

- `app/` — routy i globalne providery
- `app/components/` — moduły produktowe i UI
- `app/contexts/` — konteksty domenowe (np. notifications)
- `hooks/` — logika współdzielona i integracje runtime
- `api/generated/` — wygenerowane klienty backendu
- `helpers/` / `services/` / `types/` — pomocnicze elementy wspólne

### Konfiguracja Expo i runtime

Aktualna konfiguracja `app.json` pokazuje kilka ważnych cech aplikacji:

- włączone `newArchEnabled`,
- pluginy `expo-router`, `expo-font`, `expo-image-picker`,
- skonfigurowane `runtimeVersion` i `updates.url` dla OTA updates,
- jawne `bundleIdentifier` / `package` dla iOS i Androida.

To oznacza, że README powinien traktować aplikację nie tylko jako lokalny klient developerski, ale jako gotowy do dystrybucji produkt mobilny.

### Integracja z backendem

Aplikacja używa wygenerowanych kontraktów z `orval`.

Kluczowe założenia:

- `Accept-Language` jest wysyłane automatycznie,
- `Authorization: Bearer <token>` jest dołączane, gdy użytkownik jest zalogowany,
- klient odczytuje bazowy URL z `REACT_APP_BACKEND`,
- część flow opiera się na relatywnych `redirectUrl` z backendu (np. notifications).

### Realtime / SignalR

SignalR obsługuje live update notyfikacji związanych z relacją trener–podopieczny.

Use case’y, które korzystają z tego flow:

- zaproszenia trenerskie,
- nowe requesty o raport,
- komentarze trenera do raportów,
- aktualizacje planów dietetycznych,
- powiadomienia o pomiarach,
- notatki podopiecznego i wiadomości trenerskie,
- inne trainer-related notification events.

### i18n

Interfejs jest utrzymywany w dwóch językach:

- polski,
- angielski.

Pliki tłumaczeń:

- `app/locales/pl.json`
- `app/locales/en.json`

### Styling i UX

UI bazuje na kombinacji:

- utility classes NativeWind,
- niestandardowych komponentów UI,
- fontów Google (`Open Sans`, `Caveat`, `Nunito`, `Teko`),
- własnych modal/dialog patterns.

### Skrypty developerskie

Najważniejsze skrypty z `package.json`:

```bash
npm run start            # Expo dev server
npm run android          # start dla Androida
npm run ios              # build/run iOS
npm run web              # web preview
npm run build:android    # EAS build Android
npm run build:androidDev # alternatywny profil Android build
npm run build:ios        # EAS build iOS
npm run submit:ios       # submit latest iOS build
npm run clean-setup      # czyści lokalne enums/interfaces
npm run copy-setup       # kopiuje enums/interfaces z ../apiv2
npm run generate:api     # regeneracja klienta API przez orval
```

### Konfiguracja środowiska lokalnego

Najważniejsza zmienna:

```env
REACT_APP_BACKEND=https://localhost:7025
```

Opcjonalnie dla Android emulatora:

```env
REACT_APP_ANDROID_EMULATOR_HOST=10.0.2.2
```

Warto też pamiętać o wymaganym środowisku Node z `package.json`:

```text
node >= 22.18.0
```

### Założenia techniczne i ograniczenia

- aplikacja zakłada obecność działającego backendu LGYM API,
- część flow opiera się na aktualnych kontraktach generowanych przez `orval`,
- moduły trenera są mocno zależne od poprawnych typów notyfikacji i `redirectUrl` zwracanych przez backend,
- logika realtime nie zastępuje trwałych danych — live event inicjuje odświeżenie danych z API.

### Dla kogo jest ten README?

Ten dokument ma pomóc:

- developerom mobile,
- osobom wdrażającym backend z klientem mobilnym,
- PM-om i QA, którzy chcą zrozumieć zakres funkcjonalny,
- nowym członkom zespołu, którzy potrzebują szybkiego wejścia w produkt.

---

## EN — Product Overview

### What is LGYM Mobile?

LGYM Mobile is a fitness and coaching mobile app that helps users manage training plans, track performance, and collaborate with a personal trainer in one place.

The product combines:

- workout planning,
- guided training execution,
- history and records,
- measurements and body progress tracking,
- gym and exercise management,
- diet plan access,
- onboarding and product education,
- in-app notifications and live updates,
- trainer–trainee collaboration, reports, feedback, photos, and notes.

### Business goal

The app is designed to reduce friction between planning and execution while improving trainer–trainee communication.

In practice, the product supports:

- **user retention** through consistent workout logging, progress visibility, and measurements,
- **coaching quality** through report requests, comments, notes, and live notifications,
- **trainer efficiency** through structured requests, report review, and guided follow-up,
- **product scalability** through generated API contracts, modular frontend architecture, and reusable UI patterns.

### Product assumptions

- this app is a mobile client for the LGYM backend API,
- the UI is bilingual (Polish / English),
- the backend is responsible for authentication, business data, and API contracts,
- most product areas assume JWT-based authenticated access,
- real-time updates are implemented with SignalR,
- some capabilities depend on the current user role and/or active trainer–trainee relationship.

### User roles

#### 1. User / trainee
Can:

- log in and register,
- create and execute training plans,
- review history, records, and measurements,
- receive trainer invitations,
- receive report requests,
- fill in reports,
- review trainer feedback on reports,
- use diet plans,
- receive live notifications related to trainer activity.

#### 2. Trainer
The data model and APIs support trainer workflows, and the mobile app already contains trainer-related UX for relationship management, requests, reports, feedback-aware navigation, notes, and notification-driven actions.

---

## EN — Main features

### 1. Authentication and account flows

Supported flows include:

- login,
- registration,
- forgot password,
- password reset,
- public invitation status.

Primary files:

- `app/Login.tsx`
- `app/Register.tsx`
- `app/forgot-password.tsx`
- `app/reset-password.tsx`
- `app/public-invitation-status.tsx`
- `app/AppContext.tsx`

### 2. App shell and navigation

The app runs inside a Home container that switches between major functional modules through an internal screen router.

The current navigation model includes `START`, `TRAINING`, `PLAN`, `EXERCISES`, `GYM`, `HISTORY`, `RECORDS`, `PROFILE`, `TRAINER`, `NOTIFICATIONS`, and `MEASUREMENTS`, coordinated through `HomeContext`.

Primary files:

- `app/_layout.tsx`
- `app/Start.tsx`
- `app/components/home/homeScreens.ts`
- `app/components/home/HomeContext.tsx`
- `app/components/layout/Header.tsx`
- `app/components/layout/Menu.tsx`

### 3. Onboarding and tutorial system

The product includes a tutorial flow and navigation gating to help new users complete the intended setup path.

Primary files:

- `app/onboarding/OnboardingContext.tsx`
- `app/onboarding/tutorialStepsConfig.ts`
- `app/onboarding/tutorialBackend.ts`
- `app/components/onboarding/ContextualHelpModal.tsx`

### 4. Start / dashboard

The dashboard shows:

- ranking,
- progress,
- last training summary,
- quick activity context.

Primary files:

- `app/components/home/start/Start.tsx`
- `app/components/home/start/UsersRanking.tsx`
- `app/components/home/start/ProgressInfo.tsx`
- `app/components/home/start/LastTrainingStartInfo.tsx`

### 5. Active training

One of the core product areas. It supports:

- choosing a training day,
- choosing a gym,
- starting a live session,
- entering series results,
- reviewing training summary,
- executing workouts in the context of a selected plan.

Primary files:

- `app/components/home/training/Training.tsx`
- `app/components/home/training/TrainingView.tsx`
- `app/components/home/training/TrainingSummary.tsx`
- `app/components/home/training/trainingChoices/TrainingDayChoose.tsx`
- `app/components/home/training/trainingChoices/TrainingGymChoose.tsx`
- `app/components/home/training/trainingPlanDay/TrainingPlanDay.tsx`
- `app/components/home/training/trainingPlanDay/TrainingPlanDayContext.tsx`

### 6. Training plans

The app supports:

- plan listing,
- plan creation,
- plan-day setup,
- exercise assignment,
- series/reps configuration,
- plan copy/share scenarios.

Primary files:

- `app/components/home/plan/TrainingPlan.tsx`
- `app/components/home/plan/PlansList.tsx`
- `app/components/home/plan/PlansListItem.tsx`
- `app/components/home/plan/PlanCopyDialog.tsx`
- `app/components/home/plan/PlanShareDialog.tsx`
- `app/components/home/plan/planDay/CreatePlanDay.tsx`

### 7. Exercise catalog

Supports:

- exercise list,
- exercise details,
- creating new exercises,
- exercise name translations,
- training-related exercise display.

Primary files:

- `app/components/home/exercises/Exercises.tsx`
- `app/components/home/exercises/ExercisesList.tsx`
- `app/components/home/exercises/ExerciseDetails.tsx`
- `app/components/home/exercises/CreateExercise.tsx`
- `app/components/home/exercises/ExerciseTranslationDialog.tsx`

### 8. Gym management

Users can manage training locations and select the gym context for their sessions.

Primary files:

- `app/components/home/gym/Gym.tsx`
- `app/components/home/gym/GymForm.tsx`
- `app/components/home/gym/GymPlace.tsx`

### 9. History and records

The product includes:

- workout history,
- training sessions grouped by date/time,
- personal record views and popups.

Primary files:

- `app/components/home/history/History.tsx`
- `app/components/home/history/TrainingSession.tsx`
- `app/components/home/records/Records.tsx`
- `app/components/home/records/RecordsPopUp.tsx`

### 10. Profile

The profile area covers core user information and account-related settings.

Primary files:

- `app/components/home/profile/Profile.tsx`
- `app/components/home/profile/MainProfileInfo.tsx`

### 11. Measurements and body progress tracking

The new `Measurements` module extends the product with body progress tracking. From a business perspective, this matters because the app can now capture coaching outcomes not only through workout logs and records, but also through anthropometric change.

The area covers:

- measurement history and listing,
- latest values,
- trend-oriented views,
- modal flows for adding or editing data.

Primary files:

- `app/components/home/measurements/Measurements.tsx`
- `app/components/home/measurements/MeasurementsPopUp.tsx`

### 12. Trainer collaboration

This is one of the most business-critical product areas. It includes:

- “with trainer” / “without trainer” states,
- trainer invitations,
- collaboration summary,
- current trainee plan,
- report requests,
- report history,
- submission preview,
- trainer feedback on reports,
- deep-links from notifications to specific requests and submissions.

Primary files:

- `app/components/trainer/Trainer.tsx`
- `app/components/trainer/WithTrainerState.tsx`
- `app/components/trainer/NoTrainerState.tsx`
- `app/components/trainer/PendingTrainerInvitationCard.tsx`
- `app/components/trainer/CollaborationSection.tsx`
- `app/components/trainer/CurrentPlanSection.tsx`
- `app/components/trainer/ReportRequestsSection.tsx`
- `app/components/trainer/ReportRequestFormModal.tsx`
- `app/components/trainer/ReportsListSection.tsx`
- `app/components/trainer/ReportSubmissionPreviewModal.tsx`

### 13. Diet plans, photo reporting, and trainee notes

The mobile layer now covers more than training itself. It also includes:

- diet plan retrieval and presentation,
- photo-reporting flows with upload init / upload complete,
- reporting photo history,
- trainee / trainer notes as a dedicated collaboration surface.

This shifts the app toward a broader coaching product, not only a workout tracker.

Primary files:

- `app/services/dietPlans/dietPlanService.ts`
- `app/services/reporting/reportingPhotos.ts`
- `app/services/reporting/reportingFeedback.ts`
- `app/services/traineeNotes/traineeNoteService.ts`

### 14. In-app notifications and real-time updates

The notification system supports:

- unread/seen tabs,
- unread counters,
- mark-as-read flows,
- live refresh over SignalR,
- trainer-related deep-links,
- trainer invitation / report request / report feedback events,
- diet, measurement, trainee-note, and trainer-message related events.

Primary files:

- `app/components/home/notifications/Notifications.tsx`
- `app/contexts/NotificationContext.tsx`
- `app/services/notifications/NotificationService.ts`
- `hooks/useSignalRNotifications.ts`
- `app/services/signalr/SignalRService.ts`
- `app/types/notification.ts`
- `app/components/SignalRInitializer.tsx`

---

## EN — Technical overview

### Tech stack

- **React Native** `0.81.x`
- **Expo** `54`
- **Expo Router**
- **TypeScript**
- **React Query** (`@tanstack/react-query`)
- **Axios**
- **SignalR** (`@microsoft/signalr`)
- **Zustand**
- **expo-image-picker**
- **expo-location**
- **expo-clipboard**
- **NativeWind / Tailwind-style utilities**
- **Victory Native**
- **react-native-calendar-strip**
- **@shopify/react-native-skia**
- **react-native-toast-message**
- **React Native SVG**
- **React Native Vector Icons**
- **i18next + react-i18next**
- **EAS Build / Submit**
- **Orval** for generated API contracts

### Provider tree

Defined in `app/_layout.tsx`:

1. `QueryClientProvider`
2. `AppProvider`
3. `NotificationProvider`
4. `OnboardingProvider`
5. `SignalRInitializer`
6. `expo-router` stack

This means:

- API caching is global,
- auth and user state are global,
- notifications are globally accessible,
- onboarding can influence navigation,
- SignalR starts centrally at boot.

### Responsibility layers

- `app/` — routes and top-level providers
- `app/components/` — feature modules and UI
- `app/contexts/` — domain-specific context/state
- `hooks/` — shared runtime logic
- `api/generated/` — generated backend clients
- `helpers/`, `services/`, `types/` — supporting infrastructure

### Expo runtime and delivery configuration

`app.json` shows several important runtime characteristics:

- `newArchEnabled` is enabled,
- plugins include `expo-router`, `expo-font`, and `expo-image-picker`,
- OTA delivery is configured through `runtimeVersion` and `updates.url`,
- iOS and Android bundle identifiers are defined explicitly.

This means the app should be understood as a distribution-ready mobile product, not only a local Expo prototype.

### Backend integration

The app relies on generated API contracts built with `orval`.

Key assumptions:

- `Accept-Language` is sent automatically,
- `Authorization: Bearer <token>` is attached when available,
- base backend URL comes from `REACT_APP_BACKEND`,
- some navigation flows depend on backend-provided relative `redirectUrl` values.

### Real-time architecture

SignalR is used for live trainer-related updates.

Examples:

- trainer invitations,
- report requests,
- trainer feedback on reports,
- diet-plan updates,
- measurement-related notifications,
- trainee notes and trainer messages,
- other trainer-related notification updates.

### Internationalization

The app is maintained in two languages:

- Polish
- English

Translation files:

- `app/locales/pl.json`
- `app/locales/en.json`

### UI approach

The UI combines:

- NativeWind utility classes,
- reusable custom components,
- Google Fonts (`Open Sans`, `Caveat`, `Nunito`, `Teko`),
- reusable dialog/modal patterns.

### Developer scripts

Key scripts from `package.json`:

```bash
npm run start            # Expo dev server
npm run android          # Android dev start
npm run ios              # iOS build/run
npm run web              # web preview
npm run build:android    # EAS Android build
npm run build:androidDev # alternate Android build profile
npm run build:ios        # EAS iOS build
npm run submit:ios       # submit latest iOS build
npm run clean-setup      # remove local enums/interfaces
npm run copy-setup       # copy enums/interfaces from ../apiv2
npm run generate:api     # regenerate API clients via orval
```

### Local environment configuration

Main environment variable:

```env
REACT_APP_BACKEND=https://localhost:7025
```

Optional Android emulator helper:

```env
REACT_APP_ANDROID_EMULATOR_HOST=10.0.2.2
```

Required runtime from `package.json`:

```text
node >= 22.18.0
```

### Technical assumptions and constraints

- the app expects a running LGYM backend API,
- some product flows depend on current generated API contracts,
- trainer modules depend on correct backend notification types and redirect URLs,
- real-time events do not replace canonical API reads — they trigger refresh flows.

### Who is this README for?

This document is intended for:

- mobile developers,
- engineers integrating the mobile app with the backend,
- PMs and QA who need a reliable functional scope overview,
- new team members onboarding into the product and codebase.

---

## Local API setup (quick reference)

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

### Axios / request behavior

- Base URL is normalized and resolved in `api/custom-instance.ts`.
- `Accept-Language` header is always attached from current i18n language.
- `Authorization: Bearer <token>` is attached when token exists.
- `X-Skip-Auth` can be set per request to skip auth header injection.
