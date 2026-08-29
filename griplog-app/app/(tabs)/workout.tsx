import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Activity, Plus, Check, Trash2, Dumbbell } from 'lucide-react-native';

import ExercisePickerSheet from '../../components/ExercisePickerSheet';
import RestTimer from '../../components/RestTimer';
import { createExercise, createSession, createSet } from '../../services/database';

type SetRow = {
  id: string;
  setNumber: number;
  weight: string;
  reps: string;
  rpe: string;
  completed: boolean;
};

type ExerciseEntry = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: SetRow[];
};

export default function WorkoutScreen() {
  const [exercisePickerOpen, setExercisePickerOpen] = useState(false);
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);

  const totalVolume = useMemo(
    () =>
      exercises.reduce(
        (sum, exercise) =>
          sum +
          exercise.sets.reduce((acc, set) => {
            const weight = Number(set.weight || 0);
            const reps = Number(set.reps || 0);
            return acc + weight * reps;
          }, 0),
        0,
      ),
    [exercises],
  );

  const addExercise = (item: { id: string; name: string; muscle_group: string }) => {
    setExercises((current) => [
      ...current,
      {
        id: item.id,
        name: item.name,
        muscleGroup: item.muscle_group,
        sets: [{ id: `${item.id}-1`, setNumber: 1, weight: '0', reps: '0', rpe: '8', completed: false }],
      },
    ]);
  };

  const addSet = (exerciseId: string) => {
    setExercises((current) =>
      current.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;

        const nextSetNumber = exercise.sets.length + 1;
        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              id: `${exerciseId}-${nextSetNumber}`,
              setNumber: nextSetNumber,
              weight: '0',
              reps: '0',
              rpe: '8',
              completed: false,
            },
          ],
        };
      }),
    );
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises((current) =>
      current.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        const nextSets = exercise.sets.filter((set) => set.id !== setId);
        return {
          ...exercise,
          sets: nextSets.length > 0 ? nextSets : [{ id: `${exerciseId}-1`, setNumber: 1, weight: '0', reps: '0', rpe: '8', completed: false }],
        };
      }),
    );
  };

  const updateSet = (exerciseId: string, setId: string, field: 'weight' | 'reps' | 'rpe' | 'completed', value: string | boolean) => {
    setExercises((current) =>
      current.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;

        return {
          ...exercise,
          sets: exercise.sets.map((set) => {
            if (set.id !== setId) return set;
            return { ...set, [field]: value };
          }),
        };
      }),
    );
  };

  const saveSession = async () => {
    const userId = 'demo-user';
    const sessionId = await createSession({
      id: `session-${Date.now()}`,
      user_id: userId,
      template_id: null,
      started_at: new Date().toISOString(),
      ended_at: null,
      duration_seconds: 0,
      total_volume_kg: totalVolume,
      is_completed: 1,
      is_synced: 0,
      is_deleted: 0,
    } as any);

    for (const exercise of exercises) {
      const exerciseId = await createExercise({
        id: `${sessionId}-${exercise.id}`,
        user_id: userId,
        session_id: sessionId,
        name: exercise.name,
        muscle_group: exercise.muscleGroup,
        sort_order: 0,
        is_synced: 0,
        is_deleted: 0,
      });

      for (const set of exercise.sets) {
        await createSet({
          id: `${exerciseId}-${set.setNumber}`,
          user_id: userId,
          exercise_id: exerciseId,
          set_number: set.setNumber,
          weight_kg: Number(set.weight || 0),
          reps: Number(set.reps || 0),
          rpe: Number(set.rpe || 0),
          is_completed: set.completed ? 1 : 0,
          is_synced: 0,
          is_deleted: 0,
        });
      }
    }
  };

  return (
    <View className="flex-1 bg-slate-950 px-5 pb-32 pt-12">
      <View className="mb-6">
        <Text className="mb-1 text-[11px] font-bold uppercase tracking-[3px] text-amber-500">Live Workout</Text>
        <Text className="text-4xl font-black tracking-tight text-white">Sessione</Text>
      </View>

      <View className="mb-6 rounded-[32px] border border-white/5 bg-[#0B1220] p-6 shadow-2xl">
        <View className="flex-row items-center justify-between">
          <View>
            <View className="mb-1 flex-row items-center gap-2">
              <View className="rounded-full bg-amber-500/10 p-1.5">
                <Activity size={14} color="#f59e0b" />
              </View>
              <Text className="text-xs font-bold uppercase tracking-[1px] text-slate-400">Volume totale</Text>
            </View>
            <Text className="text-4xl font-black tabular-nums tracking-tight text-white">
              {totalVolume.toFixed(0)}
              <Text className="text-xl font-bold text-slate-500"> kg</Text>
            </Text>
          </View>
          <Pressable onPress={() => setExercisePickerOpen(true)} className="flex-row items-center gap-2 rounded-2xl bg-amber-500 px-4 py-3.5 shadow-sm active:opacity-80">
            <Plus size={18} color="#020617" />
            <Text className="font-bold text-slate-950">Esercizio</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {exercises.map((exercise) => (
          <View key={exercise.id} className="mb-6 overflow-hidden rounded-[32px] border border-white/5 bg-[#0B1220] shadow-lg">
            <View className="flex-row items-center justify-between border-b border-slate-800/50 bg-[#0f172a]/50 p-5">
              <View>
                <Text className="text-xl font-bold text-white">{exercise.name}</Text>
                <Text className="mt-1 text-sm font-medium text-slate-400">{exercise.muscleGroup}</Text>
              </View>
              <View className="rounded-full border border-slate-700/50 bg-slate-800/80 px-3 py-1.5">
                <Text className="text-xs font-bold text-slate-300">{exercise.sets.length} SET</Text>
              </View>
            </View>

            <View className="p-5">
              {exercise.sets.map((set) => (
                <View key={set.id} className="mb-4 rounded-2xl border border-slate-800/60 bg-[#0f172a] p-4">
                  <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-sm font-bold text-slate-300">Serie {set.setNumber}</Text>
                    <Pressable
                      onPress={() => updateSet(exercise.id, set.id, 'completed', !set.completed)}
                      className={`flex-row items-center gap-1.5 rounded-full px-3 py-1.5 ${set.completed ? 'bg-emerald-500/20' : 'bg-slate-800'}`}
                    >
                      {set.completed && <Check size={12} color="#34d399" />}
                      <Text className={`text-[10px] font-bold uppercase tracking-[1px] ${set.completed ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {set.completed ? 'Completata' : 'Da fare'}
                      </Text>
                    </Pressable>
                  </View>

                  <View className="flex-row">
                    <View className="mr-3 flex-1">
                      <Text className="mb-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">Peso (kg)</Text>
                      <TextInput
                        className="rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-lg font-bold tabular-nums text-white"
                        keyboardType="numeric"
                        value={set.weight}
                        onChangeText={(value) => updateSet(exercise.id, set.id, 'weight', value)}
                      />
                    </View>
                    <View className="mr-3 flex-1">
                      <Text className="mb-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">Reps</Text>
                      <TextInput
                        className="rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-lg font-bold tabular-nums text-white"
                        keyboardType="numeric"
                        value={set.reps}
                        onChangeText={(value) => updateSet(exercise.id, set.id, 'reps', value)}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">RPE</Text>
                      <TextInput
                        className="rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-lg font-bold tabular-nums text-white"
                        keyboardType="numeric"
                        value={set.rpe}
                        onChangeText={(value) => updateSet(exercise.id, set.id, 'rpe', value)}
                      />
                    </View>
                  </View>

                  <Pressable onPress={() => removeSet(exercise.id, set.id)} className="mt-5 flex-row items-center justify-end gap-1.5">
                    <Trash2 size={14} color="#f87171" />
                    <Text className="text-xs font-semibold text-red-400">Rimuovi serie</Text>
                  </Pressable>
                </View>
              ))}

              <Pressable onPress={() => addSet(exercise.id)} className="mt-2 flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700/60 bg-slate-800/20 py-4 active:bg-slate-800/40">
                <Plus size={16} color="#94a3b8" />
                <Text className="font-bold text-slate-300">Aggiungi serie</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {exercises.length === 0 && (
          <View className="mt-8 items-center justify-center rounded-[32px] border border-dashed border-slate-800 p-10">
            <View className="mb-4 rounded-full bg-slate-900 p-4">
              <Dumbbell size={32} color="#334155" />
            </View>
            <Text className="text-center text-lg font-bold text-slate-400">Inizia l'allenamento</Text>
            <Text className="mt-2 text-center text-sm font-medium text-slate-500">Aggiungi il tuo primo esercizio premendo il pulsante in alto.</Text>
          </View>
        )}
      </ScrollView>

      <Pressable onPress={saveSession} className="absolute bottom-6 left-5 right-5 flex-row items-center justify-center gap-2 rounded-[24px] bg-emerald-500 py-4 shadow-lg active:opacity-80">
        <Check size={20} color="#020617" />
        <Text className="text-lg font-bold text-slate-950">Termina Allenamento</Text>
      </Pressable>

      <ExercisePickerSheet visible={exercisePickerOpen} onClose={() => setExercisePickerOpen(false)} onSelect={addExercise} />
      <RestTimer />
    </View>
  );
}
