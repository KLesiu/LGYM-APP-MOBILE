# Domknięcie feature'a z issue #85

## TL;DR

> **Quick Summary**: Aplikacja mobilna ma już wdrożone notifications, SignalR, `msg` error contract, `PlanDto` jako `string` oraz automatyczne `Idempotency-Key`, ale nadal brakuje kilku realnych elementów frontendowych opisanych w issue #85.
>
> **Deliverables**:
> - flow odzyskiwania hasła,
> - globalna obsługa blocked/revoked session,
> - flow zaproszeń trenera po emailu + publiczny status zaproszenia,
> - doprecyzowane UX dla 400 vs 404,
> - weryfikacja zgodności endpointu visibility-in-ranking.
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 fale
> **Critical Path**: 1 → 2 → 4 → 7 → F1-F4

---

## Context

### Original Request
Przeanalizować issue #85 z GitHuba pod kątem tego, co jest już zrobione w aktualnym repo mobile, przygotować polski plik podsumowujący i — jeśli są braki — wygenerować plan ich domknięcia.

### Interview Summary
**Key Discussions**:
- Analiza dotyczy tylko aplikacji mobilnej w tym repo, nie backendu.
- Summary ma być po polsku i ma wskazać: zrobione / brakujące / niepewne.
- Jeśli w issue są luki po stronie mobile, plan ma objąć tylko brakujące elementy frontendowe.

**Research Findings**:
- Notifications REST + SignalR są już wdrożone.
- `utils/errorHandler.ts` czyta `data.msg`.
- `api/generated/model/planDto.ts` ma `id` i `userId` jako `string`.
- `api/custom-instance.ts` dodaje `Idempotency-Key` do mutujących requestów.
- Password recovery, trainer invitation by email, public invitation status, admin-user, app-config-admin i role pagination istnieją w wygenerowanych klientach API, ale bez użycia w `app/`.
- Toggle visibility-in-ranking działa w UI, ale endpoint w wygenerowanym kliencie nie zgadza się 1:1 z opisem issue.
- Brak globalnej obsługi `403 Account is blocked` i wygaszonej/cofniętej sesji.
- Brak skonfigurowanych testów automatycznych.

### Metis Review
**Identified Gaps** (addressed):
- Admin surfaces oraz role pagination mogą być web-only — w tym planie są domyślnie wyłączone z implementacji mobile, dopóki nie pojawi się wyraźne potwierdzenie biznesowe.
- Różnica endpointu visibility-in-ranking jest traktowana jako zadanie weryfikacyjne na początku planu.
- Deep linki dla resetu hasła i publicznego statusu zaproszenia muszą być uwzględnione jawnie.
- UX dla 400/404/403 musi być zawężony tylko do nowych i dotykanych flow, bez globalnego refaktoru całej aplikacji.

---

## Work Objectives

### Core Objective
Domknąć brakujące frontendowe elementy issue #85 w aplikacji mobilnej, bez rozszerzania zakresu o backend i bez refaktoru już działających obszarów, takich jak notifications.

### Concrete Deliverables
- Ekran/flow `forgot-password`
- Ekran/flow `reset-password`
- Obsługa deep linku dla resetu hasła
- Globalna obsługa blocked/revoked session z dedykowanym ekranem stanu
- Ekran/flow zaproszenia trenera po emailu
- Ekran publicznego statusu zaproszenia
- Dostosowanie UX dla 400 vs 404 w nowych flow
- Weryfikacja i ewentualne dostosowanie endpointu visibility-in-ranking

### Definition of Done
- [ ] Wszystkie brakujące flow z tego planu są dostępne z poziomu aplikacji lub deep linku.
- [ ] Każdy nowy flow obsługuje happy path i co najmniej jeden negatywny scenariusz.
- [ ] Notifications i obecne flow auth nie są regresowane.
- [ ] Wszystkie scenariusze QA z planu mają zapisane evidence w `.sisyphus/evidence/`.

### Must Have
- Obsłużony reset hasła end-to-end po stronie mobile
- Obsłużony blocked/revoked session flow
- Obsłużone zaproszenie trenera po emailu i publiczny status zaproszenia
- Zachowana zgodność z aktualnym backend contractem dla visibility-in-ranking

