"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    /**
     * O tema claro é o padrão de quem chega pela primeira vez: é o que a maioria
     * espera de um site de consultório, e não surpreende quem abre o link em
     * ambiente iluminado. Quem prefere o escuro troca no botão do cabeçalho, e a
     * escolha fica guardada para as próximas visitas.
     *
     * `enableSystem` fica desligado de propósito — com ele, quem usa o celular
     * no modo escuro cairia direto no tema escuro, o oposto do pedido.
     */
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
