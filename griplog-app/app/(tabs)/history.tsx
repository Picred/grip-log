import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { getSessionHistory } from '../../services/database';

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const results = await getSessionHistory('demo-user');
      setSessions(results);
    };

    void load();
  }, []);

  return (
    <View className="flex-1 bg-slate-950 px-4 pb-8 pt-8">
      <Text className="mb-4 text-3xl font-bold text-white">Storico</Text>
      <ScrollView>
        {sessions.length === 0 ? (
          <View className="rounded-2xl border border-dashed border-slate-600 p-8">
            <Text className="text-center text-slate-400">Nessuna sessione completata.</Text>
          </View>
        ) : (
          sessions.map((session) => (
            <View key={session.id} className="mb-3 rounded-2xl border border-slate-700 bg-slate-900 p-4">
              <Text className="text-lg font-bold text-white">{new Date(session.started_at).toLocaleDateString()}</Text>
              <Text className="text-sm text-slate-400">{new Date(session.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              <View className="mt-3 flex-row justify-between">
                <Text className="text-slate-300">Durata</Text>
                <Text className="font-semibold text-white">{session.duration_seconds || 0}s</Text>
              </View>
              <View className="mt-2 flex-row justify-between">
                <Text className="text-slate-300">Volume</Text>
                <Text className="font-semibold text-white">{Number(session.total_volume_kg || 0).toFixed(0)} kg</Text>
              </View>
              <View className="mt-2 flex-row justify-between">
                <Text className="text-slate-300">Stato</Text>
                <Text className="font-semibold text-green-400">Completata</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