### Must NOT Have (Guardrails)
- Nie modyfikować backendu
- Nie ruszać wdrożonego systemu notifications poza integracją z globalnym auth/session flow
- Nie budować panelu admina w mobile bez osobnej decyzji produktowej
- Nie robić szerokiego refaktoru całej obsługi błędów — tylko flow objęte tym planem
- Nie zakładać, że issue i wygenerowany klient API są w 100% zgodne bez weryfikacji

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — weryfikacja ma być agent-executed.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None (default)
- **Framework**: none
- **Agent-Executed QA**: YES, obowiązkowe dla każdego taska

### QA Policy
Każdy task musi mieć scenariusz happy path i scenariusz błędu. Evidence zapisujemy do `.sisyphus/evidence/`.

- **Frontend/UI**: Playwright na web buildzie uruchomionym przez `npm run web`
- **API contract verification**: Bash / generated client inspection / ewentualnie local API smoke jeśli backend dostępny
- **Navigation / deep links**: Playwright + expo-router routes lub dedykowany ekran wejściowy

---

## Execution Strategy

### Parallel Execution Waves

Wave 1 (Start Immediately - kontrakty + scaffolding):
├── Task 1: Zweryfikować kontrakty API i punkty wejścia [deep]
├── Task 2: Zbudować globalny auth/session handler + blocked account shell [unspecified-high]
├── Task 3: Dodać routing/deep-link scaffolding dla resetu hasła i zaproszeń [quick]
└── Task 4: Przygotować trainer invitation foundation w mobile [unspecified-high]

Wave 2 (After Wave 1 - główne flow):
├── Task 5: Wdrożyć ekran forgot password [quick]
├── Task 6: Wdrożyć ekran reset password [quick]
├── Task 7: Wdrożyć public invitation status flow [unspecified-high]
└── Task 8: Wdrożyć trainer invitation by email + revoke/list UX [deep]

Wave 3 (After Wave 2 - integracja i dopięcie UX):
├── Task 9: Dopięcie 400/404/403 UX na nowych flow [quick]
├── Task 10: Uzgodnić i domknąć visibility-in-ranking contract [quick]
└── Task 11: Integracja entrypointów, smoke QA i cleanup zakresu [unspecified-high]

Wave FINAL (After ALL tasks — 4 parallel reviews):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: 1 → 2 → 3 → 6 → 7 → 11 → F1-F4
Parallel Speedup: ~55% faster than sequential
Max Concurrent: 4

### Dependency Matrix

- **1**: - - 2, 3, 4, 10, 1
- **2**: 1 - 5, 6, 7, 8, 9, 11, 2
- **3**: 1 - 5, 6, 7, 11, 2
- **4**: 1 - 8, 11, 2
- **5**: 2, 3 - 9, 11, 3
- **6**: 2, 3 - 9, 11, 3
- **7**: 2, 3 - 9, 11, 3
- **8**: 2, 4 - 9, 11, 3
- **9**: 5, 6, 7, 8 - 11, 4
- **10**: 1 - 11, 4
- **11**: 9, 10 - F1-F4, 5

### Agent Dispatch Summary

