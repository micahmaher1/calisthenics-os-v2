"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProfile, saveProfile, loadAvatar } from "@/lib/profile-storage";
import { loadState } from "@/lib/storage";
import { loadTreeState, getTotalCompleted, getTotalNodes } from "@/lib/skilltree-engine";
import { loadAchievementState } from "@/lib/achievement-storage";
import { loadQuestState } from "@/lib/quest-storage";
import { loadShopState } from "@/lib/shop-storage";
import { calcCurrentStreak, calcPersonalRecords } from "@/lib/stats";
import { calcLevelProgress, calcXPToNextLevel, getRankInfo, getRankLabel } from "@/lib/xp";
import { calcRankProgress } from "@/lib/progression";
import { EXPERIENCE_LABELS } from "@/lib/profile-types";
import { formatHeight, formatWeight } from "@/lib/profile-utils";
import { UserProfile, UserGoal } from "@/lib/profile-types";
import { AppState } from "@/lib/types";
import { BORDER_MAP, THEME_MAP, ShopState } from "@/lib/shop-types";
import { SHOP_ITEM_MAP } from "@/lib/shop-data";

import Header from "@/components/Header";
import ProfileAvatar from "./ProfileAvatar";
import ProfileEditForm from "./ProfileEditForm";
import GoalsSection from "./GoalsSection";
import { CSSProperties } from "react";

