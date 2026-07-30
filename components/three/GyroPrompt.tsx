"use client";

import { useEffect, useState } from "react";
import { requestGyro } from "./useTilt";

type OrientationPermissionApi = { requestPermission?: () => Promise<string> };

/**
 * Em iOS (13+), o giroscópio exige permissão disparada por um gesto. Mostra um
 * chip discreto só nesses aparelhos; um toque libera o efeito 3D reagir à
 * inclinação. Android/desktop não precisam e não veem o chip.
 */
export function GyroPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const api = window.DeviceOrientationEvent as unknown as OrientationPermissionApi;
    const needsPermission = typeof api?.requestPermission === "function";
    if (isTouch && needsPermission && !sessionStorage.getItem("gyro-asked")) {
      const t = setTimeout(() => setShow(true), 1400);
      return () => clearTimeout(t);
    }
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        sessionStorage.setItem("gyro-asked", "1");
        await requestGyro();
        setShow(false);
      }}
      className="glass fixed inset-x-0 bottom-24 z-40 mx-auto flex w-max items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg animate-[route-in_0.5s_ease]"
      aria-label="Ativar efeito 3D imersivo com o movimento do aparelho"
    >
      <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
      Ativar profundidade 3D
    </button>
  );
}
