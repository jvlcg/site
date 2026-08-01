/**
 * Service worker das notificações.
 *
 * Fica registrado no navegador do visitante e é acordado pelo sistema quando
 * chega um aviso — a página não precisa estar aberta. Ele faz só isso: exibir a
 * notificação e abrir a página certa quando alguém toca nela.
 *
 * Deliberadamente **não** guarda página nenhuma em cache. Um site médico não
 * pode correr o risco de mostrar conteúdo desatualizado por causa de cache
 * antigo, e o site já é estático e rápido sem isso.
 */

const PADRAO = {
  titulo: "Dr. José Victor",
  corpo: "Há novidade no site.",
  url: "/blog",
};

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (evento) => evento.waitUntil(self.clients.claim()));

self.addEventListener("push", (evento) => {
  let dados = {};
  try {
    dados = evento.data ? evento.data.json() : {};
  } catch {
    /* payload malformado: cai no texto padrão em vez de não mostrar nada */
  }

  const titulo = dados.titulo || PADRAO.titulo;
  const url = dados.url || PADRAO.url;

  evento.waitUntil(
    self.registration.showNotification(titulo, {
      body: dados.corpo || PADRAO.corpo,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      lang: "pt-BR",
      // agrupa por assunto: dois avisos do blog não viram duas linhas na tela
      tag: dados.tag || "blog",
      renotify: false,
      data: { url },
    })
  );
});

self.addEventListener("notificationclick", (evento) => {
  evento.notification.close();
  const destino = new URL(evento.notification.data?.url || PADRAO.url, self.location.origin).href;

  evento.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((janelas) => {
      // se o site já estiver aberto numa aba, aproveita ela em vez de abrir outra
      for (const janela of janelas) {
        if (janela.url.startsWith(self.location.origin) && "focus" in janela) {
          janela.navigate?.(destino);
          return janela.focus();
        }
      }
      return self.clients.openWindow(destino);
    })
  );
});
