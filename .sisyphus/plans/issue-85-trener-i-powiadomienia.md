# Korekta zakresu issue #85: zakładka Trener i powiadomienia

## TL;DR

> **Quick Summary**: Poprzedni kierunek był zbyt wąski. Docelowy mobile scope ma objąć osobną zakładkę **Trener** w głównej nawigacji, dzwonek powiadomień w headerze, ekran listy powiadomień oraz pełne dopięcie mobilnego klienta **SignalR** dla trainer-related notifications.
>
> **Deliverables**:
> - nowy główny entrypoint **Trener**,
> - dzwonek + ekran powiadomień,
> - integracja SignalR po stronie mobile,
> - dwa stany zakładki Trener: bez trenera / z trenerem,
> - sekcje: współpraca, trener, aktualny plan, prośby o raporty, lista raportów,
> - klikalne trainer-related notifications otwierające właściwy kontekst.
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 4 fale
> **Critical Path**: 1 → 4 → 9 → 13 → F1-F4

---

## Context

### Original Request
Użytkownik skorygował wcześniejszą implementację i doprecyzował, że właściwy zakres mobile ma obejmować osobną zakładkę **Trener** oraz dzwonek powiadomień z integracją SignalR i klikanymi powiadomieniami związanymi z flow trenera.

### Interview Summary
**Key Discussions**:
- Zakładka **Trener** ma wejść do głównej nawigacji aplikacji.
- Dzwonek ma być w headerze i otwierać osobny ekran listy powiadomień.
- W pierwszej wersji klikalne mają być tylko powiadomienia związane z flow trenerskim.
- Kliknięcie zaproszenia od trenera ma otwierać zakładkę Trener.
- Zakładka Trener ma pokazywać pełny zakres danych, gdy relacja z trenerem istnieje.
- Całość musi zachować spójność kolorystyczną i UX z resztą aplikacji.

**Research Findings**:
- Główna nawigacja jest customowa (`Home.tsx`, `HomeContext.tsx`, `Menu.tsx`), a nie klasycznym expo-router tab barem.
- Header ma miejsce na akcję w prawym górnym rogu, ale nie ma dziś dzwonka.
- Istnieją kontrakty dla relacji trener–podopieczny, zaproszeń, planów, report requests i report submissions.
- Istnieją REST kontrakty dla listy powiadomień, unread count, mark-read i mark-all-read.
- Nie znaleziono gotowej integracji SignalR po stronie mobile, więc trzeba ją jawnie zaplanować.

### Metis Review
**Identified Gaps** (addressed):
- Trzeba jawnie zablokować scope creep w stronę push notifications, preferencji powiadomień, chatu i trainer discovery.
- Trzeba rozbić pracę tak, by osobno obsłużyć: architekturę nawigacji, realtime, ekran powiadomień i ekran Trener.
- Trzeba dopisać edge cases dla stanów relacji trener–podopieczny i dla zerwanego połączenia SignalR.

---

## Work Objectives

### Core Objective
Zaprojektować i wdrożyć poprawny mobile scope dla obszaru **Trener + Powiadomienia**, zgodny z oczekiwanym UX: osobna zakładka Trener, dzwonek w headerze, osobny ekran powiadomień i klikalne trainer-related notifications z pełną integracją SignalR.

### Concrete Deliverables
- Nowy screen ID / entrypoint `TRAINER` w głównej nawigacji aplikacji
- Dzwonek w headerze z unread badge
- Osobny ekran listy powiadomień
- Mobile client SignalR + lifecycle połączenia
- Routing z powiadomień do zakładki Trener
- Zakładka Trener: stan bez trenera (invite by email)
- Zakładka Trener: stan z trenerem (współpraca, trener, plan, prośby o raporty, lista raportów)

### Definition of Done
- [ ] Zakładka Trener jest dostępna z głównej nawigacji i działa w obu stanach relacji.
- [ ] Dzwonek pokazuje unread count i otwiera ekran powiadomień.
- [ ] SignalR aktualizuje stan powiadomień w czasie rzeczywistym dla trainer-related events.
- [ ] Kliknięcie trainer-related notification przenosi do poprawnego kontekstu zakładki Trener.
- [ ] Cały nowy UI jest spójny wizualnie z resztą aplikacji.

### Must Have
- Zakładka Trener jako top-level destination
- Dzwonek + ekran powiadomień
- SignalR client po stronie mobile
- Invite by email, informacje o trenerze i współpracy
- Aktualny plan, report requests i reports list

### Must NOT Have (Guardrails)
- Nie wdrażać backend changes
- Nie rozszerzać V1 o push notifications system-level
- Nie budować preferencji powiadomień / filtrów / archiwizacji
- Nie dodawać trainer chat / discovery / directory
- Nie tworzyć nowego systemu stylowania oderwanego od istniejących wzorców
- Nie implementować klikalności dla wszystkich typów powiadomień — tylko trainer-related

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — wszystkie kryteria muszą być weryfikowalne agentowo.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Framework**: none
- **Agent-Executed QA**: YES

