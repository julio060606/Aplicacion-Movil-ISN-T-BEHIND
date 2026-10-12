// src/components/menu/TypewriterText.tsx
/**
 * Efecto de escritura de terminal — escribe el texto carácter a carácter.
 *
 * Simula el barrido de un cursor CRT antiguo escribiendo en pantalla.
 * Dispara la animación al montar el componente.
 *
 * Props:
 *   text     — texto completo a escribir
 *   speed    — ms entre caracteres (default 45)
 *   style    — estilos del Text
 *   onDone   — callback cuando termina de escribir
 */
import React, { useEffect, useRef, useState } from 'react';
import { Text, TextStyle } from 'react-native';

// ── Props ──────────────────────────────────────────────────────────────────

interface TypewriterTextProps {
  text: string;
  speed?: number;
  style?: TextStyle | TextStyle[];
  onDone?: () => void;
  /** Si es true, espera este delay (ms) antes de empezar a escribir */
  startDelay?: number;
}

// ── Componente ─────────────────────────────────────────────────────────────

export const TypewriterText = ({
  text,
  speed = 45,
  style,
  onDone,
  startDelay = 0,
}: TypewriterTextProps) => {
  const [displayed, setDisplayed] = useState('');
  // Usamos ref para el índice para evitar closures obsoletas
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Reiniciar al cambiar el texto
    setDisplayed('');
    indexRef.current = 0;

    const startTyping = () => {
      intervalRef.current = setInterval(() => {
        const i = indexRef.current;
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          indexRef.current = i + 1;
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onDone?.();
        }
      }, speed);
    };

    const timeoutId = setTimeout(startTyping, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, startDelay, onDone]);

  return <Text style={style}>{displayed}</Text>;
};
