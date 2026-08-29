import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-950">
      <Text className="text-2xl font-bold text-white">GripLog</Text>
      <Text className="mt-2 text-sm text-slate-400">Dashboard e allenamenti</Text>
    </View>
  );
}