- **1**: **4** - T1 → `deep`, T2 → `unspecified-high`, T3 → `quick`, T4 → `unspecified-high`
- **2**: **4** - T5 → `quick`, T6 → `quick`, T7 → `unspecified-high`, T8 → `deep`
- **3**: **3** - T9 → `quick`, T10 → `quick`, T11 → `unspecified-high`
- **FINAL**: **4** - F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. Zweryfikować kontrakty API i punkty wejścia

  **What to do**:
  - Sprawdzić zgodność aktualnych wygenerowanych klientów z wymaganiami z issue #85 dla: visibility-in-ranking, password reset, invitation status.
  - Potwierdzić, które elementy są rzeczywiście mobile scope, a które są tylko dociągniętym klientem API.
  - Jeśli wygenerowany klient dla visibility-in-ranking jest nieaktualny, zaplanować minimalne dostosowanie klienta lub odświeżenie generation step bez zmiany backendu.

  **Must NOT do**:
  - Nie implementować panelu admina „na zapas”.
  - Nie zmieniać backendu ani nie zakładać zgodności bez weryfikacji.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: trzeba porównać issue, generated clients i istniejące usage points, a potem ustalić bezpieczny kierunek implementacji.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `playwright`: niepotrzebny na etapie czystej weryfikacji kontraktów.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 2, 3, 4, 10
  - **Blocked By**: None

  **References**:
  - `api/generated/user/user.ts` - źródło prawdy dla login/logout/forgot/reset i visibility-in-ranking w aktualnym kliencie.
  - `api/generated/model/planDto.ts` - potwierdza, że `id`/`userId` są już stringami.
  - `app/components/home/profile/MainProfileInfo.tsx` - obecne użycie visibility toggle.
  - `.sisyphus/drafts/issue-85-podsumowanie.md` - lista już ustalonych braków i obszarów niepewnych.

  **Acceptance Criteria**:
  - [ ] Powstała lista kontraktów: zgodne / rozbieżne / web-only.
  - [ ] Jest jasna decyzja implementacyjna dla visibility-in-ranking w tym repo.

  **QA Scenarios**:
  ```
  Scenario: Kontrakt visibility-in-ranking jest potwierdzony
    Tool: Bash
    Preconditions: Repo otwarte lokalnie
    Steps:
      1. Odczytaj `api/generated/user/user.ts` i `app/components/home/profile/MainProfileInfo.tsx`
      2. Porównaj endpoint i payload z notatką w `.sisyphus/drafts/issue-85-podsumowanie.md`
      3. Zapisz w evidence decyzję: "client-ok" albo "client-stale"
    Expected Result: Jednoznaczny werdykt dla dalszej implementacji
    Failure Indicators: Nadal nie wiadomo, czy endpoint jest aktualny
    Evidence: .sisyphus/evidence/task-1-contract-audit.md

  Scenario: Web-only scope jest odfiltrowany
    Tool: Bash
    Preconditions: Repo otwarte lokalnie
    Steps:
      1. Sprawdź użycia `api/generated/admin-user/admin-user.ts`, `api/generated/app-config-admin/app-config-admin.ts`, `api/generated/role/role.ts`
      2. Potwierdź brak entrypointów w `app/`
      3. Zapisz wynik jako `mobile-scope-only`
    Expected Result: Admin/web-only elementy nie są implementowane w planie mobile bez potwierdzenia biznesowego
    Evidence: .sisyphus/evidence/task-1-scope-filter.md
  ```

- [x] 2. Dodać globalny auth/session handler i ekran konta zablokowanego

  **What to do**:
  - Dodać centralny mechanizm reagowania na `401` po cofniętej sesji i `403` dla zablokowanego konta.
  - Dodać dedykowany ekran stanu zablokowanego konta oraz bezpieczne czyszczenie sesji lokalnej.
  - Podłączyć ten flow do istniejącego axios/customInstance lub wspólnego wrappera requestów.

  **Must NOT do**:
  - Nie przepisywać całej obsługi błędów w całej aplikacji.
  - Nie zmieniać istniejących flow notifications poza koniecznym logout/disconnect.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: zadanie dotyka auth state, routera, storage i request layer jednocześnie.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `playwright`: potrzebny dopiero w QA, nie do implementacji.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 5, 6, 7, 8, 9, 11
  - **Blocked By**: 1

  **References**:
  - `api/custom-instance.ts` - istniejący request interceptor i najlepsze miejsce na centralne przechwytywanie.
  - `hooks/useAppInitialization.ts` - obecny flow resetowania sesji przy nieprawidłowym tokenie.
  - `stores/useAuthStore.ts` - minimalny stan auth do wyczyszczenia przy logout/block.
  - `app/Login.tsx` - wzorzec toast/error handling i przejścia do auth screenów.

  **Acceptance Criteria**:
  - [ ] `401` po cofniętej sesji czyści lokalną sesję i przenosi usera do auth flow.
  - [ ] `403 Account is blocked` pokazuje dedykowany ekran i odcina dostęp do reszty aplikacji.

  **QA Scenarios**:
  ```
  Scenario: Revoked session wymusza powrót do auth
    Tool: Playwright
    Preconditions: Aplikacja uruchomiona przez `npm run web`, użytkownik zalogowany
    Steps:
      1. Zmockuj request chroniony tak, aby zwracał 401
      2. Wykonaj akcję wywołującą ten request
      3. Sprawdź, że user wraca na ekran logowania i lokalny stan sesji jest wyczyszczony
    Expected Result: Brak dostępu do Home, widoczny login screen
    Failure Indicators: User zostaje w aplikacji mimo 401
    Evidence: .sisyphus/evidence/task-2-revoked-session.png

  Scenario: Blocked account pokazuje dedykowany stan
    Tool: Playwright
    Preconditions: Aplikacja uruchomiona, request zwraca 403 z `msg=Account is blocked`
    Steps:
      1. Wywołaj dowolny chroniony request
      2. Sprawdź przekierowanie na ekran blocked account
      3. Zweryfikuj brak możliwości przejścia dalej przyciskiem back
    Expected Result: Widoczny ekran blokady zamiast zwykłego toasta
    Evidence: .sisyphus/evidence/task-2-blocked-account.png
  ```

