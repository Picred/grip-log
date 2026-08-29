import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Calendar, Clock, Activity, CheckCircle2 } from 'lucide-react-native';

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
    <View className="flex-1 bg-slate-950 px-5 pb-32 pt-12">
      <View className="mb-8">
        <Text className="mb-1 text-[11px] font-bold uppercase tracking-[3px] text-amber-500">History</Text>
        <Text className="text-4xl font-black tracking-tight text-white">Allenamenti</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {sessions.length === 0 ? (
          <View className="mt-8 items-center justify-center rounded-[32px] border border-dashed border-slate-800 p-10">
            <View className="mb-4 rounded-full bg-slate-900 p-4">
              <Calendar size={32} color="#334155" />
            </View>
            <Text className="text-center text-lg font-bold text-slate-400">Nessuna sessione completata.</Text>
            <Text className="mt-2 text-center text-sm font-medium text-slate-500">Il tuo storico apparirà qui.</Text>
          </View>
        ) : (
          sessions.map((session) => (
            <View key={session.id} className="mb-6 overflow-hidden rounded-[32px] border border-white/5 bg-[#0B1220] shadow-lg">
              <View className="flex-row items-center justify-between border-b border-slate-800/50 bg-[#0f172a]/50 p-5">
                <View>
                  <Text className="text-xl font-bold text-white">{new Date(session.started_at).toLocaleDateString()}</Text>
                  <Text className="mt-1 text-xs font-semibold text-slate-400">{new Date(session.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <View className="flex-row items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                  <CheckCircle2 size={12} color="#34d399" />
                  <Text className="text-[10px] font-bold uppercase tracking-[1px] text-emerald-400">Completata</Text>
                </View>
              </View>

              <View className="flex-row divide-x divide-slate-800/50 p-5">
                <View className="flex-1 items-center">
                  <View className="mb-2 rounded-full bg-slate-800/50 p-2">
                    <Clock size={16} color="#94a3b8" />
                  </View>
                  <Text className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">Durata</Text>
                  <Text className="mt-1 text-lg font-bold text-white">{session.duration_seconds || 0}s</Text>
                </View>
                
                <View className="flex-1 items-center">
                  <View className="mb-2 rounded-full bg-slate-800/50 p-2">
                    <Activity size={16} color="#fbbf24" />
                  </View>
                  <Text className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">Volume</Text>
                  <Text className="mt-1 text-lg font-bold text-amber-400">{Number(session.total_volume_kg || 0).toFixed(0)}<Text className="text-sm font-bold text-slate-500"> kg</Text></Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
