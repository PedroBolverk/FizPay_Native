import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { colors, spacing, radius } from '@/theme/tokens';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function QR() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = React.useState(false);
  const [data, setData] = React.useState<string | null>(null);

  // Estado inicial: pedindo permissão
  if (!permission) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.title}>Carregando câmera…</Text>
        </View>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.title}>Permitir acesso à câmera</Text>
          <Text style={styles.sub}>Precisamos da câmera para ler QR Codes.</Text>
          <TouchableOpacity style={styles.btn} onPress={requestPermission}>
            <Text style={styles.btnText}>Conceder permissão</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
            <Text style={{ color: colors.muted }}>{'< Voltar'}</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ flex: 1 }}>
        {/* Header simples */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: colors.text }}>{'< Voltar'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ler QR Code</Text>
          <View style={{ width: 48 }} />
        </View>

        {/* Câmera */}
        <View style={styles.cameraWrap}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : (res) => {
              if (!res || !res.data) return;
              setScanned(true);
              setData(res.data);
            }}
          />
          {/* Moldura */}
          <View style={styles.frame} />
        </View>

        {/* Resultado */}
        <View style={styles.panel}>
          {data ? (
            <>
              <Text style={styles.resultLabel}>Conteúdo lido:</Text>
              <Text style={styles.resultValue} numberOfLines={3}>{data}</Text>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: spacing.md }}>
                <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={() => setScanned(false)}>
                  <Text style={styles.btnText}>Ler novamente</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnGhost, { flex: 1 }]} onPress={() => { /* navegar/usar dado */ }}>
                  <Text style={styles.btnGhostText}>Usar dado</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.sub}>Aponte a câmera para um QR.</Text>
          )}
        </View>
      </View>
    </Screen>
  );
}

const SIZE = 220;

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { color: colors.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  sub: { color: colors.muted, textAlign: 'center', marginTop: 8 },

  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: colors.text, fontWeight: '800', fontSize: 18 },

  cameraWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  frame: {
    width: SIZE, height: SIZE, borderRadius: radius.lg, borderWidth: 3,
    borderColor: colors.primaryStart, backgroundColor: 'transparent',
  },

  panel: { padding: spacing.lg, backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  resultLabel: { color: colors.muted },
  resultValue: { color: colors.text, fontWeight: '700', marginTop: 6 },

  btn: { backgroundColor: colors.primaryStart, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  btnGhost: { height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, backgroundColor: colors.surface },
  btnGhostText: { color: colors.text, fontWeight: '700' },
});