- [x] 3. Dodać routing i deep-link scaffolding dla recovery i invitation status

  **What to do**:
  - Dodać nowe trasy/entrypointy dla `forgot-password`, `reset-password` i public invitation status.
  - Zapewnić odczyt parametrów linku (token, invitationId, code) zgodnie z expo-router.
  - Przygotować wspólny mechanizm wejścia do flow anonimowych bez wymagania zalogowania.

  **Must NOT do**:
  - Nie implementować jeszcze całych ekranów biznesowych w tym tasku.
  - Nie mieszać anonymous routes z autoryzowanym Home flow bez guardów.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: to głównie scaffolding routingu i param parsing na istniejących wzorcach expo-router.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `playwright`: tylko do późniejszego QA.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 5, 6, 7, 11
  - **Blocked By**: 1

  **References**:
  - `app/_layout.tsx` - centralny router stack.
  - `app/Login.tsx`, `app/Register.tsx` - aktualny wzorzec publicznych ekranów auth.
  - `hooks/useAppInitialization.ts` - aktualne decyzje routingu startowego.

  **Acceptance Criteria**:
  - [ ] Istnieją routy dla nowych flow anonimowych.
  - [ ] Parametry z linku są poprawnie odczytywane i przekazywane do ekranu.

  **QA Scenarios**:
  ```
  Scenario: Reset password route przyjmuje token z URL
    Tool: Playwright
    Preconditions: Aplikacja uruchomiona na web
    Steps:
      1. Otwórz route resetu z przykładowym tokenem w query params
      2. Sprawdź, że ekran się renderuje bez logowania
      3. Sprawdź, że token jest dostępny dla formularza
    Expected Result: Token trafia do flow resetu
    Evidence: .sisyphus/evidence/task-3-reset-route.png

  Scenario: Invitation status route działa anonimowo
    Tool: Playwright
    Preconditions: Aplikacja uruchomiona na web
    Steps:
      1. Otwórz route statusu zaproszenia z `invitationId` i `code`
      2. Sprawdź, że brak redirectu do loginu
      3. Sprawdź render placeholder/state container
    Expected Result: Anonymous route jest dostępna
    Evidence: .sisyphus/evidence/task-3-invitation-route.png
  ```