export default function ProfilePage() {
  const [profile,   setProfile]   = useState<UserProfile | null>(null);
  const [appState,  setAppState]  = useState<AppState | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [shopState, setShopState] = useState<ShopState | null>(null);
  const [editing,   setEditing]   = useState(false);
  const [saved,     setSaved]     = useState(false);

  const [completedSkillIds, setCompletedSkillIds] = useState<Set<string>>(new Set());
  const [treeTotal,  setTreeTotal]  = useState(0);
  const [treeDone,   setTreeDone]   = useState(0);
  const [questStats, setQuestStats] = useState({ total: 0, streak: 0 });

  useEffect(() => {
    setProfile(loadProfile());
    setAvatarUrl(loadAvatar());
    setShopState(loadShopState());

    const app = loadState();
    setAppState(app);

    const tree = loadTreeState();
    const done = getTotalCompleted(tree.progress);
    setTreeDone(done);
    const ids = new Set<string>();
    Object.entries(tree.progress).forEach(([id, p]) => {
      if (p.status === "completed") ids.add(id);
    });
    setCompletedSkillIds(ids);

    setTreeTotal(getTotalNodes());

    const qs = loadQuestState();
    setQuestStats({ total: qs.stats.totalCompleted, streak: qs.streak.current });
  }, []);

  if (!profile || !appState || !shopState) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">👤</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING PROFILE</span>
        </div>
      </div>
    );
  }

  const rank     = getRankLabel(appState.level);
  const rankInfo = getRankInfo(appState.level);
  const rankProg = calcRankProgress(appState.level);
  const levelProg  = calcLevelProgress(appState.totalXP);
  const xpToNext   = calcXPToNextLevel(appState.totalXP);
  const streak     = calcCurrentStreak(appState.workouts);
  const records    = calcPersonalRecords(appState.workouts);
  const achState   = loadAchievementState();
  const totalAch   = Object.values(achState.progress).filter((p) => p.unlocked).length;

  // Equipped cosmetics
  const eqBorderItem = shopState.equipped.borderId ? SHOP_ITEM_MAP[shopState.equipped.borderId] : null;
  const eqBorderDef  = eqBorderItem?.borderId ? BORDER_MAP[eqBorderItem.borderId] : null;
  const eqTitleItem  = shopState.equipped.titleId  ? SHOP_ITEM_MAP[shopState.equipped.titleId]  : null;
  const eqBadgeItem  = shopState.equipped.badgeId  ? SHOP_ITEM_MAP[shopState.equipped.badgeId]  : null;
  const eqThemeItem  = shopState.equipped.themeId  ? SHOP_ITEM_MAP[shopState.equipped.themeId]  : null;
  const eqThemeDef   = eqThemeItem?.themeId ? THEME_MAP[eqThemeItem.themeId] : null;

  const avatarRingStyle = eqBorderDef
    ? { boxShadow: eqBorderDef.glowStyle }
    : undefined;

  const handleSave = (updated: UserProfile) => {
    saveProfile(updated);
    setProfile(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleGoalUpdate = (goals: UserGoal[]) => {
    const updated = { ...profile, goals };
    saveProfile(updated);
    setProfile(updated);
  };

  const displayName = profile.displayName || profile.name || "Athlete";

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#4ade80 1px,transparent 1px),linear-gradient(90deg,#4ade80 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Theme-aware background glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: eqThemeDef ? `${eqThemeDef.accentHex}08` : "rgba(74,222,128,0.04)" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <Header rank={rank} level={appState.level} />

        {/* ── Profile Hero ── */}
        <section
          className="mt-8 relative overflow-hidden rounded-2xl bg-surface-800 border border-white/8 p-6 sm:p-8 noise"
          style={eqThemeDef ? { borderColor: `${eqThemeDef.accentHex}25` } : undefined}
        >
          {/* Theme-tinted top line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{
              background: eqThemeDef
                ? `linear-gradient(90deg, transparent, ${eqThemeDef.accentHex}80, transparent)`
                : "linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)",
            }}
          />

          <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none"
            style={{ background: eqThemeDef ? `${eqThemeDef.accentHex}08` : "rgba(74,222,128,0.05)" }}
          />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-6">
              {/* Avatar with equipped border */}
              <div className="relative">
                <div
                  className="w-28 h-28 rounded-full overflow-hidden bg-surface-700 border border-white/10 flex items-center justify-center flex-shrink-0 cursor-pointer"
                  style={avatarRingStyle ?? { boxShadow: `0 0 0 2px rgba(74,222,128,0.4)` }}
                  onClick={() => document.getElementById("av-upload")?.click()}
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display text-3xl text-white/60">
                      {(profile.displayName || profile.name || "A")[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                {eqBorderDef?.animClass && (
                  <div
                    className={`absolute inset-0 rounded-full ${eqBorderDef.animClass} pointer-events-none`}
                    style={{ background: eqBorderDef.previewGrad, opacity: 0.15 }}
                  />
                )}
                <input
                  id="av-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = (ev) => {
                      const url = ev.target?.result as string;
                      const { saveAvatar } = require("@/lib/profile-storage");
                      saveAvatar(url);
                      setAvatarUrl(url);
                    };
                    r.readAsDataURL(f);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* Name + rank info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-display text-3xl sm:text-4xl text-white tracking-wider">
                    {displayName}
                  </h1>
                  {saved && (
                    <span className="font-mono text-[9px] text-green-400 border border-green-500/25 bg-green-500/10 px-2 py-0.5 rounded-full">
                      Saved ✓
                    </span>
                  )}
                </div>

                {/* Equipped title */}
                {eqTitleItem?.titleText && (
                  <p className="font-mono text-xs text-white/50 mb-1.5 tracking-wider">{eqTitleItem.titleText}</p>
                )}
                {!eqTitleItem && profile.title && (
                  <p className="font-body text-sm text-white/40 mb-1.5">{profile.title}</p>
                )}

                {/* Equipped badge */}
                {eqBadgeItem?.badgeIcon && (
                  <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 mb-2">
                    <span>{eqBadgeItem.badgeIcon}</span>
                    <span className="font-mono text-[8px] text-white/50 uppercase tracking-widest">{eqBadgeItem.badgeLabel}</span>
                  </div>
                )}

                {profile.bio && (
                  <p className="font-body text-sm text-white/50 mb-3 max-w-lg leading-relaxed">{profile.bio}</p>
                )}

                {/* Rank badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${rankInfo.bgColor} ${rankInfo.borderColor} mb-3`}>
                  <span className="text-base">{rankInfo.icon}</span>
                  <span className={`font-display text-lg ${rankInfo.color}`}>{rank}</span>
                  <span className="font-mono text-[9px] text-white/30">Lv. {appState.level}</span>
                </div>

                {/* Level progress bar — theme-aware */}
                <div className="max-w-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">Level {appState.level}</span>
                    <span className="font-mono text-[8px] t-text">{xpToNext} XP to next</span>
                  </div>
                  <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
                    <div
                      className="h-full t-bar rounded-full progress-bar"
                      style={{ "--bar-width": `${levelProg}%` } as CSSProperties}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setEditing(!editing)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-[9px] uppercase tracking-widest border transition-all ${
                    editing
                      ? "border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10"
                      : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
                  }`}
                >
                  {editing ? "✕ Cancel" : "✏️ Edit"}
                </button>
                <Link
                  href="/shop"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-[9px] uppercase tracking-widest border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 transition-all text-center justify-center"
                >
                  🛒 Shop
                </Link>
              </div>
            </div>

            {/* Stat chips row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <ProfileStat icon="⚡" label="Total XP"     value={appState.totalXP.toLocaleString()} color="t-text" />
              <ProfileStat icon="🏋️" label="Workouts"    value={appState.workouts.length.toString()} color="text-white" />
              <ProfileStat icon="🔥" label="Streak"       value={`${streak}d`}                       color="text-orange-400" />
              <ProfileStat icon="🪙" label="Coins"        value={appState.coins.toLocaleString()}     color="text-yellow-400" />
              <ProfileStat icon="🌳" label="Skills"       value={`${treeDone}/${treeTotal}`}          color="text-purple-400" />
              <ProfileStat icon="🏆" label="Achievements" value={totalAch.toString()}                 color="text-amber-400" />
              <ProfileStat icon="⚔️"  label="Quests Done" value={questStats.total.toString()}         color="text-sky-400" />
              <ProfileStat icon="📈" label="Rank Progress" value={rankProg.pct + "%"}                 color={rankInfo.color} />
            </div>
          </div>
        </section>

        {/* ── Edit Form ── */}
        {editing && (
          <section className="mt-5 bg-surface-800 border border-white/8 rounded-2xl p-5 sm:p-6 animate-modal-up">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-5">Edit Profile</p>
            <ProfileEditForm
              profile={profile}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
            />
          </section>
        )}

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <section className="bg-surface-800 border border-white/8 rounded-2xl p-5">
              <GoalsSection
                profile={profile}
                records={records}
                level={appState.level}
                streak={streak}
                completedSkillIds={completedSkillIds}
                onUpdate={handleGoalUpdate}
              />
            </section>
          </div>

          <div className="space-y-5">
            {/* Equipped Cosmetics */}
            <section className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
              <div className="h-0.5 w-full t-line" />
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">Cosmetics</p>
                  <Link href="/shop" className="font-mono text-[8px] text-yellow-400 hover:text-yellow-300 transition-colors">
                    Shop →
                  </Link>
                </div>
                <div className="space-y-2.5">
                  <CosmeticRow icon="🏷️" label="Title"  value={eqTitleItem?.titleText ?? "None"} />
                  <CosmeticRow icon="🖼️" label="Border" value={eqBorderItem?.name ?? "Default"} />
                  <CosmeticRow
                    icon="🎨"
                    label="Theme"
                    value={eqThemeDef?.name ?? "Emerald"}
                    dot={eqThemeDef?.accentHex}
                  />
                  <CosmeticRow icon="📛" label="Badge"  value={eqBadgeItem?.badgeLabel ?? "None"} />
                </div>
              </div>
            </section>

            {/* Fitness Info */}
            <section className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
              <div className="p-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-4">Fitness Profile</p>
                <div className="space-y-3">
                  <FitnessRow label="Age"        value={profile.age ? `${profile.age} years` : "—"} />
                  <FitnessRow label="Height"     value={formatHeight(profile.heightCm, profile.heightUnit)} />
                  <FitnessRow label="Weight"     value={formatWeight(profile.weightKg, profile.weightUnit)} />
                  <FitnessRow label="Experience" value={EXPERIENCE_LABELS[profile.experience]} />
                  <FitnessRow label="Sport"      value={profile.primarySport || "—"} />
                  {profile.favoriteSkill && (
                    <FitnessRow label="Goal Skill" value={profile.favoriteSkill} />
                  )}
                  <div className="pt-2 border-t border-white/5 space-y-3">
                    <FitnessRow label="Current Rank"  value={`${rankInfo.icon} ${rank}`} />
                    <FitnessRow label="Current Level" value={`${appState.level}`} color="t-text" />
                    <FitnessRow label="Streak"        value={streak > 0 ? `${streak} days 🔥` : "No streak"} />
                  </div>
                </div>
              </div>
            </section>

            {/* Personal Records */}
            <section className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
              <div className="p-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-4">Personal Records</p>
                <div className="space-y-2.5">
                  <PRRow icon="💪" label="Push-Up PR"   value={`${records.maxPushUpReps} reps`} />
                  <PRRow icon="🦅" label="Pull-Up PR"   value={`${records.maxPullUpReps} reps`} />
                  <PRRow icon="⚡" label="Dip PR"       value={`${records.maxDipReps} reps`} />
                  <PRRow icon="🔥" label="Best Streak"  value={`${records.longestStreak} days`} />
                  <PRRow icon="⚡" label="Best Day XP"  value={`${records.highestDayXP} XP`} />
                  <PRRow icon="📅" label="Best Week XP" value={`${records.highestWeekXP} XP`} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProfileStat({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="bg-surface-700 border border-white/5 rounded-xl px-3 py-2.5 flex items-center gap-2">
      <span className="text-lg leading-none">{icon}</span>
      <div>
        <p className="font-mono text-[8px] uppercase tracking-widest text-white/25 leading-none mb-0.5">{label}</p>
        <p className={`font-display text-lg leading-none ${color}`}>{value}</p>
      </div>
    </div>
  );
}

function FitnessRow({ label, value, color = "text-white" }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">{label}</span>
      <span className={`font-body text-sm font-semibold ${color}`}>{value}</span>
    </div>
  );
}

function PRRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-base w-6 text-center">{icon}</span>
      <span className="flex-1 font-mono text-[9px] text-white/40 uppercase tracking-widest">{label}</span>
      <span className="font-display text-base text-white">{value}</span>
    </div>
  );
}

function CosmeticRow({ icon, label, value, dot }: { icon: string; label: string; value: string; dot?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{icon}</span>
        <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {dot && <div className="w-2.5 h-2.5 rounded-full" style={{ background: dot }} />}
        <span className="font-body text-xs font-semibold text-white">{value}</span>
      </div>
    </div>
  );
}
