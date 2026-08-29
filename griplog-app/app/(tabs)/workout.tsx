import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

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
    <View className="flex-1 bg-slate-950 px-4 pb-32 pt-8">
      <Text className="mb-4 text-3xl font-bold text-white">Workout</Text>
      <View className="mb-4 flex-row items-center justify-between rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <View>
          <Text className="text-slate-400">Volume totale</Text>
          <Text className="text-2xl font-bold text-orange-400">{totalVolume.toFixed(0)} kg</Text>
        </View>
        <Pressable onPress={() => setExercisePickerOpen(true)} className="rounded-xl bg-orange-500 px-4 py-3">
          <Text className="font-semibold text-white">Aggiungi esercizio</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1">
        {exercises.map((exercise) => (
          <View key={exercise.id} className="mb-4 rounded-2xl border border-slate-700 bg-slate-900 p-4">
            <Text className="text-xl font-bold text-white">{exercise.name}</Text>
            <Text className="mb-3 text-sm text-slate-400">{exercise.muscleGroup}</Text>

            {exercise.sets.map((set) => (
              <View key={set.id} className="mb-3 rounded-xl border border-slate-700 bg-slate-800 p-3">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="font-semibold text-white">Serie {set.setNumber}</Text>
                  <Pressable onPress={() => updateSet(exercise.id, set.id, 'completed', !set.completed)} className={`rounded-full px-2 py-1 ${set.completed ? 'bg-green-500' : 'bg-slate-700'}`}>
                    <Text className="text-xs font-semibold text-white">{set.completed ? 'Completata' : 'Da fare'}</Text>
                  </Pressable>
                </View>

                <View className="flex-row gap-2">
                  <View className="mr-2 flex-1">
                    <Text className="mb-1 text-xs text-slate-400">Peso</Text>
                    <TextInput
                      className="rounded-lg bg-slate-900 p-2 text-white"
                      keyboardType="numeric"
                      value={set.weight}
                      onChangeText={(value) => updateSet(exercise.id, set.id, 'weight', value)}
                    />
                  </View>
                  <View className="mr-2 flex-1">
                    <Text className="mb-1 text-xs text-slate-400">Reps</Text>
                    <TextInput
                      className="rounded-lg bg-slate-900 p-2 text-white"
                      keyboardType="numeric"
                      value={set.reps}
                      onChangeText={(value) => updateSet(exercise.id, set.id, 'reps', value)}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 text-xs text-slate-400">RPE</Text>
                    <TextInput
                      className="rounded-lg bg-slate-900 p-2 text-white"
                      keyboardType="numeric"
                      value={set.rpe}
                      onChangeText={(value) => updateSet(exercise.id, set.id, 'rpe', value)}
                    />
                  </View>
                </View>

                <Pressable onPress={() => removeSet(exercise.id, set.id)} className="mt-2">
                  <Text className="text-right text-red-400">Rimuovi serie</Text>
                </Pressable>
              </View>
            ))}

            <Pressable onPress={() => addSet(exercise.id)} className="rounded-xl bg-slate-700 p-3">
              <Text className="text-center font-semibold text-white">+ Aggiungi serie</Text>
            </Pressable>
          </View>
        ))}

        {exercises.length === 0 && (
          <View className="rounded-2xl border border-dashed border-slate-600 p-8">
            <Text className="text-center text-slate-400">Nessun esercizio aggiunto. Inizia con una selezione dal catalogo.</Text>
          </View>
        )}
      </ScrollView>

      <Pressable onPress={saveSession} className="mt-4 rounded-xl bg-green-500 p-4">
        <Text className="text-center text-lg font-bold text-white">Termina Allenamento</Text>
      </Pressable>

      <ExercisePickerSheet visible={exercisePickerOpen} onClose={() => setExercisePickerOpen(false)} onSelect={addExercise} />
      <RestTimer />
    </View>
  );
}