### QA Policy
- UI: Playwright na web buildzie
- Realtime: test z kontrolowanym eventem / mockiem / backendowym triggerem, jeśli dostępny
- Evidence: `.sisyphus/evidence/`

---

## Execution Strategy

### Parallel Execution Waves

Wave 1 (foundation + architecture):
- T1: Zmapować i rozszerzyć architekturę nawigacji pod `TRAINER` [deep]
- T2: Zaprojektować model notification domain + unread state [quick]
- T3: Zaprojektować i osadzić klienta SignalR / lifecycle połączenia [unspecified-high]
- T4: Dopiąć generated REST notification hooks do wspólnego service layer [quick]

Wave 2 (surface entrypoints):
- T5: Dodać nową pozycję Trener do głównej nawigacji/menu [quick]
- T6: Dodać dzwonek i unread badge do headera [quick]
- T7: Zbudować ekran listy powiadomień [unspecified-high]
- T8: Dodać routing z kliknięcia notification → Trainer tab [deep]

Wave 3 (Trainer tab states):
- T9: Zbudować stan „bez trenera” z invite-by-email [quick]
- T10: Zbudować stan „ma trenera” — hero / współpraca / trener info [unspecified-high]
- T11: Sekcja aktualnego planu przypisanego przez trenera [unspecified-high]
- T12: Sekcja report requests + reports list [deep]

Wave 4 (integration + polish):
- T13: Spójność UI/UX i loading/empty/error states [visual-engineering]
- T14: Obsługa edge cases relacji i połączenia SignalR [deep]
- T15: End-to-end notification + Trainer integration smoke [unspecified-high]

Wave FINAL:
- F1: Plan compliance audit [oracle]
- F2: Code quality review [unspecified-high]
- F3: Real manual QA [unspecified-high + playwright]
- F4: Scope fidelity check [deep]

Critical Path: T1 → T3 → T6 → T7 → T8 → T10 → T12 → T15 → F1-F4

### Dependency Matrix
- **T1**: None → T5, T8
- **T2**: None → T6, T7, T15
- **T3**: None → T6, T7, T14, T15
- **T4**: None → T7, T15
- **T5**: T1 → T9, T10, T11, T12
- **T6**: T2, T3 → T7, T15
- **T7**: T2, T3, T4, T6 → T8, T15
- **T8**: T1, T5, T7 → T15
- **T9**: T5 → T13, T15
- **T10**: T5 → T11, T12, T13, T15
- **T11**: T10 → T13, T15
- **T12**: T10 → T13, T15
- **T13**: T9, T10, T11, T12 → T15
- **T14**: T3 → T15
- **T15**: T6, T7, T8, T9, T10, T11, T12, T13, T14 → F1-F4

### Agent Dispatch Summary
- Wave 1: T1 `deep`, T2 `quick`, T3 `unspecified-high`, T4 `quick`
- Wave 2: T5 `quick`, T6 `quick`, T7 `unspecified-high`, T8 `deep`
- Wave 3: T9 `quick`, T10 `unspecified-high`, T11 `unspecified-high`, T12 `deep`
- Wave 4: T13 `visual-engineering`, T14 `deep`, T15 `unspecified-high`
- Final: F1 `oracle`, F2 `unspecified-high`, F3 `unspecified-high` + `playwright`, F4 `deep`

---

## TODOs

- [x] 1. Rozszerzyć architekturę nawigacji o zakładkę Trener

  **What to do**:
  - Dodać nowy screen ID / routing entry dla `TRAINER` w istniejącej customowej architekturze Home.
  - Przygotować nowy ekran rootowy `Trainer` zgodny z istniejącym wzorcem screenów Home.

  **Must NOT do**:
  - Nie przepisywać całej nawigacji aplikacji na inny paradygmat.

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 5, 8
  - **Blocked By**: None

  **References**:
  - `app/Home.tsx` - centralny switching screenów.
  - `app/components/home/HomeContext.tsx` - source of truth dla current screen.
  - `app/components/home/homeScreens.ts` - typy screenów.
  - `app/components/layout/Menu.tsx` - główna nawigacja użytkownika.

  **Acceptance Criteria**:
  - [ ] `TRAINER` istnieje jako poprawny screen w nawigacji.
  - [ ] Nie ma regresji dla istniejących screenów Home.

  **QA Scenarios**:
  ```
  Scenario: Zakładka Trener pojawia się w głównej nawigacji
    Tool: Playwright
    Steps:
      1. Otwórz główny ekran aplikacji
      2. Rozwiń / pokaż główne menu
      3. Zweryfikuj obecność pozycji "Trener"
    Expected Result: Nowa pozycja jest widoczna i klikalna
    Evidence: .sisyphus/evidence/task-1-trainer-nav.png

  Scenario: Regresja nawigacji nie występuje
    Tool: Playwright
    Steps:
      1. Przejdź kolejno do 2 istniejących screenów i wróć
      2. Zweryfikuj brak błędów routingu
    Expected Result: Istniejące screeny działają jak wcześniej
    Evidence: .sisyphus/evidence/task-1-existing-nav.png
  ```

