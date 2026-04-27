export const runtime = "edge";

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const steamId = searchParams.get("steam_id")?.trim();
  if (!steamId) return badRequest("Missing steam_id");

  const apiKey = process.env.STEAM_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { error: "Missing STEAM_API_KEY" },
      { status: 500 },
    );
  }

  const url =
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/` +
    `?key=${encodeURIComponent(apiKey)}` +
    `&steamid=${encodeURIComponent(steamId)}` +
    `&format=json` +
    `&include_played_free_games=1`;

  let json: any;
  try {
    const res = await fetch(url, {
      // avoid caching stale numbers
      cache: "no-store",
    });

    if (!res.ok) {
      return Response.json(
        { error: `Steam API error: ${res.status}` },
        { status: 502 },
      );
    }

    json = await res.json();
  } catch {
    return Response.json({ error: "Steam API unreachable" }, { status: 502 });
  }

  const games = json?.response?.games;
  if (!Array.isArray(games)) {
    // Steam returns no games when profile/private/invalid id
    return Response.json(
      { error: "Steam profile private or invalid steam_id" },
      { status: 404 },
    );
  }

  const totalMinutes = games.reduce((acc: number, g: any) => {
    const n = Number(g?.playtime_forever ?? 0);
    return acc + (Number.isFinite(n) ? n : 0);
  }, 0);

  const totalHours = Math.round((totalMinutes / 60) * 10) / 10; // 1 decimal

  return Response.json({ total_hours: totalHours });
}