- [x] 4. Przygotować foundation dla trainer invitation w mobile

  **What to do**:
  - Zdefiniować, gdzie w aplikacji mobilnej ma żyć moduł zaproszeń trenerskich.
  - Dodać minimalny entrypoint tylko dla użytkownika z odpowiednimi uprawnieniami/claimem, jeśli taki claim istnieje w user info.
  - Przygotować stan listy, statusów i mapowanie DTO do UI.

  **Must NOT do**:
  - Nie budować pełnego panelu trenera bez wąskiego scope dla zaproszeń.
  - Nie zakładać istnienia gotowej sekcji trainer w app, jeśli jej nie ma.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: trzeba utworzyć nowy obszar funkcjonalny w aplikacji, ale w wąskim zakresie.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: niekonieczne, bo chodzi o minimalny funkcjonalny entrypoint.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 8, 11
  - **Blocked By**: 1

  **References**:
  - `api/generated/trainer-relationship/trainer-relationship.ts` - źródło endpointów by-email, paginated, revoke.
  - `api/generated/model/trainerInvitationDto.ts` - pola statusów i nowych danych `inviteeEmail`, `traineeName`, `traineeEmail`.
  - `app/components/layout/Header.tsx` i istniejące home components - wzorce osadzania nowej funkcji w obecnym shellu UI.

  **Acceptance Criteria**:
  - [ ] Istnieje jasno określony mobile entrypoint dla trainer invitations.
  - [ ] UI state potrafi odwzorować co najmniej statusy pending/accepted/rejected/revoked/expired.

  **QA Scenarios**:
  ```
  Scenario: Entry point jest widoczny tylko dla właściwego usera
    Tool: Playwright
    Preconditions: Aplikacja uruchomiona, dwa mockowane profile: zwykły user i trainer/admin-with-claim
    Steps:
      1. Zaloguj się jako zwykły user i sprawdź brak entrypointu
      2. Zaloguj się jako user z wymaganym claimem i sprawdź obecność entrypointu
    Expected Result: Funkcja nie jest pokazywana wszystkim użytkownikom
    Evidence: .sisyphus/evidence/task-4-entrypoint-gating.png

  Scenario: Lista statusów mapuje DTO na czytelny UI state
    Tool: Playwright
    Preconditions: Mock danych listy zaproszeń
    Steps:
      1. Podaj rekordy o różnych statusach
      2. Sprawdź render każdego statusu
    Expected Result: Statusy są rozróżnialne i zgodne z DTO
    Evidence: .sisyphus/evidence/task-4-status-map.png
  ```

- [x] 5. Wdrożyć ekran forgot password

  **What to do**:
  - Dodać publiczny ekran z polem email i submit do `POST /api/forgot-password`.
  - Obsłużyć sukces typu „zawsze 200” bez ujawniania, czy email istnieje.
  - Dodać walidację inputu i komunikaty zgodne z istniejącym stylem auth UI.

  **Must NOT do**:
  - Nie ujawniać użytkownikowi, czy konto istnieje.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 9, 11
  - **Blocked By**: 2, 3

  **References**:
  - `app/Login.tsx` - wzorzec publicznego ekranu auth.
  - `api/generated/user/user.ts` - endpoint `forgot-password`.
  - `utils/errorHandler.ts` - aktualny helper komunikatów błędów.

  **Acceptance Criteria**:
  - [ ] Użytkownik może wejść na ekran forgot password bez logowania.
  - [ ] Poprawny submit zawsze kończy się neutralnym komunikatem sukcesu.

  **QA Scenarios**:
  ```
  Scenario: Forgot password happy path
    Tool: Playwright
    Preconditions: Aplikacja uruchomiona, endpoint zwraca 200
    Steps:
      1. Otwórz ekran forgot password
      2. Wpisz `test@example.com`
      3. Kliknij submit i sprawdź komunikat sukcesu
    Expected Result: Użytkownik widzi neutralny success message
    Evidence: .sisyphus/evidence/task-5-forgot-success.png

  Scenario: Niepoprawny email blokuje submit
    Tool: Playwright
    Preconditions: Aplikacja uruchomiona
    Steps:
      1. Wpisz `abc`
      2. Kliknij submit
      3. Sprawdź walidację formularza
    Expected Result: Brak requestu, widoczny komunikat walidacyjny
    Evidence: .sisyphus/evidence/task-5-forgot-invalid-email.png
  ```

