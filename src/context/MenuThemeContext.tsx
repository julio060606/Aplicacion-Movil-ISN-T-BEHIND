// src/context/MenuThemeContext.tsx
/**
 * Contexto de tema visual para los menús de pre-juego.
 * Controla si el menú principal y sus subpantallas usan la paleta
 * oscura (terminal/noche) o clara (burocracia/papel).
 *
 * ⚠️ Este contexto NO afecta al ShiftScreen ni a ninguna pantalla
 *    de gameplay. Es exclusivo para la capa de navegación pre-juego.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';

// ── Tipos ──────────────────────────────────────────────────────────────────

export type MenuThemeVariant = 'dark' | 'light';

/** Tokens de color resueltos para el tema activo */
export type MenuThemeTokens = (typeof colors.menuTheme)[MenuThemeVariant];

interface IMenuThemeContext {
  /** Variante activa ('dark' | 'light') */
  variant: MenuThemeVariant;
  /** Tokens de color del tema activo listos para usar en estilos */
  theme: MenuThemeTokens;
  /** Alterna entre 'dark' y 'light' y persiste en AsyncStorage */
  toggleTheme: () => void;
}

// ── Constantes ─────────────────────────────────────────────────────────────

const STORAGE_KEY = '@isnt_behind_menu_theme';
const DEFAULT_VARIANT: MenuThemeVariant = 'dark';

// ── Contexto ───────────────────────────────────────────────────────────────

const MenuThemeContext = createContext<IMenuThemeContext | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────────────────

type Props = { children: React.ReactNode };

export const MenuThemeProvider = ({ children }: Props) => {
  const [variant, setVariant] = useState<MenuThemeVariant>(DEFAULT_VARIANT);

  // Restaurar preferencia guardada al montar
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'dark' || stored === 'light') {
          setVariant(stored);
        }
      })
      .catch(() => {/* preferencia perdida — usa default */});
  }, []);

  const toggleTheme = useCallback(() => {
    setVariant((prev) => {
      const next: MenuThemeVariant = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  // Resolver tokens una sola vez por render (evitar recrear objeto cada frame)
  const theme = useMemo<MenuThemeTokens>(
    () => colors.menuTheme[variant],
    [variant],
  );

  const value = useMemo<IMenuThemeContext>(
    () => ({ variant, theme, toggleTheme }),
    [variant, theme, toggleTheme],
  );

  return (
    <MenuThemeContext.Provider value={value}>
      {children}
    </MenuThemeContext.Provider>
  );
};

// ── Hook de consumo ────────────────────────────────────────────────────────

/**
 * Accede al tema activo y su función de alternado.
 * Lanza un error descriptivo si se usa fuera del `MenuThemeProvider`.
 */
export const useMenuTheme = (): IMenuThemeContext => {
  const ctx = useContext(MenuThemeContext);
  if (!ctx) {
    throw new Error(
      '[useMenuTheme] Debe usarse dentro de <MenuThemeProvider>. ' +
      'Asegúrate de que App.tsx envuelve la navegación con el Provider.',
    );
  }
  return ctx;
};
