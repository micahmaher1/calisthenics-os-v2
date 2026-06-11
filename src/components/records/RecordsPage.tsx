"use client";

import { useEffect, useState, useCallback } from "react";
import { loadState } from "@/lib/storage";
import { loadRecordsState, saveRecordsState, addCustomRecord, updateCustomRecord, deleteCustomRecord } from "@/lib/records-storage";
import {
  evaluateRecords, buildMilestoneGroups, buildInsights,
  buildCategoryStrengths, buildBadges, getTopRecords, getRecentPRs,
} from "@/lib/records-engine";
import { RecordsState, CustomRecord, SkillMilestone } from "@/lib/records-types";
import { AppState } from "@/lib/types";
import PageHeader from "@/components/ui/PageHeader";
import Header from "@/components/Header";
import { getRankLabel } from "@/lib/xp";
import RecordCard from "./RecordCard";
import MilestoneTracker from "./MilestoneTracker";
import RecordTimeline from "./RecordTimeline";
import InsightsSection from "./InsightsSection";
import CategoryRecordsSection from "./CategoryRecordsSection";
import RecordBadgesSection from "./RecordBadgesSection";
import CategoryStrengthsCard from "./CategoryStrengthsCard";

type Tab = "records" | "strengths" | "milestones" | "skills" | "timeline" | "insights" | "custom";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "records",    label: "Records",    icon: "🏅" },
  { key: "strengths",  label: "Strengths",  icon: "📊" },
  { key: "milestones", label: "Milestones", icon: "🎯" },
  { key: "skills",     label: "Skills",     icon: "⭐" },
  { key: "timeline",   label: "Timeline",   icon: "📅" },
  { key: "insights",   label: "Insights",   icon: "💡" },
  { key: "custom",     label: "Custom",     icon: "⚙️" },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  return `${d} days ago`;
}

const UNIT_SHORT: Record<string, string> = {
  reps: "", seconds: "s", minutes: "min", count: "", custom: "",
};

