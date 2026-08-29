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
    <View className="flex-1 justify-center bg-slate-950 p-6">
      <Text className="text-3xl font-bold text-white">Crea account</Text>
      <Text className="mt-2 text-slate-400">Registra il tuo profilo GripLog</Text>

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
        onPress={handleRegister}
        disabled={loading}
      >
        <Text className="text-center font-semibold text-white">{loading ? 'Creazione...' : 'Registrati'}</Text>
      </Pressable>

      <Link href="/(auth)/login" asChild>
        <Pressable className="mt-4">
          <Text className="text-center text-orange-400">Hai già un account? Accedi</Text>
        </Pressable>
      </Link>
    </View>
  );
}
