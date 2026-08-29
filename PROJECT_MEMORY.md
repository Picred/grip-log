# Project Memory - GripLog

## Stato attuale
- Il bootstrap iniziale del progetto Expo/TypeScript è stato completato nella cartella `griplog-app`.
- La struttura base del router file-based e delle tab principali è presente: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `index`, `workout`, `history`, `profile`.
- È stato impostato il backend Supabase con client autenticato e storage JWT su `expo-secure-store`.
- È stato creato lo schema SQL iniziale con tabelle e RLS per utenti, workout, esercizi e sets.
- Il layer SQLite locale è stato introdotto con schema mirror, catalogo esercizi standard e logica di sincronizzazione offline-first.
- La UI di workout live, cronologia e profilo sync monitor è stata costruita in modo funzionale.
- Gli Step 2, 3 e 4 sono stati validati con `npx tsc --noEmit` senza errori.

## Architettura target
- App Android mobile per workout tracking offline-first.
- React Native + Expo con TypeScript strict mode.
- Expo Router file-based per navigazione e tab bar.
- Persistenza locale con Expo SQLite.
- Auth Supabase tramite `expo-secure-store`.
- PostgreSQL con Row Level Security rigoroso.
- Worker asincrono `syncService` per sincronizzazione bidirezionale con rilevamento rete via NetInfo.

## Standard adottati
- UI dark e high-contrast, orientata a uso in palestra.
- Input numerico rapido per peso/reps.
- Nessuna operazione CRUD dipendente direttamente dalla rete.
- Tutte le write locali generano record con `is_synced = false` e vengono sincronizzate in background.
- Struttura modulare: `app/`, `components/`, `services/`, `lib/`, `types/`.

## Roadmap
1. Bootstrapping e setup base del progetto (completato nello Step 1).
2. Backend Supabase, auth e schema base (completato nello Step 2).
3. Database locale SQLite e sync engine offline-first (completato nello Step 3).
4. UI live workout, catalogo, timer e storico (completato nello Step 4).
5. Configurazione Android, build e validazione finale.

## Debito tecnico e note
- La UI live workout è pronta per l’uso locale e il salvataggio persistente in SQLite.
- Il timer di recupero è pronto per miglioramenti UX in base al test reale su device.
- La build Android è configurata per distribuire preview e production con EAS.
- La configurazione finale del bundle `com.picred.griplog` è pronta per il deployment mobile.

## Regole operative
- Consultare sempre questo file all'inizio di ogni sessione o cambio di contesto.
- Aggiornare questo file e `CHANGELOG.md` dopo ogni task completato.
- Validare sempre con `tsc --noEmit` per assicurare compatibilità del codice.
