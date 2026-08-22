import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import photoVance from "@/assets/officer-vance.jpg";
import photoRhodes from "@/assets/officer-rhodes.jpg";
import photoMarkovic from "@/assets/officer-markovic.jpg";
import photoRhodesFull from "@/assets/officer-rhodes-full.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LSPD — Baza funkcjonariuszy" },
      {
        name: "description",
        content:
          "Wewnętrzna baza funkcjonariuszy LSPD: numery odznak, stopnie, jednostki, awanse, szkolenia i podania do jednostek.",
      },
      { property: "og:title", content: "LSPD — Baza funkcjonariuszy" },
      {
        property: "og:description",
        content:
          "Numery odznak, stopnie, jednostki, awanse i podania do jednostek funkcjonariuszy LSPD.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Duty = "NA SŁUŻBIE" | "PO SŁUŻBIE" | "SZKOLENIE";

const RANKS = [
  "Cadet",
  "Officer I",
  "Officer II",
  "Officer III",
  "Sergeant",
  "Lieutenant",
  "Captain",
] as const;

type Officer = {
  id: string;
  badge: string;
  name: string;
  rank: string;
  division: string;
  duty: Duty;
  since: string;
  performance: number;
  photo: string;
  fullPhoto?: string;
  station: string;
  unit: string;
  trainings: string[];
  history: { code: string; text: string; tag: string }[];
};

const INITIAL_OFFICERS: Officer[] = [
  {
    id: "1",
    badge: "B-4471",
    name: "VANCE, ELIAS",
    rank: "Lieutenant",
    division: "Wydział Detektywów",
    duty: "NA SŁUŻBIE",
    since: "2006-04-11",
    performance: 92,
    photo: photoVance,
    station: "Downtown HQ",
    unit: "Jednostka 2-DAVID-04",
    trainings: ["DETEKTYW-II", "NEGOCJACJE", "TASER"],
    history: [
      { code: "2018-PR-071", text: "AWANS NA STOPIEŃ PORUCZNIKA", tag: "ZATWIERDZONE" },
    ],
  },
  {
    id: "2",
    badge: "B-7821",
    name: "RHODES, SARAH",
    rank: "Sergeant",
    division: "Patrol — Mission Row",
    duty: "NA SŁUŻBIE",
    since: "2013-09-02",
    performance: 88,
    photo: photoRhodes,
    fullPhoto: photoRhodesFull,
    station: "Mission Row Station",
    unit: "Jednostka 1-ADAM-12",
    trainings: ["TASER", "SWAT-BASIC", "MEDIC"],
    history: [
      { code: "2022-PR-118", text: "AWANS NA STOPIEŃ SIERŻANTA", tag: "ZATWIERDZONE" },
      { code: "2019-CM-042", text: "MEDAL ZA ODWAGĘ W SŁUŻBIE", tag: "ODZNACZENIE" },
    ],
  },
  {
    id: "3",
    badge: "B-9105",
    name: "MARKOVIC, IVAN",
    rank: "Officer II",
    division: "Akademia / Rekrut",
    duty: "SZKOLENIE",
    since: "2024-01-15",
    performance: 54,
    photo: photoMarkovic,
    station: "Akademia LSPD",
    unit: "Grupa szkoleniowa R-08",
    trainings: ["PODSTAWOWE", "STRZELECKIE"],
    history: [{ code: "2024-EN-311", text: "PRZYJĘCIE DO AKADEMII", tag: "ZATWIERDZONE" }],
  },
];

type Application = {
  id: string;
  applicant: string;
  badge: string;
  division: string;
  date: string;
  motive: string;
  status: "OCZEKUJE" | "ZATWIERDZONE" | "ODRZUCONE";
};

const INITIAL_APPS: Application[] = [
  {
    id: "a1",
    applicant: "MARKOVIC, IVAN",
    badge: "B-9105",
    division: "Patrol — Mission Row",
    date: "2026-08-14",
    motive: "Ukończone szkolenie podstawowe, wniosek o przydział do patrolu.",
    status: "OCZEKUJE",
  },
  {
    id: "a2",
    applicant: "OKONKWO, DANIEL",
    badge: "B-9310",
    division: "Wydział Detektywów",
    date: "2026-08-09",
    motive: "3 lata w patrolu, wniosek o transfer do detektywów.",
    status: "OCZEKUJE",
  },
  {
    id: "a3",
    applicant: "REYES, MARTA",
    badge: "B-8842",
    division: "SWAT",
    date: "2026-07-30",
    motive: "Zaliczony test sprawnościowy SWAT-BASIC.",
    status: "ZATWIERDZONE",
  },
];

const DIVISIONS = [
  "Patrol — Mission Row",
  "Patrol — Vespucci",
  "Wydział Detektywów",
  "SWAT",
  "Akademia / Rekrut",
  "Ruch Drogowy",
];

function DutyChip({ duty }: { duty: Duty }) {
  if (duty === "NA SŁUŻBIE") {
    return (
      <span className="border border-accent bg-accent/5 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
        Na służbie
      </span>
    );
  }
  if (duty === "SZKOLENIE") {
    return (
      <span className="border border-foreground/40 bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Szkolenie
      </span>
    );
  }
  return (
    <span className="border border-foreground/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/70">
      Po służbie
    </span>
  );
}

function perfColor(v: number) {
  if (v >= 75) return "bg-success";
  if (v >= 50) return "bg-warning";
  return "bg-destructive";
}

function Index() {
  const [officers, setOfficers] = useState<Officer[]>(INITIAL_OFFICERS);
  const [apps, setApps] = useState<Application[]>(INITIAL_APPS);
  const [tab, setTab] = useState<"kadra" | "podania">("kadra");
  const [selectedId, setSelectedId] = useState("2");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);

  const selected = officers.find((o) => o.id === selectedId) ?? officers[0];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return officers;
    return officers.filter((o) =>
      [o.badge, o.name, o.division, o.rank].some((f) => f.toLowerCase().includes(q)),
    );
  }, [officers, query]);

  const onDuty = officers.filter((o) => o.duty === "NA SŁUŻBIE").length;
  const recruits = officers.filter((o) => o.division === "Akademia / Rekrut").length;
  const pending = apps.filter((a) => a.status === "OCZEKUJE").length;

  function patch(id: string, data: Partial<Officer>) {
    setOfficers((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
  }

  function changeRank(id: string, dir: 1 | -1) {
    setOfficers((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = RANKS.indexOf(o.rank as (typeof RANKS)[number]);
        const next = RANKS[Math.min(RANKS.length - 1, Math.max(0, (idx < 0 ? 1 : idx) + dir))];
        if (next === o.rank) return o;
        return {
          ...o,
          rank: next,
          history: [
            {
              code: `2026-${dir === 1 ? "PR" : "DG"}-${Math.floor(100 + Math.random() * 899)}`,
              text: `${dir === 1 ? "AWANS" : "DEGRADACJA"} — STOPIEŃ: ${next.toUpperCase()}`,
              tag: dir === 1 ? "AWANS" : "DEGRADACJA",
            },
            ...o.history,
          ],
        };
      }),
    );
  }

  function decideApp(id: string, approve: boolean) {
    const app = apps.find((a) => a.id === id);
    if (!app) return;
    setApps((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: approve ? "ZATWIERDZONE" : "ODRZUCONE" } : a,
      ),
    );
    if (approve) {
      const target = officers.find((o) => o.badge === app.badge);
      if (target) patch(target.id, { division: app.division });
    }
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-background font-body text-foreground">
      <aside className="animate-fade flex w-72 shrink-0 flex-col border-r border-border">
        <div className="border-b border-border p-6">
          <h1 className="font-display text-4xl tracking-wider text-accent">LSPD</h1>
          <p className="font-mono text-[10px] tracking-tighter text-muted-foreground">
            BAZA FUNKCJONARIUSZY v4.0.2
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-8">
          {(
            [
              { key: "kadra", n: "01", label: "KADRA FUNKCJONARIUSZY" },
              { key: "podania", n: "02", label: "PODANIA DO JEDNOSTEK" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={
                tab === item.key
                  ? "flex w-full items-center gap-3 border-l-2 border-accent bg-primary/30 px-3 py-2 text-left text-foreground"
                  : "group flex w-full items-center gap-3 px-3 py-2 text-left text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              <span className="font-mono text-xs opacity-50 group-hover:opacity-100">
                {item.n}
              </span>
              <span className="font-display text-lg tracking-wide">{item.label}</span>
              {item.key === "podania" && pending > 0 && (
                <span className="ml-auto border border-accent px-1.5 font-mono text-[10px] text-accent">
                  {pending}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-3 gap-4 border-t border-border p-6">
          <div className="border-t border-border pt-2">
            <p className="font-mono text-[9px] text-muted-foreground">NA SŁUŻBIE</p>
            <p className="font-display text-xl text-accent">
              {String(onDuty).padStart(2, "0")}
            </p>
          </div>
          <div className="border-t border-border pt-2">
            <p className="font-mono text-[9px] text-muted-foreground">KADRA</p>
            <p className="font-display text-xl">{String(officers.length).padStart(2, "0")}</p>
          </div>
          <div className="border-t border-border pt-2">
            <p className="font-mono text-[9px] text-muted-foreground">REKRUCI</p>
            <p className="font-display text-xl">{String(recruits).padStart(2, "0")}</p>
          </div>
        </div>
      </aside>

      <main className="animate-fade flex flex-1 flex-col overflow-hidden [animation-delay:100ms]">
        {tab === "kadra" ? (
          <>
            <header className="flex items-center justify-between gap-4 border-b border-border p-6">
              <div className="relative w-full max-w-xl">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
                  SZUKAJ_
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="NR ODZNAKI, NAZWISKO LUB JEDNOSTKA..."
                  className="w-full border border-border bg-muted py-3 pl-24 pr-4 font-mono text-sm uppercase transition-colors placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none"
                />
              </div>
              <button
                onClick={() => {
                  const id = crypto.randomUUID();
                  setOfficers((prev) => [
                    ...prev,
                    {
                      id,
                      badge: `B-${Math.floor(1000 + Math.random() * 8999)}`,
                      name: "NOWY, FUNKCJONARIUSZ",
                      rank: "Cadet",
                      division: "Akademia / Rekrut",
                      duty: "SZKOLENIE",
                      since: new Date().toISOString().slice(0, 10),
                      performance: 40,
                      photo: photoMarkovic,
                      station: "Akademia LSPD",
                      unit: "Grupa szkoleniowa R-09",
                      trainings: ["PODSTAWOWE"],
                      history: [
                        { code: "2026-EN-001", text: "PRZYJĘCIE DO AKADEMII", tag: "ZATWIERDZONE" },
                      ],
                    },
                  ]);
                  setSelectedId(id);
                  setEditing(true);
                }}
                className="shrink-0 bg-accent px-4 py-2 font-display text-xs tracking-widest text-accent-foreground transition-all hover:brightness-110"
              >
                NOWY FUNKCJONARIUSZ
              </button>
            </header>

            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
                  <tr className="border-b border-border">
                    {["ODZNAKA", "Funkcjonariusz", "Jednostka", "Status", "Ocena"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visible.map((o) => {
                    const active = o.id === selectedId;
                    return (
                      <tr
                        key={o.id}
                        onClick={() => setSelectedId(o.id)}
                        className={
                          active
                            ? "cursor-pointer border-l-2 border-accent bg-primary/20 transition-colors hover:bg-primary/30"
                            : "cursor-pointer transition-colors hover:bg-muted"
                        }
                      >
                        <td className="px-6 py-3 font-mono text-xs text-accent">#{o.badge}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-4">
                            <img
                              src={o.photo}
                              alt={`Zdjęcie służbowe: ${o.name}`}
                              loading="lazy"
                              width={512}
                              height={512}
                              className="size-10 border border-border object-cover grayscale"
                            />
                            <div>
                              <p
                                className={
                                  active
                                    ? "font-display text-lg tracking-wide text-accent"
                                    : "font-display text-lg tracking-wide"
                                }
                              >
                                {o.name}
                              </p>
                              <p className="font-mono text-[10px] text-muted-foreground">
                                {o.rank} · od {o.since}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-xs text-foreground/80">{o.division}</td>
                        <td className="px-6 py-3">
                          <DutyChip duty={o.duty} />
                        </td>
                        <td className="px-6 py-3">
                          <div className="h-1 w-12 overflow-hidden bg-muted">
                            <div
                              className={`h-full ${perfColor(o.performance)}`}
                              style={{ width: `${o.performance}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {visible.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center font-mono text-xs text-muted-foreground"
                      >
                        BRAK WYNIKÓW DLA ZAPYTANIA
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <header className="border-b border-border p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                Wnioski o przydział
              </p>
              <h2 className="font-display text-3xl tracking-wide">PODANIA DO JEDNOSTEK</h2>
            </header>
            <div className="flex-1 space-y-4 overflow-auto p-6">
              {apps.map((a) => (
                <article
                  key={a.id}
                  className="border border-border bg-surface p-5 transition-colors hover:border-accent/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] text-accent">
                        #{a.badge} · {a.date}
                      </p>
                      <h3 className="font-display text-2xl tracking-wide">{a.applicant}</h3>
                      <p className="mt-1 text-xs text-foreground/80">
                        Wnioskowana jednostka:{" "}
                        <span className="text-accent">{a.division}</span>
                      </p>
                      <p className="mt-2 max-w-xl text-xs text-muted-foreground">{a.motive}</p>
                    </div>
                    <span
                      className={
                        a.status === "OCZEKUJE"
                          ? "border border-warning px-2 py-0.5 font-mono text-[10px] text-warning"
                          : a.status === "ZATWIERDZONE"
                            ? "border border-success px-2 py-0.5 font-mono text-[10px] text-success"
                            : "border border-destructive px-2 py-0.5 font-mono text-[10px] text-destructive"
                      }
                    >
                      {a.status}
                    </span>
                  </div>
                  {a.status === "OCZEKUJE" && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => decideApp(a.id, true)}
                        className="bg-accent px-4 py-2 font-display text-xs tracking-widest text-accent-foreground hover:brightness-110"
                      >
                        ZATWIERDŹ
                      </button>
                      <button
                        onClick={() => decideApp(a.id, false)}
                        className="border border-border px-4 py-2 font-display text-xs tracking-widest hover:bg-muted"
                      >
                        ODRZUĆ
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      {tab === "kadra" && selected && (
        <aside className="animate-dossier flex w-[480px] flex-col border-l border-border bg-surface">
          <div className="flex items-start justify-between border-b border-border p-6">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                Akta personalne
              </p>
              <h2 className="font-display text-3xl leading-tight">
                {selected.rank.toUpperCase()} {selected.name}
              </h2>
            </div>
            <span className="border border-border p-1 font-mono text-[10px]">
              {selected.badge}
            </span>
          </div>

          <div className="flex-1 space-y-8 overflow-auto p-8">
            <div className="flex gap-6">
              <img
                src={selected.fullPhoto ?? selected.photo}
                alt={`Zdjęcie służbowe: ${selected.name}`}
                width={512}
                height={640}
                className="h-52 w-40 border-2 border-accent/30 object-cover ring-4 ring-black/20"
              />
              <div className="flex-1 space-y-4">
                <div>
                  <p className="font-mono text-[9px] uppercase text-muted-foreground">
                    Status służby
                  </p>
                  {editing ? (
                    <select
                      value={selected.duty}
                      onChange={(e) =>
                        patch(selected.id, { duty: e.target.value as Duty })
                      }
                      className="w-full border border-border bg-muted px-2 py-1 font-mono text-xs"
                    >
                      {(["NA SŁUŻBIE", "PO SŁUŻBIE", "SZKOLENIE"] as Duty[]).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-display text-xl text-accent">{selected.duty}</p>
                  )}
                </div>

                <div>
                  <p className="font-mono text-[9px] uppercase text-muted-foreground">
                    Nr odznaki
                  </p>
                  {editing ? (
                    <input
                      value={selected.badge}
                      onChange={(e) => patch(selected.id, { badge: e.target.value })}
                      className="w-full border border-border bg-muted px-2 py-1 font-mono text-xs"
                    />
                  ) : (
                    <p className="font-mono text-sm text-accent">#{selected.badge}</p>
                  )}
                </div>

                <div>
                  <p className="font-mono text-[9px] uppercase text-muted-foreground">
                    Jednostka
                  </p>
                  {editing ? (
                    <select
                      value={selected.division}
                      onChange={(e) => patch(selected.id, { division: e.target.value })}
                      className="w-full border border-border bg-muted px-2 py-1 font-mono text-xs"
                    >
                      {Array.from(new Set([...DIVISIONS, selected.division])).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm leading-tight text-foreground/90">
                      {selected.division}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {selected.station} · {selected.unit}
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  <p className="font-mono text-[9px] uppercase text-muted-foreground">
                    Szkolenia
                  </p>
                  {editing ? (
                    <input
                      value={selected.trainings.join(" · ")}
                      onChange={(e) =>
                        patch(selected.id, {
                          trainings: e.target.value
                            .split("·")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full border border-border bg-muted px-2 py-1 font-mono text-xs"
                    />
                  ) : (
                    <p className="text-xs text-success">{selected.trainings.join(" · ")}</p>
                  )}
                </div>
              </div>
            </div>

            {editing && (
              <div className="space-y-3 border border-accent/30 bg-muted/40 p-4">
                <p className="font-mono text-[9px] uppercase tracking-widest text-accent">
                  Edycja danych
                </p>
                <input
                  value={selected.name}
                  onChange={(e) => patch(selected.id, { name: e.target.value.toUpperCase() })}
                  placeholder="NAZWISKO, IMIĘ"
                  className="w-full border border-border bg-background px-2 py-1 font-mono text-xs"
                />
                <input
                  value={selected.station}
                  onChange={(e) => patch(selected.id, { station: e.target.value })}
                  placeholder="Posterunek"
                  className="w-full border border-border bg-background px-2 py-1 font-mono text-xs"
                />
                <input
                  value={selected.unit}
                  onChange={(e) => patch(selected.id, { unit: e.target.value })}
                  placeholder="Jednostka patrolowa"
                  className="w-full border border-border bg-background px-2 py-1 font-mono text-xs"
                />
              </div>
            )}

            <div className="space-y-3">
              <h3 className="border-b border-border pb-1 font-display text-lg tracking-widest">
                STOPIEŃ SŁUŻBOWY
              </h3>
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-2xl text-accent">{selected.rank}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeRank(selected.id, 1)}
                    className="border border-success px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-success hover:bg-success/10"
                  >
                    Awansuj ▲
                  </button>
                  <button
                    onClick={() => changeRank(selected.id, -1)}
                    className="border border-destructive px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-destructive hover:bg-destructive/10"
                  >
                    Degraduj ▼
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="border-b border-border pb-1 font-display text-lg tracking-widest">
                PRZEBIEG SŁUŻBY
              </h3>
              <div className="space-y-3">
                {selected.history.map((h, i) => (
                  <div
                    key={`${h.code}-${i}`}
                    className="flex items-center justify-between border border-border bg-muted p-3"
                  >
                    <div>
                      <p className="font-mono text-[10px] text-accent">{h.code}</p>
                      <p className="text-xs">{h.text}</p>
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground">{h.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 border-t border-border bg-primary/20 p-6">
            <button
              onClick={() => setEditing((v) => !v)}
              className={
                editing
                  ? "flex-1 bg-accent py-3 font-display text-sm tracking-widest text-accent-foreground"
                  : "flex-1 border border-border py-3 font-display text-sm tracking-widest hover:bg-muted"
              }
            >
              {editing ? "ZAPISZ AKTA" : "EDYTUJ AKTA"}
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
