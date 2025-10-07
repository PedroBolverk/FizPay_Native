import AsyncStorage from '@react-native-async-storage/async-storage';

// Definindo uma interface para nosso Storage
export const storage = {
  // Função para recuperar dados de forma segura, com um valor padrão caso não exista
  async get<T>(key: string, fallback: T): Promise<T> {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;  // Se não houver dado, retorna o valor de fallback
    try {
      return JSON.parse(raw) as T;  // Tenta parsear o dado JSON
    } catch (e) {
      console.error(`Erro ao parsear o dado: ${key}`, e);
      return fallback;  // Retorna o valor de fallback em caso de erro
    }
  },

  // Função para salvar dados de forma segura
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));  // Converte o valor para JSON e salva
    } catch (e) {
      console.error(`Erro ao salvar o dado: ${key}`, e);
    }
  },

  // Função para remover um dado
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);  // Remove o dado do AsyncStorage
    } catch (e) {
      console.error(`Erro ao remover o dado: ${key}`, e);
    }
  },
};
