import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'
import { DateTime } from 'luxon'
import api from '@/app/lib/api'
import CryptoJS from 'crypto-js'
import Cookies from 'js-cookie'
import { AuthResponse } from './definitions'

type AuthState = {
  AUTH: AuthResponse | null;
  isDeauthing: boolean;

  // getters
  getAUTH: () => AuthResponse | null;
  Authorization: () => string | null;
  hasAuth: () => boolean;

  // actions
  setDeAUTH: (redirect?: boolean) => Promise<void>;
  setPERM: (permissions: any) => void;
  setAUTH: (P: AuthResponse) => void;
  onAUTH: (AUTH_data: AuthResponse) => Promise<void>;
  deAUTH: () => Promise<void>;
};

const encrypt = (data: string | object): string => {
  const stringData = typeof data === 'object' ? JSON.stringify(data) : data;
  return CryptoJS.AES.encrypt(stringData, 'xD').toString();
};

const decrypt = (encrypted: string | undefined): any => {
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, 'xD');
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    console.error('Decrypt failed:', e);
    return null;
  }
};

const exp_auth = (): AuthResponse | null => {
  const decode = decrypt(Cookies.get('CO_AUTH'))
  if (decode) {
    const { exp } = decode
    if (Math.floor(DateTime.now().toSeconds()) > exp) return null
    return decode
  }
  return null
}

export const useAuthStore = create<AuthState>((set, get) => ({
  AUTH: exp_auth(),
  isDeauthing: false,

  getAUTH: () => get().AUTH,
  Authorization: () => get().AUTH?.authorization ?? null,
  hasAuth: () => !!get().AUTH,

  setDeAUTH: async (redirect = false) => {
    if (get().isDeauthing) return;
    set({ isDeauthing: true });
    set({ AUTH: null });
    Cookies.remove('CO_AUTH');
    Cookies.remove('CO_EXP');
    Cookies.remove('CO_PERM');
    api.Authorization = null;
    set({ isDeauthing: false });
    if (redirect) window.location.reload();
  },

  setPERM: (permissions) => {
    Cookies.remove('CO_PERM');
    const expDateStr = Cookies.get('CO_EXP');
    const expDate = expDateStr ? new Date(decrypt(expDateStr)) : undefined;
    if (expDate) {
      Cookies.set('CO_PERM', encrypt(permissions), { expires: expDate });
    } else {
      Cookies.set('CO_PERM', encrypt(permissions));
    }
  },

  setAUTH: (P) => {
    const decoded: any = jwtDecode(P.authorization);
    const exp = decoded.exp;
    P.exp = exp;
    P.authorization = `Bearer ${P.authorization}`;
    set({ AUTH: P });
    const dateTime = DateTime.fromSeconds(exp).toJSDate();
    Cookies.set('CO_AUTH', encrypt(P), { expires: dateTime });
    Cookies.set('CO_EXP', encrypt(dateTime.toISOString()));
    api.Authorization = P.authorization;
  },

  onAUTH: async (AUTH_data) => {
    try {
      get().setAUTH(AUTH_data);
    } catch (error) {
      console.error(error);
      await get().deAUTH();
    }
  },

  deAUTH: async () => {
    try {
      // await api.delete('users/logout');
    } catch (e) {
      console.error('Logout error:', e);
    }
    Cookies.remove('CO_AUTH');
    Cookies.remove('CO_EXP');
    Cookies.remove('CO_PERM');
    api.Authorization = null;
    window.location.reload();
  },
}));