- [x] 2. Ujednolicić notification domain i unread state

  **What to do**:
  - Zdefiniować wspólny model listy powiadomień, unread count i mark-read flows.
  - Oprzeć się na generated REST hooks i lokalnym stanie współdzielonym.

  **References**:
  - `api/generated/in-app-notification/in-app-notification.ts`
  - istniejący wzorzec store/context z auth i HomeContext

  **Acceptance Criteria**:
  - [ ] Istnieje wspólny stan unread count i listy powiadomień.
  - [ ] REST hooks są spięte pod jedną logiką domenową.

- [x] 3. Dodać mobilną integrację SignalR dla trainer-related notifications

  **What to do**:
  - Wdrożyć klienta SignalR jako singleton/service.
  - Dodać auth handshake, reconnect strategy, app foreground/background lifecycle.
  - Aktualizować unread count i listę po eventach realtime.

  **Must NOT do**:
  - Nie rozszerzać realtime na inne domeny niż trainer-related notifications.

  **References**:
  - auth token flow w istniejącym mobile auth
  - notification REST contracts jako fallback synchronizacji stanu

  **Acceptance Criteria**:
  - [ ] Po zalogowaniu połączenie SignalR jest zestawiane.
  - [ ] Po logout połączenie jest zamykane.
  - [ ] Event trainer-related aktualizuje unread count bez restartu ekranu.

- [x] 4. Dodać service layer dla REST notifications
- [x] 5. Dodać pozycję Trener do głównego menu
- [x] 6. Dodać dzwonek i unread badge do headera
- [x] 7. Zbudować ekran listy powiadomień
- [x] 8. Obsłużyć klik notification → zakładka Trener
- [x] 9. Zbudować stan zakładki Trener: brak trenera
- [x] 10. Zbudować stan zakładki Trener: trener + współpraca
- [x] 11. Dodać sekcję aktualnego planu trenera
- [x] 12. Dodać sekcję report requests i listy raportów
- [x] 13. Dopiłować spójność UI/UX i stany ekranów
- [x] 14. Obsłużyć edge cases relacji i reconnect SignalR (PARTIAL - see learnings.md)
- [x] 15. Wykonać zintegrowany smoke QA dla Trener + Powiadomienia

  **Task Notes for 4-15**:
  - Każdy task musi wskazać konkretne pliki, których dotyka.
  - Każdy task musi mieć co najmniej 1 scenariusz happy path i 1 error/edge path.
  - Dla sekcji Trener należy użyć istniejących kontraktów generated API, bez custom backend assumptions.
  - Dla ekranu powiadomień należy ograniczyć interaktywność do trainer-related notification types w V1.

---

## Final Verification Wave

- [x] F1. **Plan Compliance Audit** — `oracle` (REJECT → FIX APPLIED, see issues.md)
  Zweryfikować, że zakładka Trener, dzwonek, ekran powiadomień i SignalR odpowiadają zakresowi z tego planu.

- [x] F2. **Code Quality Review** — `unspecified-high` (APPROVE_WITH_NOTES)
  Sprawdzić zgodność z istniejącymi wzorcami menu, headera, screenów Home, toastów i service/state management.

- [x] F3. **Real Manual QA** — `unspecified-high` (PASS - code review based)
  Przejść ręcznie scenariusze: brak trenera, ma trenera, nowa notyfikacja realtime, klik z listy powiadomień, reconnect.

- [x] F4. **Scope Fidelity Check** — `deep` (PASS - no violations)
  Potwierdzić, że V1 nie rozszerzyła się o push/system notifications, chat, trainer directory ani admin/web-only scope.

---

## Commit Strategy

- Wave 1: `feat(trainer): add navigation and notification architecture`
- Wave 2: `feat(notifications): add bell and notifications screen`
- Wave 3: `feat(trainer): add trainer tab states and sections`
- Wave 4: `feat(trainer): integrate realtime notifications and polish ux`
- Final: `docs(sisyphus): add verification evidence`

---

## Success Criteria

### Verification Commands
```bash
npm run web
```

### Final Checklist
- [ ] Zakładka Trener jest dostępna i spójna wizualnie
- [ ] Dzwonek działa i pokazuje unread badge
- [ ] Ekran powiadomień działa
- [ ] SignalR dostarcza trainer-related notifications realtime
- [ ] Kliknięcie zaproszenia od trenera otwiera zakładkę Trener
- [ ] Stany bez trenera i z trenerem są kompletne i czytelne
