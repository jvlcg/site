"use client";

import { useEffect, useRef } from "react";

export type TiltRef = { x: number; y: number };

/**
 * Vetor de inclinação normalizado (-1..1) unificando três entradas:
 * - mouse (desktop)
 * - arrasto de toque (mobile/tablet)
 * - DeviceOrientation / giroscópio (mobile/tablet)
 *
 * Retorna um ref mutável (não causa re-render) para ser lido no loop do R3F.
 * Também expõe `requestGyro()` para pedir permissão do sensor no iOS 13+.
 */
export function useTilt() {
  const tilt = useRef<TiltRef>({ x: 0, y: 0 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onMouse = (e: MouseEvent) => {
      tilt.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      tilt.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      tilt.current.x = (t.clientX / window.innerWidth) * 2 - 1;
      tilt.current.y = (t.clientY / window.innerHeight) * 2 - 1;
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      // gamma: esquerda/direita (-90..90); beta: frente/trás (-180..180)
      if (e.gamma == null || e.beta == null) return;
      tilt.current.x = Math.max(-1, Math.min(1, e.gamma / 45));
      tilt.current.y = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("deviceorientation", onOrient, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, []);

  return tilt;
}

type OrientationPermissionApi = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

/** Pede permissão de giroscópio (iOS 13+) — precisa ser chamada em um gesto do usuário. */
export async function requestGyro(): Promise<boolean> {
  try {
    const api = window.DeviceOrientationEvent as unknown as OrientationPermissionApi;
    if (typeof api?.requestPermission === "function") {
      const res = await api.requestPermission();
      return res === "granted";
    }
    return true; // navegadores sem gate de permissão
  } catch {
    return false;
  }
}