- [x] 6. Wdrożyć ekran reset password

  **What to do**:
  - Dodać formularz z `token`, `newPassword`, `confirmPassword`.
  - Wczytywać token z deep linku / query params.
  - Obsłużyć sukces 200 i walidacyjne 400.

  **Must NOT do**:
  - Nie trzymać użytkownika w zalogowanym flow, jeśli ekran resetu jest anonimowy.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 9, 11
  - **Blocked By**: 2, 3

  **References**:
  - `app/Register.tsx` - wzorzec formularza z walidacją dwóch pól hasła.
  - `api/generated/user/user.ts` - endpoint `reset-password`.
  - `app/_layout.tsx` - routing stack.

  **Acceptance Criteria**:
  - [ ] Token z linku trafia do formularza resetu.
  - [ ] Niezgodne hasła są zatrzymywane po stronie UI.
  - [ ] Odpowiedź 400 pokazuje userowi czytelny komunikat.

  **QA Scenarios**:
  ```
  Scenario: Reset password happy path
    Tool: Playwright
    Preconditions: Route otwarta z tokenem, endpoint zwraca 200
    Steps:
      1. Otwórz ekran resetu z tokenem `abc123`
      2. Wpisz `NoweHaslo123!` i potwierdzenie
      3. Kliknij submit
    Expected Result: Widoczny komunikat sukcesu i jasna ścieżka powrotu do logowania
    Evidence: .sisyphus/evidence/task-6-reset-success.png

  Scenario: Mismatch haseł
    Tool: Playwright
    Preconditions: Ekran resetu otwarty
    Steps:
      1. Wpisz dwa różne hasła
      2. Kliknij submit
    Expected Result: Brak requestu, lokalny komunikat błędu
    Evidence: .sisyphus/evidence/task-6-reset-mismatch.png
  ```

- [x] 7. Wdrożyć public invitation status flow

  **What to do**:
  - Dodać anonimowy ekran statusu zaproszenia korzystający z `GET /api/invitations/{invitationId}?code=...`.
  - Pokazać status i podstawowe CTA zależne od stanu.
  - Obsłużyć `404` i niepoprawny/expired link.

  **Must NOT do**:
  - Nie wymagać logowania do samego odczytu statusu.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 9, 11
  - **Blocked By**: 2, 3

  **References**:
  - `api/generated/public-invitation/public-invitation.ts` - request publiczny bez auth.
  - `api/generated/model/publicInvitationStatusDto.ts` - pola `status`, `userExists`.
  - `app/Login.tsx` - wzorzec publicznego ekranu w aktualnym designie.

  **Acceptance Criteria**:
  - [ ] Link publiczny otwiera ekran statusu bez logowania.
  - [ ] `404` ma osobny stan „link nie istnieje / wygasł”.

  **QA Scenarios**:
  ```
  Scenario: Public invitation status happy path
    Tool: Playwright
    Preconditions: Endpoint zwraca 200 z `status=Pending`
    Steps:
      1. Otwórz route z `invitationId` i `code`
      2. Poczekaj na fetch
      3. Sprawdź render statusu `Pending`
    Expected Result: Status jest czytelny i ekran nie wymaga auth
    Evidence: .sisyphus/evidence/task-7-status-pending.png

  Scenario: Niepoprawny link daje 404 state
    Tool: Playwright
    Preconditions: Endpoint zwraca 404
    Steps:
      1. Otwórz route z błędnym `invitationId`
      2. Sprawdź stan błędu
    Expected Result: Użytkownik widzi stan „link nieprawidłowy/wygasł”, a nie pusty ekran
    Evidence: .sisyphus/evidence/task-7-status-404.png
  ```

