import { Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowRight, CalendarDays, Dumbbell, Flame, TrendingUp, Zap, Clock, ChevronRight } from 'lucide-react-native';

const statCards = [
  { label: 'Set totali', value: '48', icon: Dumbbell, tone: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  { label: 'Volume', value: '2.4k', icon: TrendingUp, tone: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  { label: 'Streak', value: '9d', icon: Flame, tone: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400' },
];

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-950" showsVerticalScrollIndicator={false}>
      <View className="px-5 pb-12 pt-12">
        <View className="mb-8 flex-row items-center justify-between">
          <View>
            <Text className="mb-1 text-[11px] font-bold uppercase tracking-[3px] text-amber-500">GripLog</Text>
            <Text className="text-4xl font-black tracking-tight text-white">Dashboard</Text>
          </View>
          <View className="h-14 w-14 items-center justify-center rounded-[20px] border border-slate-800 bg-[#0B1220] shadow-sm">
            <Zap size={24} color="#fbbf24" fill="#fbbf24" />
          </View>
        </View>

        <View className="mb-8 overflow-hidden rounded-[32px] border border-white/5 bg-[#0B1220] shadow-2xl">
          {/* Top subtle highlight */}
          <View className="h-1 w-full bg-amber-500 opacity-80" />
          
          <View className="p-6">
            <View className="mb-2 flex-row items-center gap-2">
              <CalendarDays size={14} color="#94a3b8" />
              <Text className="text-xs font-bold uppercase tracking-[2px] text-slate-400">Oggi</Text>
            </View>
            <Text className="mb-2 text-4xl font-black tracking-tight text-white">Upper Body</Text>
            <Text className="mb-6 text-base font-medium text-slate-400">Piattaforma pulita, focus su forza e recupero muscolare.</Text>

            <View className="flex-row items-center justify-between rounded-3xl border border-slate-800/60 bg-[#0f172a] p-3">
              <View className="flex-row items-center gap-3 pl-2">
                <View className="rounded-full bg-slate-800 p-2">
                  <Clock size={16} color="#94a3b8" />
                </View>
                <View>
                  <Text className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">Prossimo step</Text>
                  <Text className="text-sm font-bold text-white">5 esercizi</Text>
                </View>
              </View>
              <Pressable className="flex-row items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 shadow-sm active:opacity-80">
                <Text className="font-bold text-slate-950">Inizia</Text>
                <ArrowRight size={16} color="#020617" />
              </Pressable>
            </View>
          </View>
        </View>

        <View className="mb-8 flex-row gap-3">
          {statCards.map(({ label, value, icon: Icon, tone, border, text }) => (
            <View key={label} className="flex-1 rounded-[28px] border border-white/5 bg-[#0B1220] p-5 shadow-lg">
              <View className={`mb-4 h-12 w-12 items-center justify-center rounded-2xl border ${tone} ${border}`}>
                <Icon size={20} color={text.includes('amber') ? '#fbbf24' : text.includes('emerald') ? '#34d399' : '#fb7185'} />
              </View>
              <Text className="text-3xl font-black tracking-tight text-white">{value}</Text>
              <Text className="mt-1 text-[10px] font-bold uppercase tracking-[1px] text-slate-400">{label}</Text>
            </View>
          ))}
        </View>

        <View className="mb-8 rounded-[32px] border border-white/5 bg-[#0B1220] p-6 shadow-xl">
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-xl font-black tracking-tight text-white">Azioni rapide</Text>
            <View className="rounded-full bg-slate-800/50 p-2">
              <Zap size={16} color="#a1a1aa" />
            </View>
          </View>

          <View className="flex-row gap-3">
            <Pressable className="flex-1 rounded-3xl border border-slate-800/60 bg-[#0f172a] p-5 active:bg-slate-800/80">
              <View className="mb-3 rounded-full bg-slate-800 p-2.5 self-start">
                <Dumbbell size={16} color="#e2e8f0" />
              </View>
              <Text className="text-xs font-bold text-slate-400">Allenamento</Text>
              <Text className="mt-1 text-lg font-bold text-white">Nuova</Text>
            </Pressable>
            <Pressable className="flex-1 rounded-3xl border border-slate-800/60 bg-[#0f172a] p-5 active:bg-slate-800/80">
              <View className="mb-3 rounded-full bg-slate-800 p-2.5 self-start">
                <CalendarDays size={16} color="#e2e8f0" />
              </View>
              <Text className="text-xs font-bold text-slate-400">Storico</Text>
              <Text className="mt-1 text-lg font-bold text-white">Ultimi 7 gg</Text>
            </Pressable>
          </View>
        </View>

        <View className="rounded-[32px] border border-white/5 bg-[#0B1220] p-6 shadow-xl">
          <Text className="mb-5 text-xl font-black tracking-tight text-white">Focus della settimana</Text>
          <View className="space-y-3">
            {['Petto e spalle', 'Squat più profondo', 'Recupero attivo'].map((item, index) => (
              <View key={item} className="mb-3 flex-row items-center justify-between rounded-[24px] border border-slate-800/60 bg-[#0f172a] p-4">
                <View className="flex-row items-center gap-3">
                  <View className={`h-3 w-3 rounded-full ${index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-emerald-400' : 'bg-rose-400'} shadow-sm`} />
                  <Text className="text-base font-bold text-slate-200">{item}</Text>
                </View>
                <ChevronRight size={16} color="#64748b" />
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
