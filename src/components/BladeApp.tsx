import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  DISCORD_INVITE,
  DISPLAY_GAMEMODES,
  MATRIX_GAMEMODES,
  REGION_NAMES,
  SERVER_IP,
  getPlayers,
  getTierLevel,
  skinUrl,
  type Player,
} from "@/lib/bladetiers";

const FALLBACK_IMG = "/assets/branding/blade_tier_icon.webp";

function tierDigit(tier?: string | null) {
  const m = tier?.match(/(\d)/);
  return m ? m[1]! : null;
}

function TierCell({
  icon,
  name,
  tier,
}: {
  icon: string;
  name: string;
  tier: string | null | undefined;
}) {
  const level = tierDigit(tier);
  return (
    <div className="gamemode-tier-col" title={`${name}: ${tier ? tier.toUpperCase() : "-"}`}>
      <div className={`gamemode-tier-circle ${level ? `circle-tier-${level}` : "circle-unranked"}`}>
        {tier ? <img src={icon} alt={name} /> : null}
      </div>
      <div className={`gamemode-tier-pill ${level ? `pill-tier-${level}` : "pill-unranked"}`}>
        {tier ? tier.toUpperCase() : "-"}
      </div>
    </div>
  );
}

function Navbar({
  players,
  onOpenPlayer,
}: {
  players: Player[];
  onOpenPlayer: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const matches = query
    ? players
        .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
        .slice(0, 6)
    : [];

  return (
    <header className="navbar">
      <a href="/" className="nav-brand">
        <img src="/assets/branding/blade_tier_logo.png" alt="Blade Tiers logo" />
      </a>

      <ul className="nav-links">
        <li>
          <span className="nav-link active">
            <img src="/assets/nav_icons/rankings.svg" alt="" />
            <span>Rankings</span>
          </span>
        </li>
        <li>
          <a className="nav-link" href={DISCORD_INVITE} target="_blank" rel="noreferrer">
            <img src="/assets/nav_icons/discord.svg" alt="" />
            <span>Discord</span>
          </a>
        </li>
      </ul>

      <div className="nav-search">
        <img src="/assets/nav_icons/home-muted.svg" alt="" width={18} height={18} hidden />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search player..."
          aria-label="Search player"
          autoComplete="off"
        />
        <kbd className="search-kbd">/</kbd>
        {query ? (
          <div className="search-results active">
            {matches.length > 0 ? (
              matches.map((p) => (
                <div
                  key={p.name}
                  className="search-item"
                  onClick={() => {
                    onOpenPlayer(p.name);
                    setQuery("");
                  }}
                >
                  <img
                    src={skinUrl(p.skin) ?? FALLBACK_IMG}
                    alt={p.name}
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  />
                  <div className="search-item-info">
                    <div className="search-item-name">{p.name}</div>
                    <div className="search-item-meta">
                      {p.points} pts • {p.region ?? "??"} • {p.title}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "0.75rem", color: "var(--text-dim)" }}>No player found</div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}

function PlayerModal({
  player,
  rank,
  onClose,
}: {
  player: Player;
  rank: number;
  onClose: () => void;
}) {
  const region = player.region?.toUpperCase() ?? "??";
  const tiers = MATRIX_GAMEMODES.map((m) => ({
    ...m,
    tier: player.tiers[m.id] ?? (m.id === "nethpot" ? player.tiers["pot"] : undefined),
  })).filter((m) => !!m.tier);

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content bt-profile">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="bt-profile-head">
          <div className="bt-profile-avatar">
            <img
              src={skinUrl(player.skin) ?? FALLBACK_IMG}
              alt={player.name}
              onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
            />
          </div>
          <h2 className="bt-profile-name">{player.name}</h2>
          <span className="bt-profile-title">◆ {player.title}</span>
          <span className="bt-profile-region">{REGION_NAMES[region] ?? region}</span>
        </div>

        <div className="bt-profile-section">POSITION</div>
        <div className="bt-position-box">
          <span className="bt-position-rank">{rank}.</span>
          <span className="bt-position-label">🏆 OVERALL</span>
          <span className="bt-position-points">({player.points} points)</span>
        </div>

        <div className="bt-profile-section">TIERS</div>
        <div className="bt-profile-tiers">
          {tiers.length > 0 ? (
            tiers.map((m) => <TierCell key={m.id} icon={m.icon} name={m.name} tier={m.tier} />)
          ) : (
            <span style={{ color: "var(--text-dim)" }}>No tiers assigned yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <img src="/assets/branding/blade_tier_logo.png" alt="Blade Tiers" style={{ height: 48 }} />
        </div>
        <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
          Blade Tiers is the competitive Minecraft PvP tier ranking list for {SERVER_IP}. Players are
          tested across Mace, Sword, NethOP, Pot, Axe, UHC, SMP and Vanilla. Points come from
          official tier tests — High Tier (HT) and Low Tier (LT) decide your global standing.
        </p>
        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noreferrer"
          className="btn-info"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
            background: "#5865F2",
            color: "#fff",
            border: "none",
            padding: "0.75rem",
          }}
        >
          Join the Discord
        </a>
      </div>
    </div>
  );
}

export function BladeApp() {
  const [mode, setMode] = useState("overall");
  const [region, setRegion] = useState("ALL");
  const [openPlayer, setOpenPlayer] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blade-players"],
    queryFn: getPlayers,
    refetchInterval: 30_000,
  });

  const players = useMemo(() => data ?? [], [data]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenPlayer(null);
        setInfoOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visible = useMemo(() => {
    let list = region === "ALL" ? players : players.filter((p) => p.region?.toUpperCase() === region);
    if (mode !== "overall" && mode !== "ltm") {
      list = list.filter((p) => p.tiers[mode] ?? (mode === "pot" ? p.tiers["nethpot"] : undefined));
      list = [...list].sort(
        (a, b) =>
          getTierLevel(a.tiers[mode] ?? a.tiers["nethpot"]) -
          getTierLevel(b.tiers[mode] ?? b.tiers["nethpot"]),
      );
    }
    return list;
  }, [players, region, mode]);

  const selected = players.find((p) => p.name === openPlayer) ?? null;

  return (
    <div className="app-container">
      <Navbar players={players} onOpenPlayer={setOpenPlayer} />

      <main className="rankings-card">
        <nav className="gamemode-tabs">
          {DISPLAY_GAMEMODES.map((m) => (
            <a
              key={m.id}
              className={`gamemode-tab ${mode === m.id ? "active" : ""}`}
              onClick={() => setMode(m.id)}
            >
              <img src={m.icon} alt={m.name} />
              <span>{m.name}</span>
            </a>
          ))}
        </nav>

        <div className="rankings-subheader">
          <div className="subheader-left">
            <button className="btn-info" onClick={() => setInfoOpen(true)}>
              Information
            </button>
          </div>
          <div className="filters-bar">
            <div className="server-ip-box">
              <img className="server-logo" src="/assets/branding/blade_tier_icon.webp" alt="" />
              <div className="server-details">
                <span className="server-label">Server IP</span>
                <div className="server-actions">
                  <span
                    className="server-ip-badge"
                    onClick={() => navigator.clipboard?.writeText(SERVER_IP)}
                  >
                    {SERVER_IP}
                  </span>
                  <a
                    className="server-discord-btn"
                    href={DISCORD_INVITE}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src="/assets/nav_icons/discord.svg" alt="Discord" width={16} height={16} />
                  </a>
                </div>
              </div>
            </div>
            <select
              className="region-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              aria-label="Filter by region"
            >
              <option value="ALL">All Regions</option>
              {Object.entries(REGION_NAMES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name} ({code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="state-box">
            <div className="spinner" />
            <h3 className="state-title">Loading Blade Tiers...</h3>
          </div>
        ) : isError ? (
          <div className="state-box">
            <h3 className="state-title">Unable to load leaderboard.</h3>
            <p className="state-subtitle">Could not reach the Blade Tiers server.</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="state-box">
            <h3 className="state-title">No players registered yet.</h3>
            <p className="state-subtitle">There are no players recorded for this selection.</p>
          </div>
        ) : (
          <>
            <div className="leaderboard-header">
              <div className="col-rank">#</div>
              <div className="col-player">PLAYER</div>
              <div className="col-region">REGION</div>
              <div className="col-tiers">TIERS</div>
            </div>
            <div className="ranking-list">
              {visible.map((player, idx) => {
                const rank = idx + 1;
                const reg = player.region?.toUpperCase() ?? "??";
                return (
                  <div
                    key={player.name}
                    className="ranking-card-row"
                    onClick={() => setOpenPlayer(player.name)}
                  >
                    {rank <= 3 ? (
                      <div className={`rank-badge-chevron rank-${rank}`}>
                        <span>{rank}.</span>
                      </div>
                    ) : (
                      <div className="rank-badge-plain">
                        <span>{rank}.</span>
                      </div>
                    )}

                    <div className="player-model-container">
                      <img
                        className="player-model-img"
                        src={skinUrl(player.skin) ?? FALLBACK_IMG}
                        alt={player.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMG;
                          e.currentTarget.style.opacity = "0.25";
                        }}
                      />
                    </div>

                    <div className="player-info-box">
                      <span className="player-name-text">{player.name}</span>
                      <div className="player-subtitle-row">
                        <span className="combat-rank-symbol">◆</span>
                        <span>
                          {player.title} ({player.points} points)
                        </span>
                      </div>
                    </div>

                    <div className="region-pill-box">
                      <span className={`region-badge-pill reg-${reg}`}>{reg}</span>
                    </div>

                    <div className="tiers-row-box">
                      {MATRIX_GAMEMODES.map((m) => (
                        <TierCell
                          key={m.id}
                          icon={m.icon}
                          name={m.name}
                          tier={
                            player.tiers[m.id] ??
                            (m.id === "nethpot" ? player.tiers["pot"] : undefined)
                          }
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <footer>
        <div>Copyrights © Blade Tiers 2026 • Minecraft PvP Leaderboard for {SERVER_IP}</div>
      </footer>

      {selected ? (
        <PlayerModal
          player={selected}
          rank={players.findIndex((p) => p.name === selected.name) + 1}
          onClose={() => setOpenPlayer(null)}
        />
      ) : null}
      {infoOpen ? <InfoModal onClose={() => setInfoOpen(false)} /> : null}
    </div>
  );
}
