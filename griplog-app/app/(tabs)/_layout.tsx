import { Tabs } from 'expo-router';
import { Dumbbell, History, House, UserRound } from 'lucide-react-native';

const HouseIcon = House as any;
const DumbbellIcon = Dumbbell as any;
const HistoryIcon = History as any;
const UserRoundIcon = UserRound as any;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#a1a1aa',
        tabBarStyle: {
          backgroundColor: '#111827',
          borderTopColor: '#1f2937',
          height: 72,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }: any) => <HouseIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color, size }: any) => <DumbbellIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }: any) => <HistoryIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }: any) => <UserRoundIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
