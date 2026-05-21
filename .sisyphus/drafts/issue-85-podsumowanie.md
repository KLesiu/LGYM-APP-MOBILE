# Podsumowanie analizy feature'a z issue #85

## Źródło
- Issue: `https://github.com/KLesiu/LGYM-APP-MOBILE/issues/85`
- Repo analizowane: `mobile`
- Zakres: porównanie opisu zmian API z aktualnym stanem aplikacji mobilnej

## TL;DR
- Feature z issue #85 jest **wdrożony częściowo**.
- **Gotowe**: notifications REST + SignalR, obsługa `msg` w błędach, `PlanDto.id/userId` jako `string`, automatyczne `Idempotency-Key`, publiczny flow sprawdzania wersji aplikacji, toggle widoczności w rankingu.
- **Brakuje w UI / flow aplikacji**: odzyskiwania hasła, flow zaproszeń trenera po emailu, publicznego ekranu statusu zaproszenia, globalnej obsługi zablokowanego użytkownika / zrevokowanej sesji, jawnego rozróżnienia UX dla 400 vs 404.
- **Najpewniej poza zakresem mobile na ten moment**: admin users CRUD, admin app config CRUD, role pagination — w repo są klienty API, ale nie ma śladu ekranów ani modułów administracyjnych.

## Co jest już zrobione

### 1. Notifications REST + UI
- `api/generated/in-app-notification/in-app-notification.ts`
- `app/components/layout/NotificationsBell.tsx`
- `app/components/layout/NotificationsPanel.tsx`

Status:
- pobieranie listy powiadomień,
- unread count,
- mark as read,
- mark all as read,
- paginacja kursorowa (`CursorCreatedAt`, `CursorId`).

Ocena: **zrobione**

### 2. SignalR / real-time notifications
- `app/contexts/NotificationsContext.tsx`
- `app/services/notifications.ts`
- `package.json` (`@microsoft/signalr`)

Status:
- połączenie do `/hubs/notifications`,
- event `ReceiveNotification`,
- reconnect,
- synchronizacja cache i foreground notification.

Ocena: **zrobione**

### 3. Error contract `msg`
- `utils/errorHandler.ts`

Status:
- helper czyta `error.response.data.msg`,
- fallback do `error.message`.

Ocena: **zrobione częściowo** — format `msg` jest obsłużony, ale brak dedykowanego globalnego case'a `403 Account is blocked`.

### 4. PlanDto: `id` i `userId` jako `string`
- `api/generated/model/planDto.ts`

Status:
- oba pola są już typowane jako `string | null`.

Ocena: **zrobione**

### 5. Idempotency-Key
- `api/custom-instance.ts`

Status:
- interceptor dodaje `Idempotency-Key` do requestów mutujących (`POST/PUT/PATCH/DELETE`), jeśli nagłówek nie został podany ręcznie.

Ocena: **zrobione**, a nawet szerzej niż minimum z issue.

### 6. Zmiana widoczności w rankingu
- `app/components/home/profile/MainProfileInfo.tsx`
- `api/generated/user/user.ts`

Status:
- użytkownik może zmienić widoczność w rankingu z poziomu profilu,
- stan lokalny i cache rankingu są odświeżane.

Ocena: **zrobione funkcjonalnie**, ale wymaga potwierdzenia zgodności endpointu z issue.

### 7. Publiczny flow sprawdzania wersji aplikacji
- `hooks/useAppInitialization.ts`
- `app/components/elements/UpdateDialog.tsx`

Status:
- aplikacja sprawdza wymaganą wersję,
- potrafi wymusić aktualizację.

Ocena: **zrobione**, ale to dotyczy publicznego app-config/version check, a nie admin CRUD dla AppConfig.

## Czego jeszcze brakuje

### 1. Password recovery UI / UX
Pliki wskazujące gotowość backend contractu:
- `api/generated/user/user.ts`
- `api/generated/model/forgotPasswordRequest.ts`
- `api/generated/model/resetPasswordRequest.ts`

