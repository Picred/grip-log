# Changelog

Tutte le modifiche rilevanti di GripLog sono documentate qui.

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.0.0/).

## [1.0.0] - 2026-08-29

### Added
- MVP completato di GripLog: tracking allenamenti offline-first con Expo + SQLite + Supabase.
- Setup base di Expo Router con file-based navigation.
- Struttura modulare del progetto: `app/`, `components/`, `services/`, `lib/`, `types/`.
- Tab bar con schermate `index`, `workout`, `history`, `profile`.
- Auth con Supabase e sessione persistente via `expo-secure-store`.
- Schema SQL base con RLS e trigger su `auth.users`.
- Database locale SQLite con catalogo esercizi e sincronizzazione in background.
- UI live workout con picker esercizi, tabella serie, timer recupero e salvataggio sessione locale.
- Storico delle sessioni e profilo con monitor di connessione e sync manuale.
- Configurazione Android/EAS con package `com.picred.griplog` e profili `development`, `preview`, `production`.

### Changed
- Configurazione del progetto per uso Expo Router e dark theme mobile-first.
- Aggiornata la config Expo per identificazione app e package Android finali.
- Aggiornato il piano di lavoro del progetto per includere la release MVP `v1.0.0`.

### Fixed
- Correzione della setup base per il modello di navigazione file-based.
- Installato il polyfill URL necessario per il client Supabase in React Native.
- Normalizzazione della config Android per build EAS e bundle identifier.

### Security
- RLS attivato sulle tabelle principali e auth quota per utenti autenticati.
- JWT persistiti in `expo-secure-store` per la sessione mobile.
