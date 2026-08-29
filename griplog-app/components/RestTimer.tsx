import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, Vibration, View } from 'react-native';

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
    <View className="absolute bottom-24 right-4 w-52 rounded-2xl border border-orange-500/50 bg-slate-900/95 p-3 shadow-lg">
      <Text className="mb-2 text-xs uppercase tracking-[2px] text-slate-400">Rest timer</Text>
      <Text className="mb-2 text-3xl font-bold text-white">{label}</Text>

      <View className="mb-2 flex-row flex-wrap gap-1">
        {REST_OPTIONS.map((option) => (
          <Pressable
            key={option}
            onPress={() => {
              setSelectedSeconds(option);
              setSecondsLeft(option);
              setRunning(false);
            }}
            className={`rounded-full px-2 py-1 ${selectedSeconds === option ? 'bg-orange-500' : 'bg-slate-700'}`}
          >
            <Text className="text-xs font-semibold text-white">{option}s</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => {
          if (running) {
            setRunning(false);
            return;
          }
          setRunning(true);
        }}
        className="rounded-xl bg-orange-500 p-2"
      >
        <Text className="text-center font-semibold text-white">{running ? 'Pausa' : 'Avvia'}</Text>
      </Pressable>
    </View>
  );
}
