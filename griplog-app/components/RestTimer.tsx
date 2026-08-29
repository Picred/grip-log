import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, Vibration, View } from 'react-native';
import { Timer, Play, Pause } from 'lucide-react-native';

const REST_OPTIONS = [30, 60, 90, 120, 180];

export default function RestTimer() {
  const [selectedSeconds, setSelectedSeconds] = useState(60);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    if (secondsLeft <= 0) {
      Vibration.vibrate([150, 120, 150]);
      setRunning(false);
      setSecondsLeft(selectedSeconds);
      return;
    }

    const timeout = setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [running, secondsLeft, selectedSeconds]);

  const label = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [secondsLeft]);

  return (
    <View className="absolute bottom-24 right-4 w-64 overflow-hidden rounded-[32px] border border-white/5 bg-[#0B1220] shadow-2xl">
      {/* Top accent line */}
      <View className="h-[3px] w-full bg-amber-500 opacity-90" />
      
      <View className="p-5">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="rounded-full bg-amber-500/10 p-1.5">
              <Timer size={14} color="#f59e0b" />
            </View>
            <Text className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Rest Timer</Text>
          </View>
          <Text className="text-3xl font-black tabular-nums tracking-tight text-white">{label}</Text>
        </View>

        {/* Progress bar */}
        <View className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80">
          <View 
            className="h-full rounded-full bg-amber-500" 
            style={{ width: `${(secondsLeft / selectedSeconds) * 100}%` }} 
          />
        </View>

        <View className="mb-5 flex-row flex-wrap justify-between gap-1.5">
          {REST_OPTIONS.map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                setSelectedSeconds(option);
                setSecondsLeft(option);
                setRunning(false);
              }}
              className={`flex-1 min-w-[36px] items-center rounded-xl py-2 border ${
                selectedSeconds === option 
                  ? 'bg-amber-500/10 border-amber-500/50' 
                  : 'bg-slate-800/40 border-slate-700/40'
              }`}
            >
              <Text className={`text-[11px] font-bold ${
                selectedSeconds === option ? 'text-amber-400' : 'text-slate-400'
              }`}>{option}s</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => setRunning(!running)}
          className={`flex-row items-center justify-center gap-2 rounded-2xl py-3.5 shadow-sm active:opacity-80 ${
            running ? 'bg-slate-800 border border-slate-700' : 'bg-amber-500'
          }`}
        >
          {running ? (
            <>
              <Pause size={16} color="#e2e8f0" fill="#e2e8f0" />
              <Text className="text-sm font-bold text-slate-200">Pausa Timer</Text>
            </>
          ) : (
            <>
              <Play size={16} color="#020617" fill="#020617" />
              <Text className="text-sm font-bold text-slate-950">Avvia Timer</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}
