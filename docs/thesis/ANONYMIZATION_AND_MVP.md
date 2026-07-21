# Wariant demonstracyjny aplikacji mobilnej do pracy inżynierskiej

## Przeznaczenie

Gałąź `thesis/anonymized-ui` stanowi neutralny wariant aplikacji przeznaczony do prezentacji oraz dołączenia jako część systemu w pracy inżynierskiej. Zachowano logikę domenową i integrację z API, natomiast zmieniono publiczną nazwę, znak graficzny oraz charakterystyczną paletę interfejsu.

Robocza nazwa **Training Hub** ma charakter opisowy i nie jest nową marką handlową.

## Dostarczany zakres MVP

Wariant demonstracyjny obejmuje w szczególności:

- logowanie i rejestrację użytkownika,
- wybór planu, dnia treningowego i siłowni,
- aktywny zapis serii treningowych,
- prezentowanie ostatnich wyników ćwiczenia z opcjonalnym filtrem siłowni,
- zapis treningu i podsumowanie uzyskanych punktów,
- historię treningów i rekordów,
- pomiary antropometryczne,
- podstawowe elementy relacji trener–podopieczny.

## Zmiany identyfikacji wizualnej

- dodano wektorowy komponent `app/components/branding/BrandMark.tsx`,
- ekran startowy, logowanie, rejestracja, nagłówek, ekran ładowania i komunikat aktualizacji korzystają z neutralnego znaku,
- paletę czarno-zieloną zastąpiono paletą granatowo-turkusową,
- nazwa wyświetlana przez Expo została zmieniona na `Training Hub`,
- splash nie odwołuje się do oryginalnego pliku logo.

## Identyfikatory techniczne

Identyfikatory pakietów Android/iOS oraz konfiguracja usług powiadomień zostały zachowane, ponieważ ich zmiana wymaga utworzenia oddzielnych aplikacji w Firebase i ponownego podpisania buildów. Nie należy przywoływać tych identyfikatorów w treści pracy ani na zrzutach ekranu. Przed publicznym przekazaniem pełnego kodu źródłowego zaleca się utworzenie osobnej konfiguracji usług dla wariantu uczelnianego.

## Kontrola przed przekazaniem

1. Uruchomić `npm install` oraz `npm run start`.
2. Zweryfikować ekran startowy, logowanie i rejestrację.
3. Przeprowadzić trening z wybraną siłownią i sprawdzić podgląd ostatnich wyników.
4. Zapisać trening, a następnie sprawdzić historię i pomiary.
5. Wyszukać widoczne wystąpienia dawnej nazwy w aplikacji.
6. Nie dołączać plików z sekretami, konfiguracji produkcyjnych ani historii Git.

## Elementy wyłączone z pierwszej wersji przekazywanej uczelni

W pierwszym pakiecie nie jest konieczne przekazywanie pełnego modułu powiadomień push, konfiguracji EAS Update, planów dietetycznych, raportowania zdjęciowego ani narzędzi operatorskich. Funkcje te mogą zostać opisane jako rozwinięcia systemu, ale nie są wymagane do demonstracji głównego problemu pracy: kontekstowej ewidencji treningowej i współpracy trener–podopieczny.
