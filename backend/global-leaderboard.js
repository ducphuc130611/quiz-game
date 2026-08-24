/* ============================================================
   QUIZ GAME v5.5.0 — GLOBAL LEADERBOARD SERVICE
   Pagination, player rank, season filtering and public summaries.
   ============================================================ */

export function registerGlobalLeaderboardRoutes(app, { db, auth, version }) {
  function buildRows(season = "all") {
    const rows = Object.values(db.players).map(player => {
      const events = Array.isArray(player.events) ? player.events : [];
      const isAllTime = season === "all";
      const filtered = isAllTime ? events : events.filter(event => String(event.season || "all") === season);
      const score = isAllTime
        ? Number(player.totalScore || 0)
        : filtered.reduce((sum, event) => sum + Number(event.score || 0), 0);
      const correct = isAllTime
        ? Number(player.totalCorrect || 0)
        : filtered.reduce((sum, event) => sum + Number(event.correct || 0), 0);
      const total = isAllTime
        ? Number(player.totalQuestions || 0)
        : filtered.reduce((sum, event) => sum + Number(event.total || 0), 0);
      const bestScore = isAllTime
        ? Number(player.bestScore || 0)
        : filtered.reduce((best, event) => Math.max(best, Number(event.score || 0)), 0);
      const games = isAllTime ? Number(player.games || 0) : filtered.length;
      return {
        playerId: player.playerId,
        username: player.username,
        score,
        bestScore,
        games,
        accuracy: total ? Math.round((correct / total) * 10000) / 100 : 0,
        updatedAt: player.updatedAt || null
      };
    });
    rows.sort((a, b) => b.score - a.score || b.bestScore - a.bestScore || b.accuracy - a.accuracy || a.username.localeCompare(b.username));
    return rows;
  }

  app.get("/leaderboard/global", (req, res) => {
    const season = String(req.query.season || "all").slice(0, 32) || "all";
    const limit = Math.max(1, Math.min(100, Number.parseInt(req.query.limit, 10) || 25));
    const offset = Math.max(0, Math.min(10000, Number.parseInt(req.query.offset, 10) || 0));
    const rows = buildRows(season);
    const page = rows.slice(offset, offset + limit).map((row, index) => ({ ...row, rank: offset + index + 1 }));
    res.json({ ok: true, version, season, totalPlayers: rows.length, offset, limit, leaderboard: page });
  });

  app.get("/leaderboard/me", auth, (req, res) => {
    const season = String(req.query.season || "all").slice(0, 32) || "all";
    const rows = buildRows(season);
    const rank = rows.findIndex(row => row.playerId === req.playerId);
    const player = rank >= 0 ? { ...rows[rank], rank: rank + 1 } : null;
    res.json({ ok: true, version, season, totalPlayers: rows.length, player });
  });

  app.get("/leaderboard/seasons", (_req, res) => {
    const seasons = new Set(["all"]);
    for (const player of Object.values(db.players)) {
      for (const event of Array.isArray(player.events) ? player.events : []) {
        if (event.season) seasons.add(String(event.season).slice(0, 32));
      }
    }
    res.json({ ok: true, seasons: [...seasons].sort() });
  });
}
