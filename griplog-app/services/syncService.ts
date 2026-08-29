import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

import { supabase } from '../lib/supabase';
import { getPendingSyncRecords, getPendingSyncCount, markRecordSynced } from './database';

export type SyncStatus = 'online' | 'offline' | 'syncing';

let networkState: NetInfoState | null = null;
let currentStatus: SyncStatus = 'offline';

export const getNetworkStatus = () => currentStatus;

export const initializeSyncListener = () => {
  NetInfo.addEventListener((state) => {
    networkState = state;
    currentStatus = state.isConnected ? 'online' : 'offline';

    if (state.isConnected) {
      void syncPendingRecords();
    }
  });
};

export const syncPendingRecords = async () => {
  if (!networkState?.isConnected) {
    currentStatus = 'offline';
    return;
  }

  currentStatus = 'syncing';

  const { sessions, exercises, sets } = await getPendingSyncRecords();

  for (const session of sessions) {
    const payload = {
      id: session.id,
      user_id: session.user_id,
      template_id: session.template_id,
      started_at: session.started_at,
      ended_at: session.ended_at,
      duration_seconds: session.duration_seconds,
      total_volume_kg: session.total_volume_kg,
      is_completed: Boolean(session.is_completed),
      is_synced: true,
      is_deleted: Boolean(session.is_deleted),
      created_at: session.created_at,
      updated_at: session.updated_at,
    };

    const { error } = await supabase.from('workout_sessions').upsert(payload, { onConflict: 'id' });
    if (!error) {
      await markRecordSynced('workout_sessions', session.id);
    }
  }

  for (const exercise of exercises) {
    const payload = {
      id: exercise.id,
      user_id: exercise.user_id,
      session_id: exercise.session_id,
      name: exercise.name,
      muscle_group: exercise.muscle_group,
      sort_order: exercise.sort_order,
      is_synced: true,
      is_deleted: Boolean(exercise.is_deleted),
      created_at: exercise.created_at,
      updated_at: exercise.updated_at,
    };

    const { error } = await supabase.from('exercises').upsert(payload, { onConflict: 'id' });
    if (!error) {
      await markRecordSynced('exercises', exercise.id);
    }
  }

  for (const set of sets) {
    const payload = {
      id: set.id,
      user_id: set.user_id,
      exercise_id: set.exercise_id,
      set_number: set.set_number,
      weight_kg: set.weight_kg,
      reps: set.reps,
      rpe: set.rpe,
      is_completed: Boolean(set.is_completed),
      is_synced: true,
      is_deleted: Boolean(set.is_deleted),
      created_at: set.created_at,
      updated_at: set.updated_at,
    };

    const { error } = await supabase.from('sets').upsert(payload, { onConflict: 'id' });
    if (!error) {
      await markRecordSynced('sets', set.id);
    }
  }

  const pendingCount = await getPendingSyncCount();
  currentStatus = pendingCount > 0 && networkState?.isConnected ? 'syncing' : 'online';
};

export const forceSync = async () => {
  await syncPendingRecords();
  return getNetworkStatus();
};
