import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { supabase } from '../../lib/supabase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await supabase.auth.signUp({ email, password });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-slate-950 px-6 py-8">
      <View className="rounded-[30px] border border-slate-800 bg-slate-900 p-6 shadow-sm">
        <View className="mb-6 items-center">
          <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
            <Text className="text-2xl">✨</Text>
          </View>
          <Text className="text-3xl font-bold text-white">Crea account</Text>
          <Text className="mt-2 text-sm text-slate-400">Ti aiutiamo a costruire il tuo ritmo.</Text>
        </View>

        <TextInput
          className="mt-4 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          placeholder="Email"
          placeholderTextColor="#64748b"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          className="mt-4 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          placeholder="Password"
          placeholderTextColor="#64748b"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          className="mt-6 rounded-2xl bg-emerald-500 p-4"
          onPress={handleRegister}
          disabled={loading}
        >
          <Text className="text-center text-base font-bold text-slate-950">{loading ? 'Creazione...' : 'Registrati'}</Text>
        </Pressable>

        <Link href="/(auth)/login" asChild>
          <Pressable className="mt-4">
            <Text className="text-center text-sm text-slate-300">
              Hai già un account? <Text className="font-semibold text-emerald-300">Accedi</Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
