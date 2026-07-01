import { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { PurchasesPackage } from 'react-native-purchases';
import { usePaywallStore, type PaywallContext } from '../../store/paywall-store';
import { usePurchasesStore } from '../../store/purchases-store';

// Vantaggi del Pro elencati nel confronto (chiavi i18n sotto `paywall.feature.*`).
const PRO_FEATURES = ['history', 'charts', 'combos', 'noAds'] as const;

function subtitleKey(ctx: PaywallContext): string {
  switch (ctx) {
    case 'analytics':
      return 'paywall.sub.analytics';
    case 'combo':
      return 'paywall.sub.combo';
    case 'deck':
      return 'paywall.sub.deck';
    case 'ads':
      return 'paywall.sub.ads';
    default:
      return 'paywall.sub.generic';
  }
}

/**
 * Paywall unico per l'entitlement "pro". Montato una sola volta alla radice (App.tsx); si apre via
 * `usePaywallStore.show(context)`. Mostra il Lifetime in evidenza + l'Annuale, con ripristino acquisti.
 * Nessuna tattica di urgenza/scarsità (pubblico che può includere minori).
 */
export function PaywallModal() {
  const { t } = useTranslation();
  const visible = usePaywallStore((s) => s.visible);
  const context = usePaywallStore((s) => s.context);
  const hide = usePaywallStore((s) => s.hide);

  const isPro = usePurchasesStore((s) => s.isPro);
  const offering = usePurchasesStore((s) => s.offering);
  const loadOfferings = usePurchasesStore((s) => s.loadOfferings);
  const purchasePackage = usePurchasesStore((s) => s.purchasePackage);
  const restorePurchases = usePurchasesStore((s) => s.restorePurchases);

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (visible && !offering) void loadOfferings();
  }, [visible, offering, loadOfferings]);

  // Chiude da sé appena l'utente diventa Pro (acquisto o ripristino riusciti).
  useEffect(() => {
    if (visible && isPro) hide();
  }, [visible, isPro, hide]);

  if (!visible) return null;

  const packages = offering?.availablePackages ?? [];
  const lifetime = packages.find((p) => p.packageType === 'LIFETIME');
  const annual = packages.find((p) => p.packageType === 'ANNUAL');
  const ordered: PurchasesPackage[] = [
    ...(lifetime ? [lifetime] : []),
    ...(annual ? [annual] : []),
    ...packages.filter((p) => p !== lifetime && p !== annual),
  ];

  const onBuy = async (pkg: PurchasesPackage) => {
    setBusy(true);
    const ok = await purchasePackage(pkg);
    setBusy(false);
    if (ok) hide();
  };

  const onRestore = async () => {
    setBusy(true);
    await restorePurchases();
    setBusy(false);
  };

  const buyLabel = (pkg: PurchasesPackage): string => {
    const price = pkg.product.priceString;
    if (pkg.packageType === 'LIFETIME') return t('paywall.buyLifetime', { price });
    if (pkg.packageType === 'ANNUAL') return t('paywall.buyAnnual', { price });
    return t('paywall.buyGeneric', { price });
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={hide}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.title}>{t('paywall.title')}</Text>
            <Text style={styles.subtitle}>{t(subtitleKey(context))}</Text>

            <View style={styles.features}>
              {PRO_FEATURES.map((k) => (
                <View key={k} style={styles.featureRow}>
                  <Text style={styles.featureCheck}>✓</Text>
                  <Text style={styles.featureText}>{t(`paywall.feature.${k}`)}</Text>
                </View>
              ))}
            </View>

            {ordered.length === 0 ? (
              <View style={styles.loading}>
                <ActivityIndicator color="#F5C451" />
                <Text style={styles.loadingText}>{t('paywall.loading')}</Text>
              </View>
            ) : (
              ordered.map((pkg) => {
                const highlight = pkg.packageType === 'LIFETIME';
                return (
                  <Pressable
                    key={pkg.identifier}
                    onPress={() => onBuy(pkg)}
                    disabled={busy}
                    style={[styles.buyBtn, highlight ? styles.buyPrimary : styles.buySecondary]}
                    accessibilityRole="button"
                  >
                    <Text style={highlight ? styles.buyPrimaryText : styles.buySecondaryText}>
                      {buyLabel(pkg)}
                    </Text>
                    <Text style={highlight ? styles.buyPrimaryNote : styles.buySecondaryNote}>
                      {highlight ? t('paywall.lifetimeNote') : t('paywall.annualNote')}
                    </Text>
                  </Pressable>
                );
              })
            )}

            {busy ? <ActivityIndicator color="#F5C451" style={{ marginTop: 12 }} /> : null}

            <Pressable onPress={onRestore} disabled={busy} style={styles.restore} accessibilityRole="button">
              <Text style={styles.restoreText}>{t('paywall.restore')}</Text>
            </Pressable>
            <Pressable onPress={hide} disabled={busy} style={styles.close} accessibilityRole="button">
              <Text style={styles.closeText}>{t('paywall.notNow')}</Text>
            </Pressable>
            <Text style={styles.legal}>{t('paywall.legal')}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#12121F',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  scroll: { padding: 22, paddingBottom: 28 },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: '#AEB9C6', fontSize: 14, textAlign: 'center', marginTop: 6, lineHeight: 20 },
  features: { marginTop: 18, marginBottom: 18, gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureCheck: { color: '#2EE6A8', fontSize: 16, fontWeight: '900' },
  featureText: { color: '#E6EDF3', fontSize: 15, flex: 1 },
  loading: { alignItems: 'center', gap: 8, marginVertical: 20 },
  loadingText: { color: '#8888AA', fontSize: 13 },
  buyBtn: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 10, alignItems: 'center' },
  buyPrimary: { backgroundColor: '#F5C451' },
  buySecondary: { backgroundColor: '#1E1E38', borderWidth: 1, borderColor: '#FFFFFF18' },
  buyPrimaryText: { color: '#0f172a', fontSize: 16, fontWeight: '800' },
  buySecondaryText: { color: '#E6EDF3', fontSize: 16, fontWeight: '700' },
  buyPrimaryNote: { color: '#0f172a', fontSize: 12, marginTop: 2, opacity: 0.8 },
  buySecondaryNote: { color: '#8888AA', fontSize: 12, marginTop: 2 },
  restore: { marginTop: 6, paddingVertical: 8, alignItems: 'center' },
  restoreText: { color: '#3ABFFF', fontSize: 14, fontWeight: '700' },
  close: { paddingVertical: 8, alignItems: 'center' },
  closeText: { color: '#8888AA', fontSize: 14 },
  legal: { color: '#66667A', fontSize: 11, textAlign: 'center', marginTop: 10, lineHeight: 16 },
});
