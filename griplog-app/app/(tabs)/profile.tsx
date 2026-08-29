import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAuth } from '../../context/AuthContext';
import { getPendingSyncCount } from '../../services/database';
import { forceSync, getNetworkStatus } from '../../services/syncService';

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline' | 'syncing'>('offline');

  useEffect(() => {
    const load = async () => {
      const count = await getPendingSyncCount();
      setPendingCount(count);
      setSyncStatus(getNetworkStatus());
    };

    void load();
  }, []);

  const handleSyncNow = async () => {
    const status = await forceSync();
    setSyncStatus(status);
    const count = await getPendingSyncCount();
    setPendingCount(count);
  };

  return (
    <View className="flex-1 bg-slate-950 px-4 pb-8 pt-8">
      <Text className="mb-4 text-3xl font-bold text-white">Profilo</Text>

      <View className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <Text className="text-sm text-slate-400">Account</Text>
        <Text className="mt-1 text-xl font-bold text-white">{session.email || 'GripLog User'}</Text>
      </View>

      <View className="mt-4 rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <Text className="text-sm text-slate-400">Stato connessione</Text>
        <Text className={`mt-2 text-xl font-semibold ${syncStatus === 'online' ? 'text-green-400' : syncStatus === 'syncing' ? 'text-orange-400' : 'text-red-400'}`}>
          {syncStatus === 'online' ? 'Online' : syncStatus === 'syncing' ? 'Sincronizzazione...' : 'Offline'}
        </Text>
      </View>

      <View className="mt-4 rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <Text className="text-sm text-slate-400">Record pendenti</Text>
        <Text className="mt-2 text-2xl font-bold text-white">{pendingCount}</Text>
      </View>

      <Pressable onPress={handleSyncNow} className="mt-6 rounded-xl bg-orange-500 p-4">
        <Text className="text-center font-bold text-white">Sincronizza Ora</Text>
      </Pressable>

      <Pressable onPress={() => void signOut()} className="mt-4 rounded-xl border border-red-500 p-4">
        <Text className="text-center font-bold text-red-400">Logout</Text>
      </Pressable>
    </View>
  );
}
