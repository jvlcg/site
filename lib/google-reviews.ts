import { site } from "./site-config";

/**
 * Integração AO VIVO com as avaliações do Google (Places API — New).
 *
 * Puxa nota, total e avaliações reais do perfil do Google Meu Negócio, no
 * servidor, com cache (ISR) de 1h — então o site reflete o que está no Google
 * "em tempo real" (dentro da janela de cache), sem copiar texto na mão e sem
 * ficar desatualizado.
 *
 * Requisitos (definir no ambiente da Vercel):
 *   GOOGLE_PLACES_API_KEY  -> chave do Google Cloud com "Places API (New)" ativa
 *   GOOGLE_PLACE_ID        -> (opcional) ID do local; se ausente, é resolvido
 *                             automaticamente pelo nome/endereço do consultório.
 *
 * Sem a chave, retorna null e o site usa o fallback (botão "Ver no Google").
 * As avaliações são de terceiros (pacientes, publicadas no Google) — exibidas
 * como conteúdo público do Google, não como publicidade do próprio médico.
 */

export type GoogleReview = {
  author: string;
  authorUri?: string;
  photo?: string;
  rating: number;
  text: string;
  relativeTime: string;
};

export type GoogleReviewsData = {
  rating: number;
  total: number;
  reviews: GoogleReview[];
  placeId: string;
  mapsUri: string;
  writeReviewUrl: string;
};

const API = "https://places.googleapis.com/v1";
const REVALIDATE = 3600; // 1h

async function resolvePlaceId(key: string): Promise<string | null> {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
  try {
    const res = await fetch(`${API}/places:searchText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.id",
      },
      body: JSON.stringify({
        textQuery: `${site.name} ${site.address.clinic} ${site.address.city} ${site.address.stateName}`,
        languageCode: "pt-BR",
        regionCode: "BR",
      }),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { places?: { id: string }[] };
    return json.places?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return null;

  try {
    const placeId = await resolvePlaceId(key);
    if (!placeId) return null;

    const res = await fetch(`${API}/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "rating,userRatingCount,googleMapsUri,reviews.rating,reviews.text,reviews.relativePublishTimeDescription,reviews.authorAttribution",
        "Accept-Language": "pt-BR",
      },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;

    type ApiReview = {
      rating?: number;
      text?: { text?: string };
      relativePublishTimeDescription?: string;
      authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
    };
    const json = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: ApiReview[];
    };

    const reviews: GoogleReview[] = (json.reviews ?? [])
      .filter((r) => r.text?.text && (r.rating ?? 0) >= 4)
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Paciente",
        authorUri: r.authorAttribution?.uri,
        photo: r.authorAttribution?.photoUri,
        rating: r.rating ?? 5,
        text: r.text!.text!,
        relativeTime: r.relativePublishTimeDescription ?? "",
      }));

    return {
      rating: json.rating ?? 0,
      total: json.userRatingCount ?? 0,
      reviews,
      placeId,
      mapsUri: json.googleMapsUri ?? site.googleReviewsUrl,
      writeReviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}`,
    };
  } catch {
    return null;
  }
}
