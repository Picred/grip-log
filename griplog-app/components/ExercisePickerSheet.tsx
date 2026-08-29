import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Search, X, ChevronRight } from 'lucide-react-native';

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
      <View className="flex-1 justify-end bg-slate-950/80 backdrop-blur-sm">
        <View className="rounded-t-[40px] border-t border-white/10 bg-[#0B1220] p-6 pb-12 shadow-2xl">
          
          {/* Drag Handle */}
          <View className="mb-6 items-center">
            <View className="h-1.5 w-12 rounded-full bg-slate-800" />
          </View>

          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-2xl font-black tracking-tight text-white">Catalogo</Text>
            <Pressable onPress={onClose} className="rounded-full bg-slate-800/80 p-2 border border-slate-700/50 active:bg-slate-700">
              <X size={20} color="#94a3b8" />
            </Pressable>
          </View>

          <View className="mb-5 flex-row items-center rounded-2xl border border-slate-800 bg-[#0f172a] px-4 py-1">
            <Search size={18} color="#64748b" />
            <TextInput
              className="flex-1 px-3 py-3 text-base text-white"
              placeholder="Cerca esercizio..."
              placeholderTextColor="#64748b"
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')}>
                <X size={16} color="#64748b" />
              </Pressable>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 max-h-[44px]">
            {muscleGroups.map((group) => (
              <Pressable
                key={group}
                onPress={() => setMuscleFilter(group)}
                className={`mr-2 items-center justify-center rounded-full px-5 py-2.5 border ${
                  muscleFilter === group 
                    ? 'bg-amber-500/10 border-amber-500/50' 
                    : 'bg-slate-800/40 border-slate-700/40'
                }`}
              >
                <Text className={`text-sm font-bold tracking-[0.5px] ${
                  muscleFilter === group ? 'text-amber-400' : 'text-slate-400'
                }`}>{group}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <ScrollView className="max-h-[400px]" showsVerticalScrollIndicator={false}>
            {filtered.map((exercise) => (
              <Pressable
                key={exercise.id}
                onPress={() => {
                  onSelect(exercise);
                  onClose();
                }}
                className="mb-3 flex-row items-center justify-between rounded-[24px] border border-slate-800/60 bg-[#0f172a] p-4 active:bg-slate-800/80"
              >
                <View>
                  <Text className="text-lg font-bold text-white">{exercise.name}</Text>
                  <Text className="mt-1 text-xs font-semibold uppercase tracking-[1px] text-slate-500">{exercise.muscle_group}</Text>
                </View>
                <View className="rounded-full bg-slate-800 p-2">
                  <ChevronRight size={16} color="#94a3b8" />
                </View>
              </Pressable>
            ))}

            {filtered.length === 0 && (
              <View className="mt-10 items-center justify-center">
                <Search size={32} color="#334155" />
                <Text className="mt-4 text-center text-lg font-bold text-slate-400">Nessun risultato</Text>
                <Text className="mt-1 text-center text-sm font-medium text-slate-500">Prova a cercare con un altro termine.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
