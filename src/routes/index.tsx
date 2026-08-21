import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import mugshotVance from "@/assets/mugshot-vance.jpg";
import mugshotRhodes from "@/assets/mugshot-rhodes.jpg";
import mugshotMarkovic from "@/assets/mugshot-markovic.jpg";
import dossierRhodes from "@/assets/dossier-rhodes.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LSPD — Baza danych obywateli i kartotek" },
      {
        name: "description",
        content:
          "Wewnętrzny system kartotek LSPD: wyszukiwanie obywateli, nakazy aresztowania, historia kryminalna i rejestr pojazdów.",
      },
      { property: "og:title", content: "LSPD — Baza danych obywateli i kartotek" },
      {
        property: "og:description",
        content:
          "Wewnętrzny system kartotek LSPD: wyszukiwanie obywateli, nakazy, historia kryminalna i rejestr pojazdów.",
      },
    ],
  }),
  component: Index,
});

type Status = "WANTED" | "CLEAR" | "PAROLE";

type Record = {
  uid: string;
  name: string;
  dob: string;
  status: Status;
  contact: string;
  risk: number;
  photo: string;
};

const RECORDS: Record[] = [
  {
    uid: "#LS-88192-K",
    name: "VANCE, ELIAS",
    dob: "05-12-1981",
    status: "WANTED",
    contact: "2024-10-12 14:32",
    risk: 90,
    photo: mugshotVance,
  },
  {
    uid: "#LS-77210-A",
    name: "RHODES, SARAH",
    dob: "11-03-1994",
    status: "CLEAR",
    contact: "2024-11-01 09:15",
    risk: 20,
    photo: mugshotRhodes,
  },
  {
    uid: "#LS-91022-X",
    name: "MARKOVIC, IVAN",
    dob: "19-08-2001",
    status: "PAROLE",
    contact: "2024-10-28 22:44",
    risk: 55,
    photo: mugshotMarkovic,
  },
];

function StatusChip({ status }: { status: Status }) {
  if (status === "WANTED") {
    return (
      <span className="border border-accent bg-accent/5 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
        Wanted
      </span>
    );
  }
  if (status === "PAROLE") {
    return (
      <span className="border border-foreground/40 bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Parole
      </span>
    );
  }
  return (
    <span className="border border-foreground/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/70">
      Clear
    </span>
  );
}

function riskColor(risk: number) {
  if (risk >= 75) return "bg-destructive";
  if (risk >= 40) return "bg-warning";
  return "bg-success";
}

const NAV = [
  { n: "01", label: "KARTOTEKI OBYWATELI" },
  { n: "02", label: "REJESTR ZDARZEŃ" },
  { n: "03", label: "MAGAZYN DOWODÓW" },
];

