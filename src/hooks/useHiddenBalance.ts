import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'pref:showBalance';

export function useHiddenBalance(defaultValue = true) {
  const [show, setShow] = useState<boolean>(defaultValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw !== null) setShow(raw === '1');
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const toggle = useCallback(async () => {
    const next = !show;
    setShow(next);
    try { await AsyncStorage.setItem(KEY, next ? '1' : '0'); } catch {}
  }, [show]);

  return { show, setShow, toggle, ready };
}
