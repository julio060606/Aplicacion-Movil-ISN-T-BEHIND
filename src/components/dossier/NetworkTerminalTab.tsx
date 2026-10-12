// src/components/dossier/NetworkTerminalTab.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { cstNetworkService, IPortwallWeather } from '../../services/api/cstNetworkService';
import { ICstDispatch } from '../../constants/localDispatches';
import { colors } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { moderateScale, scale, verticalScale } from '../../utils/responsive';

type FilterType = 'ALL' | 'CLOUD' | 'CACHE' | 'LOCAL';

export const NetworkTerminalTab: React.FC = () => {
  const [dispatches, setDispatches] = useState<ICstDispatch[]>([]);
  const [weather, setWeather] = useState<IPortwallWeather | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [cacheCount, setCacheCount] = useState<number>(0);

  const refreshCacheCount = useCallback(async () => {
    const cached = await cstNetworkService.loadDispatchesFromCache();
    setCacheCount(cached.length);
  }, []);

  const loadCloudData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cloudItems, weatherData] = await Promise.all([
        cstNetworkService.fetchCloudDispatches(),
        cstNetworkService.fetchPortwallWeather(),
      ]);
      setDispatches(cloudItems);
      setWeather(weatherData);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de red');
      setDispatches(cstNetworkService.getLocalFallbackDispatches());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    } finally {
      setIsLoading(false);
      refreshCacheCount().catch(() => {});
    }
  }, [refreshCacheCount]);

  useEffect(() => {
    loadCloudData();
  }, [loadCloudData]);

  const handleSaveToCache = async () => {
    if (dispatches.length === 0) return;
    await cstNetworkService.saveDispatchesToCache(dispatches);
    await refreshCacheCount();
    Haptics.selectionAsync().catch(() => {});
  };

  const handleLoadFromCache = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const cached = await cstNetworkService.loadDispatchesFromCache();
      if (cached.length === 0) {
        setError('Caché de AsyncStorage vacía. Sincronice primero.');
      } else {
        setDispatches(cached);
      }
    } finally {
      setIsLoading(false);
      Haptics.selectionAsync().catch(() => {});
    }
  };

  const handleLoadLocalFallback = () => {
    setError(null);
    setDispatches(cstNetworkService.getLocalFallbackDispatches());
    Haptics.selectionAsync().catch(() => {});
  };

  const filteredDispatches = useMemo(() => {
    return dispatches.filter((item) => {
      const match =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sector.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return false;
      if (activeFilter === 'CLOUD') return item.source === 'CLOUD_REST';
      if (activeFilter === 'CACHE') return item.source === 'CACHE_STORAGE';
      if (activeFilter === 'LOCAL') return item.source === 'LOCAL_OFFLINE';
      return true;
    });
  }, [dispatches, searchQuery, activeFilter]);

  const getBadgeStyle = (source: ICstDispatch['source']) => {
    if (source === 'CLOUD_REST') return { label: 'NUBE // REST API', color: '#2E86C1' };
    if (source === 'CACHE_STORAGE') return { label: 'ASYNC STORAGE // CACHÉ', color: '#d97706' };
    return { label: 'LOCAL // ROM OFFLINE', color: colors.crtGreen };
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Telemetría climática Open-Meteo */}
      <View style={styles.weatherCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.weatherTitle}>TELEMETRÍA ATMOSFÉRICA // PORTWALL</Text>
          <Text style={[styles.statusBadge, { color: weather?.isOnline ? colors.crtGreen : '#f59e0b' }]}>
            {weather?.isOnline ? '● EN LÍNEA' : '▲ MODO LOCAL'}
          </Text>
        </View>
        <Text style={styles.weatherTemp}>
          {weather ? `${weather.temperature}°C` : '--.-°C'}
          <Text style={styles.weatherCondition}> | {weather?.condition || 'CALIBRANDO...'}</Text>
        </Text>
        <Text style={styles.weatherSub}>Viento: {weather?.windspeed ?? '--'} km/h | Satélite C.S.T. Nodo-4</Text>
      </View>

      {/* Matriz de almacenamiento */}
      <View style={styles.matrixBox}>
        <Text style={styles.sectionHeading}>ARQUITECTURA DE ALMACENAMIENTO</Text>
        <Text style={styles.matrixCaption}>Caché en AsyncStorage: {cacheCount} registros</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.btnAction} onPress={loadCloudData}>
            <Text style={styles.btnActionText}>[ ↻ SYNC NUBE ]</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnAction} onPress={handleSaveToCache}>
            <Text style={styles.btnActionText}>[ 💾 CACHEAR ]</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnAction} onPress={handleLoadFromCache}>
            <Text style={styles.btnActionText}>[ 📂 CARGAR CACHÉ ]</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnAction} onPress={handleLoadLocalFallback}>
            <Text style={styles.btnActionText}>[ ⚡ FORZAR LOCAL ]</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtros y búsqueda */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="BUSCAR EN COMUNICADOS POR PALABRA O SECTOR..."
          placeholderTextColor="#475569"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="characters"
        />
        <View style={styles.filterTabs}>
          {(['ALL', 'CLOUD', 'CACHE', 'LOCAL'] as FilterType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterChip, activeFilter === tab && styles.filterChipActive]}
              onPress={() => setActiveFilter(tab)}
            >
              <Text style={[styles.filterChipText, activeFilter === tab && styles.filterChipTextActive]}>
                {tab === 'ALL' ? 'TODOS' : tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Estados reactivos */}
      {isLoading && (
        <View style={styles.feedbackRow}>
          <ActivityIndicator size="small" color="#2E86C1" />
          <Text style={styles.feedbackText}>CONSULTANDO ENDPOINT REST...</Text>
        </View>
      )}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠ ERROR DE RED: {error}</Text>
          <Text style={styles.errorSub}>Mostrando respaldo local de contingencia.</Text>
        </View>
      )}

      {/* Despachos */}
      {filteredDispatches.length === 0 && !isLoading ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>NO SE ENCONTRARON REGISTROS CON EL FILTRO DADO</Text>
        </View>
      ) : (
        filteredDispatches.map((item) => {
          const badge = getBadgeStyle(item.source);
          return (
            <View key={`${item.source}-${item.id}`} style={styles.dispatchCard}>
              <View style={styles.rowBetween}>
                <Text style={[styles.sourceBadge, { borderColor: badge.color, color: badge.color }]}>
                  {badge.label}
                </Text>
                <Text style={styles.timestampText}>{item.timestamp}</Text>
              </View>
              <Text style={styles.dispatchSector}>REF: {item.sector} // ID #{item.id}</Text>
              <Text style={styles.dispatchTitle}>{item.title}</Text>
              <Text style={styles.dispatchBody}>{item.body}</Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a12' },
  content: { padding: scale(14), paddingBottom: verticalScale(40) },
  weatherCard: {
    backgroundColor: '#0a101d', borderWidth: 1, borderColor: '#1e293b',
    borderLeftWidth: 3, borderLeftColor: '#2E86C1', padding: scale(10),
    marginBottom: verticalScale(12), borderRadius: 3,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  weatherTitle: { fontFamily: TYPOGRAPHY.cleanDoc, fontSize: moderateScale(8.5), color: '#94a3b8' },
  statusBadge: { fontFamily: TYPOGRAPHY.systemPC, fontSize: moderateScale(8), fontWeight: 'bold' },
  weatherTemp: { fontFamily: TYPOGRAPHY.stamps, fontSize: moderateScale(15), color: '#38bdf8', marginTop: 2 },
  weatherCondition: { fontFamily: TYPOGRAPHY.cleanDoc, fontSize: moderateScale(9), color: '#cbd5e1' },
  weatherSub: { fontFamily: TYPOGRAPHY.systemPC, fontSize: moderateScale(7.5), color: '#64748b', marginTop: 2 },
  matrixBox: {
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b',
    padding: scale(10), marginBottom: verticalScale(12), borderRadius: 3,
  },
  sectionHeading: { fontFamily: TYPOGRAPHY.stamps, fontSize: moderateScale(10), color: '#fef3c7' },
  matrixCaption: { fontFamily: TYPOGRAPHY.systemPC, fontSize: moderateScale(8), color: '#94a3b8', marginVertical: 4 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(6), marginTop: 4 },
  btnAction: {
    backgroundColor: '#1e293b', paddingVertical: verticalScale(6),
    paddingHorizontal: scale(8), borderWidth: 1, borderColor: '#334155', borderRadius: 2,
  },
  btnActionText: { fontFamily: TYPOGRAPHY.cleanDoc, fontSize: moderateScale(8), color: '#f1f5f9', fontWeight: 'bold' },
  searchSection: { marginBottom: verticalScale(12) },
  searchInput: {
    backgroundColor: '#020617', borderWidth: 1, borderColor: '#334155',
    color: '#e2e8f0', fontFamily: TYPOGRAPHY.systemPC, fontSize: moderateScale(8.5),
    paddingHorizontal: scale(8), paddingVertical: verticalScale(6), borderRadius: 3, marginBottom: verticalScale(6),
  },
  filterTabs: { flexDirection: 'row', gap: scale(6) },
  filterChip: {
    paddingVertical: verticalScale(4), paddingHorizontal: scale(10),
    borderWidth: 1, borderColor: '#334155', borderRadius: 2,
  },
  filterChipActive: { backgroundColor: '#2E86C1', borderColor: '#2E86C1' },
  filterChipText: { fontFamily: TYPOGRAPHY.cleanDoc, fontSize: moderateScale(8), color: '#94a3b8' },
  filterChipTextActive: { color: '#ffffff', fontWeight: 'bold' },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', gap: scale(8), marginVertical: verticalScale(6) },
  feedbackText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: moderateScale(8), color: '#38bdf8' },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: '#ef4444',
    padding: scale(8), marginBottom: verticalScale(8), borderRadius: 3,
  },
  errorText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: moderateScale(8), color: '#fca5a5' },
  errorSub: { fontFamily: TYPOGRAPHY.cleanDoc, fontSize: moderateScale(7.5), color: '#cbd5e1', marginTop: 2 },
  emptyBox: { padding: scale(16), alignItems: 'center' },
  emptyText: { fontFamily: TYPOGRAPHY.cleanDoc, fontSize: moderateScale(9), color: '#64748b' },
  dispatchCard: {
    backgroundColor: '#090d16', borderWidth: 1, borderColor: '#1e293b',
    padding: scale(10), marginBottom: verticalScale(10), borderRadius: 3,
  },
  sourceBadge: {
    borderWidth: 1, paddingHorizontal: scale(6), paddingVertical: verticalScale(2),
    fontFamily: TYPOGRAPHY.systemPC, fontSize: moderateScale(7), fontWeight: 'bold',
  },
  timestampText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: moderateScale(7.5), color: '#64748b' },
  dispatchSector: { fontFamily: TYPOGRAPHY.cleanDoc, fontSize: moderateScale(8), color: '#94a3b8', marginBottom: 2 },
  dispatchTitle: { fontFamily: TYPOGRAPHY.stamps, fontSize: moderateScale(11), color: '#e2e8f0', marginBottom: 4 },
  dispatchBody: { fontFamily: TYPOGRAPHY.dirtyDoc, fontSize: moderateScale(9), color: '#cbd5e1', lineHeight: verticalScale(13) },
});