function Index() {
  const [selected, setSelected] = useState("#LS-77210-A");
  const [query, setQuery] = useState("");

  const visible = RECORDS.filter((r) =>
    (r.name + r.uid).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen overflow-hidden bg-background font-body text-foreground">
      <aside className="animate-fade flex w-72 shrink-0 flex-col border-r border-border">
        <div className="border-b border-border p-6">
          <h1 className="font-display text-4xl tracking-wider text-accent">LSPD</h1>
          <p className="font-mono text-[10px] tracking-tighter text-muted-foreground">
            SYSTEM KARTOTEK v4.0.2
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
              Aktywne alerty
            </p>
            <div className="flex items-end justify-between">
              <span className="font-display text-5xl">14</span>
              <span className="mb-2 font-mono text-[10px] text-muted-foreground">NAKAZY</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-t border-border pt-2">
              <p className="font-mono text-[9px] text-muted-foreground">FUNKCJONARIUSZE</p>
              <p className="font-display text-xl">82</p>
            </div>
            <div className="border-t border-border pt-2">
              <p className="font-mono text-[9px] text-muted-foreground">OCZEKUJĄCE</p>
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
              placeholder="ID, NAZWISKO LUB NR REJESTRACYJNY..."
              className="w-full border border-border bg-muted py-3 pl-24 pr-4 font-mono text-sm uppercase transition-colors placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="border border-border bg-primary px-4 py-2 font-display text-xs tracking-widest transition-all hover:bg-accent hover:text-accent-foreground">
              FILTRY
            </button>
            <button className="bg-accent px-4 py-2 font-display text-xs tracking-widest text-accent-foreground transition-all hover:brightness-110">
              NOWY WPIS
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
              <tr className="border-b border-border">
                {["UID", "Dane obywatela", "Status", "Ostatni kontakt", "Ryzyko"].map((h) => (
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
              {visible.map((r) => {
                const active = r.uid === selected;
                return (
                  <tr
                    key={r.uid}
                    onClick={() => setSelected(r.uid)}
                    className={
                      active
                        ? "cursor-pointer border-l-2 border-accent bg-primary/20 transition-colors hover:bg-primary/30"
                        : "cursor-pointer transition-colors hover:bg-muted"
                    }
                  >
                    <td className="px-6 py-3 font-mono text-xs text-accent">{r.uid}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-4">
                        <img
                          src={r.photo}
                          alt={`Zdjęcie policyjne: ${r.name}`}
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
                            {r.name}
                          </p>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            DOB: {r.dob}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <StatusChip status={r.status} />
                    </td>
                    <td className="px-6 py-3 font-mono text-xs">{r.contact}</td>
                    <td className="px-6 py-3">
                      <div className="h-1 w-12 overflow-hidden bg-muted">
                        <div
                          className={`h-full ${riskColor(r.risk)}`}
                          style={{ width: `${r.risk}%` }}
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
              Akta sprawy
            </p>
            <h2 className="font-display text-4xl">SARAH RHODES</h2>
          </div>
          <span className="border border-border p-1 font-mono text-[10px]">REC_77210A</span>
        </div>

        <div className="flex-1 space-y-8 overflow-auto p-8">
          <div className="flex gap-6">
            <img
              src={dossierRhodes}
              alt="Zdjęcie policyjne Sarah Rhodes"
              width={512}
              height={640}
              className="w-40 border-2 border-accent/30 object-cover ring-4 ring-black/20"
            />
            <div className="flex-1 space-y-4">
              <div>
                <p className="font-mono text-[9px] uppercase text-muted-foreground">
                  Aktualny status
                </p>
                <p className="font-display text-xl text-accent">BRAK NAKAZÓW</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase text-muted-foreground">
                  Ostatni znany adres
                </p>
                <p className="text-sm leading-tight text-foreground/90">
                  322 Altair St, Apt 4C
                  <br />
                  Little Seoul, Los Santos
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase text-muted-foreground">
                  Prawo jazdy
                </p>
                <p className="text-xs text-success">WAŻNE (DO 2026)</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="border-b border-border pb-1 font-display text-lg tracking-widest">
              HISTORIA KRYMINALNA
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border border-border bg-muted p-3">
                <div>
                  <p className="font-mono text-[10px] text-accent">2023-AR-409</p>
                  <p className="text-xs">POSIADANIE SUBSTANCJI KONTROLOWANYCH</p>
                </div>
                <span className="font-mono text-[9px] text-muted-foreground">UMORZONE</span>
              </div>
              <div className="flex items-center justify-between border border-border bg-muted p-3">
                <div>
                  <p className="font-mono text-[10px] text-accent">2021-AR-112</p>
                  <p className="text-xs">NIEBEZPIECZNA JAZDA (PRZESTĘPSTWO)</p>
                </div>
                <span className="font-mono text-[9px] text-muted-foreground">WINNA / NADZÓR</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 opacity-50">
            <h3 className="border-b border-border pb-1 font-display text-lg tracking-widest">
              REJESTR POJAZDÓW
            </h3>
            <div className="flex items-center gap-4 font-mono text-xs">
              <span className="border border-border bg-primary px-2 py-1">44XJA102</span>
              <span>Declasse Granger (biały)</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 border-t border-border bg-primary/20 p-6">
          <button className="flex-1 bg-accent py-3 font-display text-sm tracking-widest text-accent-foreground">
            WYSTAW NAKAZ
          </button>
          <button className="flex-1 border border-border py-3 font-display text-xs tracking-widest hover:bg-muted">
            EDYTUJ WPIS
          </button>
        </div>
      </aside>
    </div>
  );
}
