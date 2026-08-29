import type { PlatformOSType } from 'react-native';

import type { ExerciseCatalogItem, WorkoutExerciseRecord, WorkoutSessionRecord, WorkoutSetRecord } from '../types/workout';

const isWeb = (globalThis as any)?.navigator?.product === 'Gecko' || typeof window !== 'undefined';

let db: any = null;

if (!isWeb) {
  // SQLite is only supported on native platforms in this project. Avoid importing it on web,
  // because the Expo web bundle cannot resolve the WASM asset in this environment.
  const SQLite = require('expo-sqlite');
  db = SQLite.openDatabaseSync('griplog.db');
}

const isDbAvailable = () => !!db;

const emptyList = async <T,>() => [] as T[];

export const migrateDatabase = async () => {
  if (!isDbAvailable()) return;

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      email TEXT,
      display_name TEXT,
      avatar_url TEXT,
      is_synced INTEGER NOT NULL DEFAULT 0,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workout_templates (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      is_synced INTEGER NOT NULL DEFAULT 0,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workout_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      template_id TEXT,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      total_volume_kg REAL NOT NULL DEFAULT 0,
      is_completed INTEGER NOT NULL DEFAULT 0,
      is_synced INTEGER NOT NULL DEFAULT 0,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      session_id TEXT,
      name TEXT NOT NULL,
      muscle_group TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_synced INTEGER NOT NULL DEFAULT 0,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      set_number INTEGER NOT NULL DEFAULT 1,
      weight_kg REAL NOT NULL DEFAULT 0,
      reps INTEGER NOT NULL DEFAULT 0,
      rpe REAL,
      is_completed INTEGER NOT NULL DEFAULT 0,
      is_synced INTEGER NOT NULL DEFAULT 0,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS exercise_catalog (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      muscle_group TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const count = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM exercise_catalog');

  if ((count?.count ?? 0) === 0) {
    const exercises: ExerciseCatalogItem[] = [
      { id: 'bench-press', name: 'Panca Piana', muscle_group: 'Petto' },
      { id: 'squat', name: 'Squat', muscle_group: 'Gambe' },
      { id: 'deadlift', name: 'Stacco', muscle_group: 'Schiena' },
      { id: 'pull-up', name: 'Trazioni', muscle_group: 'Schiena' },
      { id: 'military-press', name: 'Military Press', muscle_group: 'Spalle' },
      { id: 'bicep-curl', name: 'Curl Bicipiti', muscle_group: 'Bicipiti' },
      { id: 'lat-pulldown', name: 'Lat Pulldown', muscle_group: 'Schiena' },
      { id: 'leg-press', name: 'Leg Press', muscle_group: 'Gambe' },
      { id: 'overhead-press', name: 'Pressa sopra testa', muscle_group: 'Spalle' },
      { id: 'dips', name: 'Dip', muscle_group: 'Petto' },
    ];

    for (const exercise of exercises) {
      await db.runAsync(
        `INSERT INTO exercise_catalog (id, name, muscle_group) VALUES (?, ?, ?)`,
        [exercise.id, exercise.name, exercise.muscle_group],
      );
    }
  }
};

export const getExerciseCatalog = async () => {
  if (!isDbAvailable()) return emptyList<ExerciseCatalogItem>();
  return db.getAllAsync<ExerciseCatalogItem>('SELECT id, name, muscle_group FROM exercise_catalog ORDER BY name ASC');
};

export const createSession = async (session: Omit<WorkoutSessionRecord, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => {
  if (!isDbAvailable()) return session.id ?? `${Date.now()}`;

  const id = session.id ?? `${Date.now()}`;
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO workout_sessions (
      id, user_id, template_id, started_at, ended_at, duration_seconds, total_volume_kg, is_completed, is_synced, is_deleted, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      session.user_id,
      session.template_id ?? null,
      session.started_at,
      session.ended_at ?? null,
      session.duration_seconds,
      session.total_volume_kg,
      session.is_completed,
      session.is_synced,
      session.is_deleted,
      now,
      now,
    ],
  );

  return id;
};

export const getPendingSyncRecords = async () => {
  if (!isDbAvailable()) return { sessions: [], exercises: [], sets: [] };

  const [sessions, exercises, sets] = await Promise.all([
    db.getAllAsync<WorkoutSessionRecord>(`SELECT * FROM workout_sessions WHERE is_synced = 0 AND is_deleted = 0`),
    db.getAllAsync<WorkoutExerciseRecord>(`SELECT * FROM exercises WHERE is_synced = 0 AND is_deleted = 0`),
    db.getAllAsync<WorkoutSetRecord>(`SELECT * FROM sets WHERE is_synced = 0 AND is_deleted = 0`),
  ]);

  return { sessions, exercises, sets };
};

export const markRecordSynced = async (table: 'workout_sessions' | 'exercises' | 'sets', id: string) => {
  if (!isDbAvailable()) return;
  await db.runAsync(`UPDATE ${table} SET is_synced = 1, updated_at = ? WHERE id = ?`, [new Date().toISOString(), id]);
};

export const createExercise = async (exercise: Omit<WorkoutExerciseRecord, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => {
  if (!isDbAvailable()) return exercise.id ?? `${Date.now()}-${Math.random()}`;

  const id = exercise.id ?? `${Date.now()}-${Math.random()}`;
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO exercises (id, user_id, session_id, name, muscle_group, sort_order, is_synced, is_deleted, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      exercise.user_id,
      exercise.session_id ?? null,
      exercise.name,
      exercise.muscle_group,
      exercise.sort_order,
      exercise.is_synced,
      exercise.is_deleted,
      now,
      now,
    ],
  );

  return id;
};

export const createSet = async (set: Omit<WorkoutSetRecord, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => {
  if (!isDbAvailable()) return set.id ?? `${Date.now()}-${Math.random()}`;

  const id = set.id ?? `${Date.now()}-${Math.random()}`;
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO sets (id, user_id, exercise_id, set_number, weight_kg, reps, rpe, is_completed, is_synced, is_deleted, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      set.user_id,
      set.exercise_id,
      set.set_number,
      set.weight_kg,
      set.reps,
      set.rpe ?? null,
      set.is_completed,
      set.is_synced,
      set.is_deleted,
      now,
      now,
    ],
  );

  return id;
};

export const getSessionHistory = async (userId: string) => {
  if (!isDbAvailable()) return [];
  return db.getAllAsync<any>(
    `SELECT * FROM workout_sessions WHERE user_id = ? AND is_deleted = 0 ORDER BY started_at DESC`,
    [userId],
  );
};

export const getPendingSyncCount = async () => {
  if (!isDbAvailable()) return 0;
  const result = await db.getFirstAsync<{ total: number }>(`
    SELECT (
      (SELECT COUNT(*) FROM workout_sessions WHERE is_synced = 0) +
      (SELECT COUNT(*) FROM exercises WHERE is_synced = 0) +
      (SELECT COUNT(*) FROM sets WHERE is_synced = 0)
    ) AS total
  `);

  return result?.total ?? 0;
};

export const initDatabase = async () => {
  await migrateDatabase();
};