Braki:
- brak przycisku/entry-pointu „Zapomniałem hasła”,
- brak ekranu wysyłki maila resetującego,
- brak ekranu ustawienia nowego hasła,
- brak obsługi tokena resetu z linku.

Ocena: **niezrobione po stronie aplikacji**

### 2. Globalna obsługa blocked user / revoked session
Powiązane pliki:
- `utils/errorHandler.ts`
- `hooks/useAppInitialization.ts`
- `api/custom-instance.ts`

Braki:
- brak globalnego flow dla `403 { msg: "Account is blocked" }`,
- brak osobnego ekranu/informacji dla zablokowanego konta,
- brak centralnej obsługi sytuacji, gdy sesja została cofnięta i kolejne requesty wracają 401.

Ocena: **niezrobione / niedomknięte**

### 3. Rozróżnienie UX: 400 vs 404
Braki:
- brak centralnego rozróżnienia błędu walidacyjnego vs „nie znaleziono”,
- obecne flow zwykle pokazują tylko toast z komunikatem.

Ocena: **częściowo**

### 4. Trainer invitation by email
Kontrakty istnieją:
- `api/generated/trainer-relationship/trainer-relationship.ts`
- `api/generated/model/trainerInvitationDto.ts`

Braki:
- brak ekranów i formularzy wykorzystujących `POST /api/trainer/invitations/by-email`,
- brak listy paginowanej zaproszeń w UI,
- brak flow revoke w UI.

Ocena: **niezrobione po stronie aplikacji**

### 5. Public invitation status / deep link entry
Kontrakty istnieją:
- `api/generated/public-invitation/public-invitation.ts`
- `api/generated/model/publicInvitationStatusDto.ts`

Braki:
- brak ekranu otwieranego z linku publicznego,
- brak obsługi query params `invitationId` / `code`,
- brak prezentacji statusu `Pending / Accepted / Rejected / Revoked / Expired`.

Ocena: **niezrobione po stronie aplikacji**

## Elementy prawdopodobnie poza zakresem tej aplikacji mobilnej

### 1. Admin User CRUD
- `api/generated/admin-user/admin-user.ts`

Stan:
- klient API istnieje,
- brak użycia w `app/`, brak ekranów admina.

Ocena: **najpewniej poza zakresem mobile teraz**

### 2. AppConfig Admin CRUD
- `api/generated/app-config-admin/app-config-admin.ts`

Stan:
- klient API istnieje,
- brak użycia w `app/`, brak panelu administracyjnego.

Ocena: **najpewniej poza zakresem mobile teraz**

### 3. Role pagination
- `api/generated/role/role.ts`

Stan:
- klient API istnieje,
- brak ekranu listy ról i brak użycia w `app/`.

Ocena: **najpewniej poza zakresem mobile teraz**

## Obszary wymagające doprecyzowania

### 1. Endpoint visibility in ranking
- Issue mówi o: `/api/{userId}/change-visibility-in-ranking`
- wygenerowany klient używa: `/api/changeVisibilityInRanking`

Ocena:
- to może oznaczać, że:
  1. issue jest częściowo nieaktualne,
  2. klient OpenAPI nie został odświeżony,
  3. backend wystawia inny endpoint niż opisany w issue.

### 2. Czy admin features są naprawdę wymagane w mobile?
- Na podstawie kodu nie widać żadnego modułu administracyjnego.
- Sam fakt wygenerowania klienta API nie oznacza, że aplikacja mobilna ma to obsłużyć teraz.

## Wnioski końcowe
- **Najbardziej domknięty fragment feature'a**: notifications + SignalR.
- **Największe realne braki po stronie mobile**: password recovery, trainer invitation by email, public invitation status, blocked/revoked session handling, lepsze rozróżnienie 400/404.
- **Admin CRUD / role pagination** traktuję jako **domyślnie poza zakresem mobile**, dopóki nie pojawi się potwierdzenie biznesowe, że te moduły mają działać w tej aplikacji.

## Powiązany plan
- Jeśli chcesz domknąć braki, plan został/gotowy będzie zapisany w:
  `.sisyphus/plans/issue-85-domkniecie-featurea.md`
