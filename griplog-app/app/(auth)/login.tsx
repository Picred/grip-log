import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await supabase.auth.signInWithPassword({ email, password });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-slate-950 p-6">
      <Text className="text-3xl font-bold text-white">GripLog</Text>
      <Text className="mt-2 text-slate-400">Accedi per continuare</Text>

      <TextInput
        className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-4 text-white"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="mt-4 rounded-xl border border-slate-700 bg-slate-900 p-4 text-white"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        className="mt-6 rounded-xl bg-orange-500 p-4"
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-center font-semibold text-white">{loading ? 'Accesso...' : 'Accedi'}</Text>
      </Pressable>

      <Link href="/(auth)/register" asChild>
        <Pressable className="mt-4">
          <Text className="text-center text-orange-400">Crea un account</Text>
        </Pressable>
      </Link>
    </View>
  );
}
