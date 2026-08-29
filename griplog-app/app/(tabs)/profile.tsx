import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { UserCircle2, Wifi, WifiOff, RefreshCcw, LogOut, Settings2, Palette } from 'lucide-react-native';

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
    <View className="flex-1 bg-slate-950 px-5 pb-32 pt-12">
      <View className="mb-8">
        <Text className="mb-1 text-[11px] font-bold uppercase tracking-[3px] text-amber-500">Profile</Text>
        <Text className="text-4xl font-black tracking-tight text-white">Impostazioni</Text>
      </View>

      <View className="mb-8 flex-row items-center gap-4 rounded-[32px] border border-white/5 bg-[#0B1220] p-6 shadow-2xl">
        <View className="rounded-full bg-slate-800 p-3">
          <UserCircle2 size={40} color="#f8fafc" />
        </View>
        <View>
          <Text className="text-xs font-bold uppercase tracking-[2px] text-slate-400">Account</Text>
          <Text className="text-xl font-bold text-white">{session.email || 'GripLog User'}</Text>
        </View>
      </View>

      <View className="mb-8 flex-row gap-3">
        <View className="flex-1 rounded-[28px] border border-white/5 bg-[#0B1220] p-5 shadow-lg">
          <View className="mb-3 flex-row items-center gap-2">
            {syncStatus === 'online' ? (
              <Wifi size={16} color="#34d399" />
            ) : syncStatus === 'syncing' ? (
              <RefreshCcw size={16} color="#fbbf24" />
            ) : (
              <WifiOff size={16} color="#f87171" />
            )}
            <Text className="text-xs font-bold uppercase tracking-[1px] text-slate-400">Rete</Text>
          </View>
          <Text className={`text-2xl font-black tracking-tight ${syncStatus === 'online' ? 'text-emerald-400' : syncStatus === 'syncing' ? 'text-amber-400' : 'text-red-400'}`}>
            {syncStatus === 'online' ? 'Online' : syncStatus === 'syncing' ? 'Sync...' : 'Offline'}
          </Text>
        </View>

        <View className="flex-1 rounded-[28px] border border-white/5 bg-[#0B1220] p-5 shadow-lg">
          <View className="mb-3 flex-row items-center gap-2">
            <RefreshCcw size={16} color="#94a3b8" />
            <Text className="text-xs font-bold uppercase tracking-[1px] text-slate-400">Pendenti</Text>
          </View>
          <Text className="text-2xl font-black tracking-tight text-white">{pendingCount}</Text>
        </View>
      </View>

      <View className="mb-8 rounded-[32px] border border-white/5 bg-[#0B1220] p-6 shadow-xl">
        <View className="mb-5 flex-row items-center gap-2">
          <Settings2 size={20} color="#f8fafc" />
          <Text className="text-xl font-black tracking-tight text-white">Preferenze</Text>
        </View>
        <View className="flex-row items-center justify-between rounded-[24px] border border-slate-800/60 bg-[#0f172a] p-4">
          <View className="flex-row items-center gap-3">
            <View className="rounded-full bg-slate-800 p-2">
              <Palette size={16} color="#94a3b8" />
            </View>
            <Text className="text-base font-bold text-slate-200">Tema</Text>
          </View>
          <Text className="text-sm font-bold text-amber-500">Dark Minimal</Text>
        </View>
      </View>

      <View className="gap-3">
        <Pressable onPress={handleSyncNow} className="flex-row items-center justify-center gap-2 rounded-2xl bg-amber-500 p-4 active:opacity-80">
          <RefreshCcw size={18} color="#020617" />
          <Text className="text-center text-base font-bold text-slate-950">Forza Sincronizzazione</Text>
        </Pressable>

        <Pressable onPress={() => void signOut()} className="flex-row items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 active:bg-red-500/20">
          <LogOut size={18} color="#fca5a5" />
          <Text className="text-center text-base font-bold text-red-400">Disconnetti</Text>
        </Pressable>
      </View>
    </View>
  );
}
