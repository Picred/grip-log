export type SyncRecord = {
  id: string;
  user_id: string;
  is_synced: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
};

export type WorkoutSessionRecord = SyncRecord & {
  template_id?: string | null;
  started_at: string;
  ended_at?: string | null;
  duration_seconds: number;
  total_volume_kg: number;
  is_completed: number;
};

export type WorkoutExerciseRecord = SyncRecord & {
  session_id?: string | null;
  name: string;
  muscle_group: string;
  sort_order: number;
};

export type WorkoutSetRecord = SyncRecord & {
  exercise_id: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  rpe?: number | null;
  is_completed: number;
};

export type ExerciseCatalogItem = {
  id: string;
  name: string;
  muscle_group: string;
};
