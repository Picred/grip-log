import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { getExerciseCatalog } from '../services/database';

export type ExercisePickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: { id: string; name: string; muscle_group: string }) => void;
};

const demoExercises = [
  { id: 'bench-press', name: 'Panca Piana', muscle_group: 'Petto' },
  { id: 'squat', name: 'Squat', muscle_group: 'Gambe' },
  { id: 'deadlift', name: 'Stacco', muscle_group: 'Schiena' },
  { id: 'pull-up', name: 'Trazioni', muscle_group: 'Schiena' },
  { id: 'military-press', name: 'Military Press', muscle_group: 'Spalle' },
  { id: 'bicep-curl', name: 'Curl Bicipiti', muscle_group: 'Bicipiti' },
];

export default function ExercisePickerSheet({ visible, onClose, onSelect }: ExercisePickerSheetProps) {
  const [query, setQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('Tutti');

  const muscleGroups = useMemo(() => ['Tutti', ...new Set(demoExercises.map((exercise) => exercise.muscle_group))], []);

  const filtered = useMemo(() => {
    return demoExercises.filter((exercise) => {
      const matchesQuery = exercise.name.toLowerCase().includes(query.toLowerCase());
      const matchesMuscle = muscleFilter === 'Tutti' || exercise.muscle_group === muscleFilter;
      return matchesQuery && matchesMuscle;
    });
  }, [muscleFilter, query]);

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="rounded-t-3xl bg-slate-900 p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">Seleziona esercizio</Text>
            <Pressable onPress={onClose}>
              <Text className="text-orange-400">Chiudi</Text>
            </Pressable>
          </View>

          <TextInput
            className="mb-4 rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
            placeholder="Cerca esercizio"
            value={query}
            onChangeText={setQuery}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {muscleGroups.map((group) => (
              <Pressable
                key={group}
                onPress={() => setMuscleFilter(group)}
                className={`mr-2 rounded-full px-3 py-2 ${muscleFilter === group ? 'bg-orange-500' : 'bg-slate-700'}`}
              >
                <Text className="text-sm text-white">{group}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <ScrollView className="max-h-80">
            {filtered.map((exercise) => (
              <Pressable
                key={exercise.id}
                onPress={() => {
                  onSelect(exercise);
                  onClose();
                }}
                className="mb-2 rounded-xl border border-slate-700 bg-slate-800 p-3"
              >
                <Text className="font-semibold text-white">{exercise.name}</Text>
                <Text className="text-sm text-slate-400">{exercise.muscle_group}</Text>
              </Pressable>
            ))}

            {filtered.length === 0 && (
              <Text className="text-center text-slate-400">Nessun esercizio trovato.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