export default function RecordsPage() {
  const [appState,     setAppState]     = useState<AppState | null>(null);
  const [recState,     setRecState]     = useState<RecordsState | null>(null);
  const [activeTab,    setActiveTab]    = useState<Tab>("records");
  const [level,        setLevel]        = useState(1);
  const [rank,         setRank]         = useState("Beginner");

  const [showNewForm,  setShowNewForm]  = useState(false);
  const [newName,      setNewName]      = useState("");
  const [newUnit,      setNewUnit]      = useState("");
  const [updateId,     setUpdateId]     = useState<string | null>(null);
  const [updateVal,    setUpdateVal]    = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const app = loadState();
    setAppState(app);
    setLevel(app.level);
    setRank(getRankLabel(app.level));
    let rec = loadRecordsState();
    const { newState } = evaluateRecords(rec, app.workouts);
    rec = newState;
    saveRecordsState(rec);
    setRecState(rec);
  }, []);

  const handleAddCustom = useCallback(() => {
    if (!recState || !newName.trim() || !newUnit.trim()) return;
    const next = addCustomRecord(recState, newName.trim(), newUnit.trim());
    saveRecordsState(next);
    setRecState(next);
    setNewName("");
    setNewUnit("");
    setShowNewForm(false);
  }, [recState, newName, newUnit]);

  const handleUpdateCustom = useCallback((id: string) => {
    if (!recState) return;
    const val = parseFloat(updateVal);
    if (isNaN(val)) return;
    const next = updateCustomRecord(recState, id, val);
    saveRecordsState(next);
    setRecState(next);
    setUpdateId(null);
    setUpdateVal("");
  }, [recState, updateVal]);

  const handleDeleteCustom = useCallback((id: string) => {
    if (!recState) return;
    const next = deleteCustomRecord(recState, id);
    saveRecordsState(next);
    setRecState(next);
    setConfirmDeleteId(null);
  }, [recState]);

  if (!appState || !recState) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">🏅</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING RECORDS</span>
        </div>
      </div>
    );
  }

  const records         = Object.values(recState.records);
  const milGroups       = buildMilestoneGroups(recState);
  const insights        = buildInsights(recState);
  const skillMiles      = Object.values(recState.skillMilestones);
  const achievedSkills  = skillMiles.filter((s) => s.achieved);
  const unachivedSkills = skillMiles.filter((s) => !s.achieved);
  const strengths       = buildCategoryStrengths(recState);
  const badges          = buildBadges(recState);
  const topRecords      = getTopRecords(recState, 3);
  const recentPRs       = getRecentPRs(recState, 3);

  const totalRecords    = records.filter((r) => r.current !== null).length;
  const totalMilestones = milGroups.reduce((acc, g) => acc + g.milestones.filter((m) => m.achieved).length, 0);
  const totalSkillMiles = achievedSkills.length;
  const totalPossible   = milGroups.reduce((acc, g) => acc + g.milestones.length, 0);

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#4ade80 1px,transparent 1px),linear-gradient(90deg,#4ade80 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] rounded-full bg-green-500/3 blur-3xl pointer-events-none" />

      <Header rank={rank} level={level} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        <PageHeader
          icon="🏆"
          title="Records"
          subtitle="Personal Hall of Fame"
          backHref="/"
          backLabel="Dashboard"
        />

        {/* Hero stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <HeroStat label="PRs Set"      value={totalRecords.toString()}                         icon="🏅" color="t-text"         />
          <HeroStat label="Milestones"   value={`${totalMilestones}/${totalPossible}`}           icon="🎯" color="text-yellow-400" />
          <HeroStat label="Skill Badges" value={`${totalSkillMiles}/${skillMiles.length}`}       icon="⭐" color="text-purple-400" />
          <HeroStat label="Workouts"     value={appState.workouts.length.toString()}             icon="🏋️" color="text-sky-400"    />
        </div>

        {/* Recent PR chips */}
        {recentPRs.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <span className="font-mono text-[8px] uppercase tracking-widest text-white/25 mr-1">Recent PRs:</span>
            {recentPRs.map((r) => {
              const ul   = UNIT_SHORT[r.unit] ?? r.unit;
              const date = r.current?.dateAchieved ? timeAgo(r.current.dateAchieved) : "";
              return (
                <span
                  key={r.exerciseName}
                  className="flex items-center gap-1 px-2.5 py-1 bg-surface-800 border border-white/10 rounded-full font-mono text-[8px] text-white/60"
                >
                  <span>🆕</span>
                  <span>{r.current?.value}{ul} {r.exerciseName}</span>
                  <span className="text-white/30">· {date}</span>
                </span>
              );
            })}
          </div>
        )}

        {/* Hall of Fame */}
        {topRecords.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏆</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Hall of Fame</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topRecords.map((r) => (
                <RecordCard key={r.exerciseName} record={r} isTopRecord />
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-[9px] uppercase tracking-widest transition-all ${
                activeTab === tab.key
                  ? "bg-white/12 border border-white/20 text-white"
                  : "border border-white/8 text-white/35 hover:text-white/60 hover:border-white/15"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Records tab ─────────────────────────────────────────────── */}
        {activeTab === "records" && (
          <>
            {records.filter((r) => r.current !== null).length === 0 ? (
              <EmptyState
                icon="🏅"
                title="No records yet"
                message={appState.workouts.length === 0
                  ? "Head to the Dashboard and log your first workout to set your first PR."
                  : "Log more workouts with specific exercises to build your record history."}
              />
            ) : (
              <div className="space-y-2">
                <CategoryRecordsSection records={recState.records} category="push" />
                <CategoryRecordsSection records={recState.records} category="pull" />
                <CategoryRecordsSection records={recState.records} category="core" />
                <CategoryRecordsSection records={recState.records} category="skill" />
              </div>
            )}
          </>
        )}

        {/* ── Strengths tab ────────────────────────────────────────────── */}
        {activeTab === "strengths" && (
          <div className="space-y-6">
            <CategoryStrengthsCard strengths={strengths} />
            <RecordBadgesSection badges={badges} />
          </div>
        )}

        {/* ── Milestones tab ──────────────────────────────────────────── */}
        {activeTab === "milestones" && (
          <MilestoneTracker groups={milGroups} />
        )}

        {/* ── Skills tab ──────────────────────────────────────────────── */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            {achievedSkills.length > 0 && (
              <>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">
                  Achieved ({achievedSkills.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {achievedSkills.map((sm) => (
                    <SkillMilestoneCard key={sm.id} milestone={sm} />
                  ))}
                </div>
              </>
            )}
            {unachivedSkills.length > 0 && (
              <>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/30 mt-4">
                  Locked ({unachivedSkills.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {unachivedSkills.map((sm) => (
                    <SkillMilestoneCard key={sm.id} milestone={sm} locked />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Timeline tab ────────────────────────────────────────────── */}
        {activeTab === "timeline" && (
          <RecordTimeline records={recState.records} />
        )}

        {/* ── Insights tab ────────────────────────────────────────────── */}
        {activeTab === "insights" && (
          <>
            {insights.length === 0 ? (
              <EmptyState
                icon="💡"
                title="No insights yet"
                message="Log more workouts to generate personalised insights."
              />
            ) : (
              <InsightsSection insights={insights} />
            )}
          </>
        )}

        {/* ── Custom tab ──────────────────────────────────────────────── */}
        {activeTab === "custom" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">
                Custom Records ({recState.customRecords.length})
              </p>
              <button
                onClick={() => setShowNewForm(!showNewForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-white/15 bg-white/6 rounded-xl font-mono text-[9px] uppercase tracking-widest text-white/60 hover:text-white hover:border-white/25 transition-all"
              >
                + New Record
              </button>
            </div>

            {showNewForm && (
              <div className="bg-surface-800 border border-white/10 rounded-2xl p-4 space-y-3">
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">New Custom Record</p>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Exercise name (e.g. Handstand Hold)"
                  className="w-full bg-surface-700 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/25"
                />
                <input
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  placeholder="Unit (e.g. seconds, reps, kg)"
                  className="w-full bg-surface-700 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/25"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNewForm(false)}
                    className="flex-1 py-2 border border-white/8 rounded-xl font-mono text-[9px] uppercase tracking-widest text-white/30 hover:text-white/50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCustom}
                    className="flex-1 py-2 t-bg border t-border rounded-xl font-mono text-[9px] uppercase tracking-widest t-text hover:opacity-80 transition-all"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            {recState.customRecords.length === 0 && !showNewForm && (
              <EmptyState
                icon="⚙️"
                title="No custom records"
                message="Track any exercise you want — handstand holds, L-sits, or anything else."
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recState.customRecords.map((cr) => (
                <CustomRecordCard
                  key={cr.id}
                  record={cr}
                  isUpdating={updateId === cr.id}
                  updateVal={updateVal}
                  confirmingDelete={confirmDeleteId === cr.id}
                  onStartUpdate={() => { setUpdateId(cr.id); setUpdateVal(""); }}
                  onUpdateValChange={setUpdateVal}
                  onConfirmUpdate={() => handleUpdateCustom(cr.id)}
                  onCancelUpdate={() => setUpdateId(null)}
                  onRequestDelete={() => setConfirmDeleteId(cr.id)}
                  onConfirmDelete={() => handleDeleteCustom(cr.id)}
                  onCancelDelete={() => setConfirmDeleteId(null)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroStat({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="font-mono text-[8px] uppercase tracking-widest text-white/30">{label}</span>
      </div>
      <p className={`font-display text-2xl ${color}`}>{value}</p>
    </div>
  );
}

function SkillMilestoneCard({ milestone, locked }: { milestone: SkillMilestone; locked?: boolean }) {
  const date = milestone.dateAchieved
    ? new Date(milestone.dateAchieved).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all ${
      locked
        ? "border-white/6 bg-surface-800/50 opacity-50"
        : "border-green-500/20 bg-green-500/6"
    }`}>
      <span className="text-2xl flex-shrink-0">{milestone.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-semibold text-white">{milestone.name}</p>
        <p className="font-mono text-[9px] text-white/35">{milestone.description}</p>
        {!locked && date && (
          <p className="font-mono text-[8px] text-green-400/70 mt-0.5">{date}</p>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        {locked ? (
          <span className="text-lg">🔒</span>
        ) : (
          <span className="font-mono text-[8px] text-green-400/70">+{milestone.xpReward} XP</span>
        )}
      </div>
    </div>
  );
}

function CustomRecordCard({
  record, isUpdating, updateVal, confirmingDelete,
  onStartUpdate, onUpdateValChange, onConfirmUpdate, onCancelUpdate,
  onRequestDelete, onConfirmDelete, onCancelDelete,
}: {
  record:             CustomRecord;
  isUpdating:         boolean;
  updateVal:          string;
  confirmingDelete:   boolean;
  onStartUpdate:      () => void;
  onUpdateValChange:  (v: string) => void;
  onConfirmUpdate:    () => void;
  onCancelUpdate:     () => void;
  onRequestDelete:    () => void;
  onConfirmDelete:    () => void;
  onCancelDelete:     () => void;
}) {
  const histSlice = record.history.slice(-5);
  const maxVal    = Math.max(...histSlice.map((h) => h.value), record.currentValue ?? 0, 1);

  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="font-body text-sm font-semibold text-white">{record.name}</p>
          <p className="font-mono text-[9px] text-white/30">Unit: {record.unit}</p>
        </div>
        {confirmingDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={onConfirmDelete}
              className="font-mono text-[8px] text-red-400 border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded-lg hover:bg-red-500/20 transition-all"
            >
              Delete
            </button>
            <button
              onClick={onCancelDelete}
              className="font-mono text-[8px] text-white/30 hover:text-white/60 transition-colors px-1"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={onRequestDelete}
            className="font-mono text-[8px] text-white/20 hover:text-red-400 transition-colors"
          >
            🗑
          </button>
        )}
      </div>

      {record.currentValue !== null ? (
        <div className="flex items-end gap-1.5 mb-3">
          <span className="font-display text-3xl t-text">{record.currentValue}</span>
          <span className="font-mono text-xs text-white/40 mb-0.5">{record.unit}</span>
        </div>
      ) : (
        <p className="font-mono text-[9px] text-white/25 mb-3">No value set yet</p>
      )}

      {histSlice.length > 1 && (
        <div className="flex items-end gap-0.5 h-5 mb-3">
          {histSlice.map((h, i) => (
            <div
              key={i}
              className="flex-1 t-bar rounded-sm opacity-60"
              style={{ height: `${Math.max(15, (h.value / maxVal) * 100)}%` }}
            />
          ))}
        </div>
      )}

      {isUpdating ? (
        <div className="flex gap-2">
          <input
            autoFocus
            type="number"
            value={updateVal}
            onChange={(e) => onUpdateValChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onConfirmUpdate(); if (e.key === "Escape") onCancelUpdate(); }}
            placeholder={`New value in ${record.unit}`}
            className="flex-1 bg-surface-700 border border-white/15 rounded-lg px-2 py-1.5 font-mono text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
          />
          <button
            onClick={onConfirmUpdate}
            className="px-3 py-1.5 t-bg border t-border rounded-lg font-mono text-[8px] uppercase tracking-widest t-text hover:opacity-80 transition-all"
          >
            Save
          </button>
          <button
            onClick={onCancelUpdate}
            className="px-2 py-1.5 border border-white/8 rounded-lg font-mono text-[8px] text-white/30 hover:text-white/50 transition-all"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={onStartUpdate}
          className="w-full py-1.5 border border-white/10 rounded-lg font-mono text-[8px] uppercase tracking-widest text-white/40 hover:text-white/60 hover:border-white/20 transition-all"
        >
          Update Record
        </button>
      )}
    </div>
  );
}

function EmptyState({ icon, title, message }: { icon: string; title: string; message: string }) {
  return (
    <div className="text-center py-16 border border-dashed border-white/8 rounded-2xl">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="font-body text-base font-semibold text-white/60 mb-1">{title}</p>
      <p className="font-mono text-[9px] text-white/25">{message}</p>
    </div>
  );
}
