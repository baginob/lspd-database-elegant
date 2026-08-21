import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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
          "Wewnętrzna baza funkcjonariuszy LSPD: numery odznak, stopnie, jednostki, status służby i akta personalne.",
      },
      { property: "og:title", content: "LSPD — Baza funkcjonariuszy" },
      {
        property: "og:description",
        content:
          "Numery odznak, stopnie, jednostki, status służby i akta personalne funkcjonariuszy LSPD.",
      },
    ],
  }),
  component: Index,
});

type Duty = "NA SŁUŻBIE" | "PO SŁUŻBIE" | "SZKOLENIE";

type Officer = {
  badge: string;
  name: string;
  rank: string;
  division: string;
  duty: Duty;
  since: string;
  performance: number;
  photo: string;
};

const OFFICERS: Officer[] = [
  {
    badge: "#B-4471",
    name: "VANCE, ELIAS",
    rank: "Lieutenant",
    division: "Wydział Detektywów",
    duty: "NA SŁUŻBIE",
    since: "2006-04-11",
    performance: 92,
    photo: photoVance,
  },
  {
    badge: "#B-7821",
    name: "RHODES, SARAH",
    rank: "Sergeant",
    division: "Patrol — Mission Row",
    duty: "NA SŁUŻBIE",
    since: "2013-09-02",
    performance: 88,
    photo: photoRhodes,
  },
  {
    badge: "#B-9105",
    name: "MARKOVIC, IVAN",
    rank: "Officer II",
    division: "Akademia / Rekrut",
    duty: "SZKOLENIE",
    since: "2024-01-15",
    performance: 54,
    photo: photoMarkovic,
  },
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

const NAV = [
  { n: "01", label: "KADRA FUNKCJONARIUSZY" },
  { n: "02", label: "GRAFIK SŁUŻB" },
  { n: "03", label: "SPRZĘT SŁUŻBOWY" },
];

function Index() {
  const [selected, setSelected] = useState("#B-7821");
  const [query, setQuery] = useState("");

  const visible = OFFICERS.filter((o) =>
    (o.name + o.badge + o.division).toLowerCase().includes(query.toLowerCase()),
  );

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
          {NAV.map((item, i) => (
            <div
              key={item.n}
              className={
                i === 0
                  ? "flex cursor-pointer items-center gap-3 border-l-2 border-accent bg-primary/30 px-3 py-2 text-foreground"
                  : "group flex cursor-pointer items-center gap-3 px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              <span className="font-mono text-xs opacity-50 group-hover:opacity-100">
                {item.n}
              </span>
              <span className="font-display text-lg tracking-wide">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="space-y-6 border-t border-border p-6">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">
              Aktualnie w patrolu
            </p>
            <div className="flex items-end justify-between">
              <span className="font-display text-5xl">42</span>
              <span className="mb-2 font-mono text-[10px] text-muted-foreground">JEDNOSTEK</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-t border-border pt-2">
              <p className="font-mono text-[9px] text-muted-foreground">KADRA OGÓŁEM</p>
              <p className="font-display text-xl">82</p>
            </div>
            <div className="border-t border-border pt-2">
              <p className="font-mono text-[9px] text-muted-foreground">REKRUCI</p>
              <p className="font-display text-xl">07</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="animate-fade flex flex-1 flex-col overflow-hidden [animation-delay:100ms]">
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
          <div className="flex gap-2">
            <button className="border border-border bg-primary px-4 py-2 font-display text-xs tracking-widest transition-all hover:bg-accent hover:text-accent-foreground">
              FILTRY
            </button>
            <button className="bg-accent px-4 py-2 font-display text-xs tracking-widest text-accent-foreground transition-all hover:brightness-110">
              NOWY FUNKCJONARIUSZ
            </button>
          </div>
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
                const active = o.badge === selected;
                return (
                  <tr
                    key={o.badge}
                    onClick={() => setSelected(o.badge)}
                    className={
                      active
                        ? "cursor-pointer border-l-2 border-accent bg-primary/20 transition-colors hover:bg-primary/30"
                        : "cursor-pointer transition-colors hover:bg-muted"
                    }
                  >
                    <td className="px-6 py-3 font-mono text-xs text-accent">{o.badge}</td>
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
            </tbody>
          </table>
        </div>
      </main>

      <aside className="animate-dossier flex w-[480px] flex-col border-l border-border bg-surface">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent">
              Akta personalne
            </p>
            <h2 className="font-display text-4xl">SGT. SARAH RHODES</h2>
          </div>
          <span className="border border-border p-1 font-mono text-[10px]">B-7821</span>
        </div>

        <div className="flex-1 space-y-8 overflow-auto p-8">
          <div className="flex gap-6">
            <img
              src={photoRhodesFull}
              alt="Zdjęcie służbowe sierżant Sarah Rhodes"
              width={512}
              height={640}
              className="w-40 border-2 border-accent/30 object-cover ring-4 ring-black/20"
            />
            <div className="flex-1 space-y-4">
              <div>
                <p className="font-mono text-[9px] uppercase text-muted-foreground">
                  Status służby
                </p>
                <p className="font-display text-xl text-accent">NA SŁUŻBIE — PATROL</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase text-muted-foreground">
                  Przydział
                </p>
                <p className="text-sm leading-tight text-foreground/90">
                  Mission Row Station
                  <br />
                  Jednostka 1-ADAM-12
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase text-muted-foreground">
                  Certyfikaty
                </p>
                <p className="text-xs text-success">TASER · SWAT-BASIC · MEDIC</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="border-b border-border pb-1 font-display text-lg tracking-widest">
              PRZEBIEG SŁUŻBY
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border border-border bg-muted p-3">
                <div>
                  <p className="font-mono text-[10px] text-accent">2022-PR-118</p>
                  <p className="text-xs">AWANS NA STOPIEŃ SIERŻANTA</p>
                </div>
                <span className="font-mono text-[9px] text-muted-foreground">ZATWIERDZONE</span>
              </div>
              <div className="flex items-center justify-between border border-border bg-muted p-3">
                <div>
                  <p className="font-mono text-[10px] text-accent">2019-CM-042</p>
                  <p className="text-xs">MEDAL ZA ODWAGĘ W SŁUŻBIE</p>
                </div>
                <span className="font-mono text-[9px] text-muted-foreground">ODZNACZENIE</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 opacity-50">
            <h3 className="border-b border-border pb-1 font-display text-lg tracking-widest">
              POJAZD SŁUŻBOWY
            </h3>
            <div className="flex items-center gap-4 font-mono text-xs">
              <span className="border border-border bg-primary px-2 py-1">LSPD-1412</span>
              <span>Vapid Scout (radiowóz)</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 border-t border-border bg-primary/20 p-6">
          <button className="flex-1 bg-accent py-3 font-display text-sm tracking-widest text-accent-foreground">
            PRZYDZIEL SŁUŻBĘ
          </button>
          <button className="flex-1 border border-border py-3 font-display text-xs tracking-widest hover:bg-muted">
            EDYTUJ AKTA
          </button>
        </div>
      </aside>
    </div>
  );
}