- [x] 8. Wdrożyć trainer invitation by email + revoke/list UX

  **What to do**:
  - Dodać formularz zapraszania po emailu.
  - Dodać widok listy zaproszeń z paginacją i statusem.
  - Dodać akcję revoke z odświeżeniem listy.

  **Must NOT do**:
  - Nie rozwijać pełnego CRM/panelu trenera poza listę zaproszeń.

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 9, 11
  - **Blocked By**: 2, 4

  **References**:
  - `api/generated/trainer-relationship/trainer-relationship.ts` - by-email, paginated, revoke.
  - `api/generated/model/trainerInvitationDto.ts` - pola do renderu listy i statusów.
  - `api/custom-instance.ts` - `Idempotency-Key` dla mutacji.

  **Acceptance Criteria**:
  - [ ] Można wysłać zaproszenie po emailu.
  - [ ] Można zobaczyć listę zaproszeń i ich statusy.
  - [ ] Można cofnąć zaproszenie i zobaczyć odświeżony status.

  **QA Scenarios**:
  ```
  Scenario: Wysłanie zaproszenia po emailu
    Tool: Playwright
    Preconditions: User z dostępem do trainer flow, endpoint 200
    Steps:
      1. Otwórz ekran zaproszeń
      2. Wpisz `invitee@example.com`, ustaw `pl` i `Europe/Warsaw`
      3. Kliknij submit
    Expected Result: Widoczny sukces i nowy rekord na liście
    Evidence: .sisyphus/evidence/task-8-send-invite.png

  Scenario: Revoke zmienia status
    Tool: Playwright
    Preconditions: Lista zawiera rekord `Pending`
    Steps:
      1. Kliknij revoke na wybranym rekordzie
      2. Poczekaj na odświeżenie listy
    Expected Result: Rekord ma status `Revoked`
    Evidence: .sisyphus/evidence/task-8-revoke.png
  ```

- [ ] 9. Dopięcie UX dla 400 vs 404 vs 403 w nowych flow

  **What to do**:
  - Ujednolicić zachowanie touched flows tak, aby:
    - `400` = user-fixable validation/form state,
    - `404` = not-found/expired state,
    - `403` = blocked account flow.
  - Ograniczyć zmiany do nowych i dotkniętych ekranów.

  **Must NOT do**:
  - Nie robić globalnego refaktoru wszystkich ekranów w repo.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential after Wave 2
  - **Blocks**: 11
  - **Blocked By**: 5, 6, 7, 8

  **References**:
  - `utils/errorHandler.ts` - punkt wyjścia dla wspólnego mapowania komunikatów.
  - `app/Login.tsx`, `app/Register.tsx` - obecny wzorzec prezentacji błędów.

  **Acceptance Criteria**:
  - [ ] Nowe flow rozróżniają 400/404/403 w UI.
  - [ ] `404` nie jest pokazywane jak zwykły validation toast.

  **QA Scenarios**:
  ```
  Scenario: 400 zostawia usera na formularzu
    Tool: Playwright
    Preconditions: Endpoint nowego flow zwraca 400
    Steps:
      1. Wyślij formularz z błędnymi danymi
      2. Sprawdź brak przekierowania
      3. Sprawdź widoczny komunikat walidacyjny
    Expected Result: User może poprawić dane na tym samym ekranie
    Evidence: .sisyphus/evidence/task-9-error-400.png

  Scenario: 404 pokazuje stan not-found
    Tool: Playwright
    Preconditions: Endpoint statusu zaproszenia zwraca 404
    Steps:
      1. Otwórz błędny link
      2. Sprawdź osobny stan ekranu
    Expected Result: Ekran komunikuje brak zasobu, a nie generic form error
    Evidence: .sisyphus/evidence/task-9-error-404.png
  ```

- [ ] 10. Uzgodnić i domknąć visibility-in-ranking contract

  **What to do**:
  - Na podstawie wyniku Task 1 potwierdzić lub poprawić wywołanie endpointu zmiany widoczności w rankingu.
  - Upewnić się, że UI profilu nadal działa po ewentualnym dostosowaniu kontraktu.

  **Must NOT do**:
  - Nie zmieniać zachowania rankingu poza tym jednym kontraktem.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: 11
  - **Blocked By**: 1

  **References**:
  - `app/components/home/profile/MainProfileInfo.tsx` - aktualne wywołanie mutacji.
  - `api/generated/user/user.ts` - obecny kontrakt endpointu.

  **Acceptance Criteria**:
  - [ ] Toggle widoczności działa zgodnie z aktualnym backend contractem.
  - [ ] Nie ma regresji w odświeżaniu rankingu.

  **QA Scenarios**:
  ```
  Scenario: Toggle visibility nadal działa
    Tool: Playwright
    Preconditions: Użytkownik zalogowany, profil otwarty
    Steps:
      1. Zmień wartość checkboxa widoczności
      2. Poczekaj na mutację i odświeżenie query
      3. Odśwież ekran profilu
    Expected Result: Nowa wartość utrzymuje się i nie ma błędu kontraktu
    Evidence: .sisyphus/evidence/task-10-visibility-toggle.png

  Scenario: Błąd kontraktu nie psuje UI
    Tool: Playwright
    Preconditions: Zmockowany błąd requestu
    Steps:
      1. Kliknij toggle
      2. Sprawdź rollback optimistic state
    Expected Result: UI wraca do poprzedniej wartości
    Evidence: .sisyphus/evidence/task-10-visibility-rollback.png
  ```

