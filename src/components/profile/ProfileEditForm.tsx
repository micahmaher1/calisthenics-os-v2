"use client";

import { useState } from "react";
import { UserProfile, EXPERIENCE_LABELS, TrainingExperience } from "@/lib/profile-types";

interface Props {
  profile:  UserProfile;
  onSave:   (updated: UserProfile) => void;
  onCancel: () => void;
}

export default function ProfileEditForm({ profile, onSave, onCancel }: Props) {
  const [form, setForm] = useState({ ...profile });

  const set = <K extends keyof UserProfile>(key: K, val: UserProfile[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const setNum = (key: "age" | "heightCm" | "weightKg", raw: string) => {
    const n = raw === "" ? null : Number(raw);
    set(key, (n === null || isNaN(n) ? null : n) as UserProfile[typeof key]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Identity */}
      <Section title="Identity">
        <Row label="Display Name" hint="Shown across the app">
          <Input
            value={form.displayName}
            onChange={(v) => set("displayName", v)}
            placeholder="e.g. Iron Mike"
            maxLength={32}
          />
        </Row>
        <Row label="Full Name" hint="Optional">
          <Input
            value={form.name}
            onChange={(v) => set("name", v)}
            placeholder="e.g. Michael Jordan"
            maxLength={64}
          />
        </Row>
        <Row label="Profile Title" hint="Short tagline under your name">
          <Input
            value={form.title}
            onChange={(v) => set("title", v)}
            placeholder="e.g. Calisthenics Enthusiast"
            maxLength={48}
          />
        </Row>
        <Row label="Bio" hint="Tell people about yourself">
          <textarea
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            placeholder="e.g. Training calisthenics for 2 years, focused on strength and mobility..."
            maxLength={280}
            rows={3}
            className="w-full bg-surface-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-green-500/50 resize-none font-body"
          />
          <p className="font-mono text-[8px] text-white/20 text-right mt-1">{form.bio.length}/280</p>
        </Row>
      </Section>

      {/* Fitness Info */}
      <Section title="Fitness Info">
        <div className="grid grid-cols-2 gap-4">
          <Row label="Age">
            <Input
              type="number"
              value={form.age?.toString() ?? ""}
              onChange={(v) => setNum("age", v)}
              placeholder="e.g. 25"
              min={10}
              max={100}
            />
          </Row>
          <Row label="Experience">
            <select
              value={form.experience}
              onChange={(e) => set("experience", e.target.value as TrainingExperience)}
              className="w-full bg-surface-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-500/50 font-body"
            >
              {(Object.keys(EXPERIENCE_LABELS) as TrainingExperience[]).map((k) => (
                <option key={k} value={k}>{EXPERIENCE_LABELS[k]}</option>
              ))}
            </select>
          </Row>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Row label="Height">
            <div className="flex gap-2">
              <Input
                type="number"
                value={form.heightCm?.toString() ?? ""}
                onChange={(v) => setNum("heightCm", v)}
                placeholder="170"
                min={100}
                max={250}
                className="flex-1"
              />
              <select
                value={form.heightUnit}
                onChange={(e) => set("heightUnit", e.target.value as "cm" | "ft")}
                className="bg-surface-700 border border-white/10 rounded-xl px-2 text-sm text-white focus:outline-none"
              >
                <option value="cm">cm</option>
                <option value="ft">ft</option>
              </select>
            </div>
          </Row>
          <Row label="Weight">
            <div className="flex gap-2">
              <Input
                type="number"
                value={form.weightKg?.toString() ?? ""}
                onChange={(v) => setNum("weightKg", v)}
                placeholder="70"
                min={30}
                max={300}
                className="flex-1"
              />
              <select
                value={form.weightUnit}
                onChange={(e) => set("weightUnit", e.target.value as "kg" | "lbs")}
                className="bg-surface-700 border border-white/10 rounded-xl px-2 text-sm text-white focus:outline-none"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          </Row>
        </div>

        <Row label="Primary Sport / Focus">
          <Input
            value={form.primarySport}
            onChange={(v) => set("primarySport", v)}
            placeholder="e.g. Calisthenics, Street Workout"
            maxLength={48}
          />
        </Row>
        <Row label="Favourite Skill Goal">
          <Input
            value={form.favoriteSkill}
            onChange={(v) => set("favoriteSkill", v)}
            placeholder="e.g. Front Lever, Muscle-Up"
            maxLength={48}
          />
        </Row>
      </Section>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-white/10 font-mono text-sm text-white/40 hover:text-white/60 hover:border-white/20 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-400 font-display text-lg tracking-widest text-black transition-all active:scale-[0.98]"
        >
          SAVE
        </button>
      </div>
    </form>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-3">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <label className="font-body text-xs font-semibold text-white/60">{label}</label>
        {hint && <span className="font-mono text-[8px] text-white/25">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Input({
  value, onChange, placeholder, type = "text", min, max, maxLength, className = "",
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
  min?: number; max?: number; maxLength?: number; className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      maxLength={maxLength}
      className={`w-full bg-surface-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-green-500/50 font-body ${className}`}
    />
  );
}
