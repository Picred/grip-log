import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';
const secureStoreApi = (SecureStore as any)?.default ?? SecureStore;

const webStorageAdapter = {
  getItem: async (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // no-op
    }
  },
  removeItem: async (key: string) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // no-op
    }
  },
};

const getSecureStoreValue = async (key: string) => {
  if (typeof secureStoreApi.getItemAsync === 'function') {
    return secureStoreApi.getItemAsync(key);
  }

  if (typeof secureStoreApi.getValueWithKeyAsync === 'function') {
    return secureStoreApi.getValueWithKeyAsync(key);
  }

  if (isWeb) {
    return webStorageAdapter.getItem(key);
  }

  return null;
};

const setSecureStoreValue = async (key: string, value: string) => {
  if (typeof secureStoreApi.setItemAsync === 'function') {
    return secureStoreApi.setItemAsync(key, value);
  }

  if (typeof secureStoreApi.setValueWithKeyAsync === 'function') {
    return secureStoreApi.setValueWithKeyAsync(key, value);
  }

  if (isWeb) {
    return webStorageAdapter.setItem(key, value);
  }
};

const removeSecureStoreValue = async (key: string) => {
  if (typeof secureStoreApi.deleteItemAsync === 'function') {
    return secureStoreApi.deleteItemAsync(key);
  }

  if (typeof secureStoreApi.deleteValueWithKeyAsync === 'function') {
    return secureStoreApi.deleteValueWithKeyAsync(key);
  }

  if (isWeb) {
    return webStorageAdapter.removeItem(key);
  }
};

const expoSecureStoreAdapter = {
  getItem: async (key: string) => {
    const value = await getSecureStoreValue(key);
    return value ?? null;
  },
  setItem: async (key: string, value: string) => {
    await setSecureStoreValue(key, value);
  },
  removeItem: async (key: string) => {
    await removeSecureStoreValue(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: (isWeb ? webStorageAdapter : expoSecureStoreAdapter) as any,
    storageKey: 'griplog-auth-token',
  },
});