- [ ] 11. Zintegrować entrypointy, zrobić smoke QA i domknąć zakres

  **What to do**:
  - Dodać linki/przyciski wejścia do nowych flow w odpowiednich miejscach aplikacji.
  - Sprawdzić spójność routingów publicznych i autoryzowanych.
  - Upewnić się, że scope nie rozrósł się o admin/web-only moduły.

  **Must NOT do**:
  - Nie dodawać nowych funkcji poza listą z tego planu.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential final integration
  - **Blocks**: F1-F4
  - **Blocked By**: 2, 3, 4, 5, 6, 7, 8, 9, 10

  **References**:
  - `app/Login.tsx` - naturalny entrypoint do forgot password.
  - `app/_layout.tsx` - finalny routing stack.
  - `app/components/layout/Header.tsx` - ewentualne miejsce dla entrypointów zależnych od roli.
  - `.sisyphus/drafts/issue-85-podsumowanie.md` - kontrola zakresu.

  **Acceptance Criteria**:
  - [ ] Wszystkie nowe flow da się uruchomić z poziomu UI lub linku.
  - [ ] Admin/web-only scope nie pojawił się przypadkiem w implementacji.

  **QA Scenarios**:
  ```
  Scenario: Wszystkie entrypointy działają
    Tool: Playwright
    Preconditions: Aplikacja uruchomiona na web
    Steps:
      1. Z loginu przejdź do forgot password
      2. Otwórz reset password route z tokenem
      3. Otwórz invitation status route z parametrami
      4. Wejdź do trainer invitations jako uprawniony user
    Expected Result: Każdy entrypoint prowadzi do poprawnego ekranu
    Evidence: .sisyphus/evidence/task-11-entrypoints.png

  Scenario: Scope contamination check
    Tool: Bash
    Preconditions: Zmiany zaimplementowane
    Steps:
      1. Przejrzyj zmienione pliki
      2. Potwierdź brak nowego panelu admina i brak zmian w notifications poza niezbędną integracją
    Expected Result: Zmiany ograniczone do celów issue #85
    Evidence: .sisyphus/evidence/task-11-scope-clean.md
  ```

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Zweryfikować każdy deliverable z planu względem faktycznie dodanych ekranów, entrypointów, hooków i evidence.

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Sprawdzić build/lint, nadmiarowy scope, nieużywane importy i zgodność z istniejącymi wzorcami auth / routing / toast handling.

- [ ] F3. **Real Manual QA** — `unspecified-high`
  Uruchomić aplikację i przejść wszystkie scenariusze QA z tasków, zapisując evidence do `.sisyphus/evidence/final-qa/`.

- [ ] F4. **Scope Fidelity Check** — `deep`
  Sprawdzić, czy zmiany dotyczą wyłącznie elementów z issue #85 objętych tym planem i nie rozszerzają się na admin/web-only scope.

---

## Commit Strategy

- **1**: `feat(auth): add recovery and blocked-session flows`
- **2**: `feat(trainer): add invitation flows and public status`
- **3**: `fix(api): align visibility and error UX with issue-85`

---

## Success Criteria

### Verification Commands
```bash
npm run web
```

### Final Checklist
- [ ] Wszystkie realne braki mobile z issue #85 są pokryte
- [ ] Obszary już wdrożone (notifications, SignalR) nie uległy regresji
- [ ] Brak nieautoryzowanego wejścia w scope admin/web-only
- [ ] Evidence istnieje dla wszystkich tasków i final QA
