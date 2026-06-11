import { V2SkillNode } from "./v2-skilltree-types";

// ─── Position helpers ─────────────────────────────────────────────────────────
// Category x-centers (spaced 250px apart, starting at 0)
// strength:0, balance:250, mobility:500, endurance:750, coordination:1000
// grip:1250, static_strength:1500, power:1750, explosiveness:2000, athleticism:2250

const CX: Record<string, number> = {
  strength:        0,
  balance:         250,
  mobility:        500,
  endurance:       750,
  coordination:    1000,
  grip:            1250,
  static_strength: 1500,
  power:           1750,
  explosiveness:   2000,
  athleticism:     2250,
};

// Tier Y values
const TY: Record<number, number> = {
  0: 0,
  1: 150,
  2: 350,
  3: 550,
  4: 750,
  5: 950,
  6: 1150,
  7: 1350,
};

function midX(...cats: string[]): number {
  const vals = cats.map((c) => CX[c]).filter((v) => v !== undefined);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

// ─── Skill Data ───────────────────────────────────────────────────────────────

export const V2_SKILL_NODES: V2SkillNode[] = [

  // ── TIER 0: Foundation ──────────────────────────────────────────────────────
  {
    id: "foundation", name: "Foundation Training", category: "special", tier: 0,
    prerequisites: [], x: 1125, y: TY[0], xpCost: 0,
    description: "The starting point of your calisthenics journey. Complete basic movement assessments and begin your training.",
    icon: "⭐",
  },

  // ── TIER 1: Category Starters ───────────────────────────────────────────────
  {
    id: "strength_foundation", name: "Strength Foundations", category: "strength", tier: 1,
    prerequisites: ["foundation"], x: CX.strength, y: TY[1], xpCost: 50,
    description: "Learn the principles of bodyweight strength: tension, alignment, and progressive overload.",
    icon: "💪",
  },
  {
    id: "balance_foundation", name: "Balance Foundations", category: "balance", tier: 1,
    prerequisites: ["foundation"], x: CX.balance, y: TY[1], xpCost: 50,
    description: "Develop proprioception and stability through basic balance drills.",
    icon: "🤸",
  },
  {
    id: "mobility_foundation", name: "Mobility Foundations", category: "mobility", tier: 1,
    prerequisites: ["foundation"], x: CX.mobility, y: TY[1], xpCost: 50,
    description: "Establish baseline flexibility and joint health with fundamental mobility work.",
    icon: "🧘",
  },
  {
    id: "endurance_foundation", name: "Endurance Foundations", category: "endurance", tier: 1,
    prerequisites: ["foundation"], x: CX.endurance, y: TY[1], xpCost: 50,
    description: "Build aerobic capacity and muscular endurance for sustained performance.",
    icon: "🏃",
  },
  {
    id: "coordination_foundation", name: "Coordination Foundations", category: "coordination", tier: 1,
    prerequisites: ["foundation"], x: CX.coordination, y: TY[1], xpCost: 50,
    description: "Develop neuromuscular coordination through ground-based movement patterns.",
    icon: "🐻",
  },
  {
    id: "grip_foundation", name: "Grip Foundations", category: "grip", tier: 1,
    prerequisites: ["foundation"], x: CX.grip, y: TY[1], xpCost: 50,
    description: "Build foundational grip strength and hanging endurance for bar work.",
    icon: "✊",
  },
  {
    id: "static_foundation", name: "Core & Static Foundations", category: "static_strength", tier: 1,
    prerequisites: ["foundation"], x: CX.static_strength, y: TY[1], xpCost: 50,
    description: "Develop the isometric strength required for static holds and compression.",
    icon: "🗿",
  },
  {
    id: "power_foundation", name: "Power Foundations", category: "power", tier: 1,
    prerequisites: ["foundation"], x: CX.power, y: TY[1], xpCost: 50,
    description: "Learn to generate explosive force through basic jumping and loading patterns.",
    icon: "⚡",
  },
  {
    id: "explosive_foundation", name: "Explosive Foundations", category: "explosiveness", tier: 1,
    prerequisites: ["foundation"], x: CX.explosiveness, y: TY[1], xpCost: 50,
    description: "Build rate-of-force development and reactive ability through plyometric fundamentals.",
    icon: "💥",
  },
  {
    id: "athletic_foundation", name: "Athletic Foundations", category: "athleticism", tier: 1,
    prerequisites: ["foundation"], x: CX.athleticism, y: TY[1], xpCost: 50,
    description: "Establish athletic movement quality: speed, agility, and sport-specific conditioning.",
    icon: "🏅",
  },

  // ── TIER 2: Beginner Skills ──────────────────────────────────────────────────

  // STRENGTH
  {
    id: "push_up_basics", name: "Push-Up Basics", category: "strength", tier: 2,
    prerequisites: ["strength_foundation"], x: CX.strength - 30, y: TY[2], xpCost: 100,
    description: "Master the standard push-up with full range of motion. Foundation of all pressing movements.",
    icon: "🔽",
  },
  {
    id: "pull_up_basics", name: "Pull-Up Basics", category: "strength", tier: 2,
    prerequisites: ["strength_foundation"], x: CX.strength + 30, y: TY[2] + 60, xpCost: 100,
    description: "First pull-up progressions: scapular pulls, negatives, and assisted reps.",
    icon: "⬆️",
  },
  {
    id: "squat_basics", name: "Squat Basics", category: "strength", tier: 2,
    prerequisites: ["strength_foundation"], x: CX.strength - 60, y: TY[2] + 120, xpCost: 80,
    description: "Bodyweight squat mechanics — depth, alignment, and knee tracking.",
    icon: "🦵",
  },
  {
    id: "dip_basics", name: "Dip Basics", category: "strength", tier: 2,
    prerequisites: ["strength_foundation"], x: CX.strength + 60, y: TY[2] + 120, xpCost: 90,
    description: "Parallel bar dips focusing on full depression and controlled descent.",
    icon: "📉",
  },

  // BALANCE
  {
    id: "single_leg_balance", name: "Single Leg Balance", category: "balance", tier: 2,
    prerequisites: ["balance_foundation"], x: CX.balance - 30, y: TY[2], xpCost: 80,
    description: "Stand and perform movements on one leg. Builds ankle stability and unilateral control.",
    icon: "🦢",
  },
  {
    id: "wall_handstand", name: "Wall Handstand", category: "balance", tier: 2,
    prerequisites: ["balance_foundation"], x: CX.balance + 30, y: TY[2] + 80, xpCost: 120,
    description: "30-second handstand hold against a wall. Learn inversion, shoulder stacking, and wrist loading.",
    icon: "🔄",
  },
  {
    id: "body_control_basics", name: "Body Control Basics", category: "balance", tier: 2,
    prerequisites: ["balance_foundation"], x: CX.balance - 20, y: TY[2] + 130, xpCost: 90,
    description: "Slow, controlled movement drills teaching body awareness in multiple planes.",
    icon: "🎯",
  },

  // MOBILITY
  {
    id: "deep_squat_hold", name: "Deep Squat Hold", category: "mobility", tier: 2,
    prerequisites: ["mobility_foundation"], x: CX.mobility - 30, y: TY[2], xpCost: 70,
    description: "Hold a full depth squat for 2 minutes. Develops hip, knee, and ankle mobility.",
    icon: "⬇️",
  },
  {
    id: "shoulder_mobility", name: "Shoulder Mobility", category: "mobility", tier: 2,
    prerequisites: ["mobility_foundation"], x: CX.mobility + 30, y: TY[2] + 70, xpCost: 70,
    description: "Overhead reach, shoulder circles, and wall slides for full shoulder range of motion.",
    icon: "🔃",
  },
  {
    id: "hip_flexibility", name: "Hip Flexibility", category: "mobility", tier: 2,
    prerequisites: ["mobility_foundation"], x: CX.mobility - 15, y: TY[2] + 130, xpCost: 80,
    description: "Hip flexor stretches, pigeon pose, and lateral hip opening for lower body freedom.",
    icon: "🦀",
  },

  // ENDURANCE
  {
    id: "light_circuits", name: "Light Circuits", category: "endurance", tier: 2,
    prerequisites: ["endurance_foundation"], x: CX.endurance - 30, y: TY[2], xpCost: 80,
    description: "2-3 round circuits of basic movements performed without rest. Build work capacity.",
    icon: "🔁",
  },
  {
    id: "jogging", name: "Running Basics", category: "endurance", tier: 2,
    prerequisites: ["endurance_foundation"], x: CX.endurance + 30, y: TY[2] + 80, xpCost: 70,
    description: "Establish an aerobic base through consistent jogging and pacing work.",
    icon: "👟",
  },

  // COORDINATION
  {
    id: "bear_crawl", name: "Bear Crawl", category: "coordination", tier: 2,
    prerequisites: ["coordination_foundation"], x: CX.coordination - 30, y: TY[2], xpCost: 80,
    description: "Crawl on hands and feet with knees hovering. Full-body coordination and strength.",
    icon: "🐾",
  },
  {
    id: "crab_walk", name: "Crab Walk", category: "coordination", tier: 2,
    prerequisites: ["coordination_foundation"], x: CX.coordination + 30, y: TY[2] + 80, xpCost: 70,
    description: "Reverse table-top locomotion. Develops posterior chain coordination and shoulder strength.",
    icon: "🦀",
  },

  // GRIP
  {
    id: "dead_hang", name: "Dead Hang", category: "grip", tier: 2,
    prerequisites: ["grip_foundation"], x: CX.grip - 30, y: TY[2], xpCost: 80,
    description: "Full bodyweight passive hang from a bar. Builds grip, shoulder health, and spinal decompression.",
    icon: "🎯",
  },
  {
    id: "bar_hang_basics", name: "Bar Hang Basics", category: "grip", tier: 2,
    prerequisites: ["grip_foundation"], x: CX.grip + 30, y: TY[2] + 80, xpCost: 70,
    description: "Active hang with scapular engagement. Foundation for all bar pulling work.",
    icon: "🏋️",
  },

  // STATIC STRENGTH
  {
    id: "tuck_hold", name: "Tuck Hold", category: "static_strength", tier: 2,
    prerequisites: ["static_foundation"], x: CX.static_strength - 40, y: TY[2], xpCost: 100,
    description: "Tuck L-sit or tuck planche hold building hip flexor and pushing compression.",
    icon: "🔒",
  },
  {
    id: "support_hold", name: "Support Hold", category: "static_strength", tier: 2,
    prerequisites: ["static_foundation"], x: CX.static_strength + 40, y: TY[2] + 60, xpCost: 90,
    description: "Bar or parallel bar support hold with locked arms. Builds wrist, shoulder, and straight arm strength.",
    icon: "⬜",
  },
  {
    id: "hollow_body", name: "Hollow Body Hold", category: "static_strength", tier: 2,
    prerequisites: ["static_foundation"], x: CX.static_strength - 10, y: TY[2] + 120, xpCost: 90,
    description: "Banana shape on the floor — lower back pressed down, arms and legs raised. Gymnastics core fundamental.",
    icon: "🌙",
  },

  // POWER
  {
    id: "jump_basics", name: "Jump Training Basics", category: "power", tier: 2,
    prerequisites: ["power_foundation"], x: CX.power - 30, y: TY[2], xpCost: 80,
    description: "Vertical jumps and landing mechanics. Learn to generate force and absorb impact safely.",
    icon: "🦘",
  },
  {
    id: "explosive_squat", name: "Explosive Squats", category: "power", tier: 2,
    prerequisites: ["power_foundation"], x: CX.power + 30, y: TY[2] + 80, xpCost: 90,
    description: "Jump squats and speed squats focusing on rapid hip extension and triple extension.",
    icon: "⚡",
  },

  // EXPLOSIVENESS
  {
    id: "basic_plyometrics", name: "Basic Plyometrics", category: "explosiveness", tier: 2,
    prerequisites: ["explosive_foundation"], x: CX.explosiveness - 30, y: TY[2], xpCost: 90,
    description: "Box step-offs, pogo hops, and ankle stiffness drills for reactive ability.",
    icon: "🏃",
  },
  {
    id: "jumping_jacks", name: "Plyometric Foundations", category: "explosiveness", tier: 2,
    prerequisites: ["explosive_foundation"], x: CX.explosiveness + 30, y: TY[2] + 80, xpCost: 70,
    description: "Jumping jacks, skips, and bounding drills to build rhythmic explosiveness.",
    icon: "✨",
  },

  // ATHLETICISM
  {
    id: "sprint_mechanics", name: "Sprint Mechanics", category: "athleticism", tier: 2,
    prerequisites: ["athletic_foundation"], x: CX.athleticism - 30, y: TY[2], xpCost: 80,
    description: "Acceleration posture, arm drive, and stride rate fundamentals for fast movement.",
    icon: "🚀",
  },
  {
    id: "agility_basics", name: "Agility Basics", category: "athleticism", tier: 2,
    prerequisites: ["athletic_foundation"], x: CX.athleticism + 30, y: TY[2] + 80, xpCost: 80,
    description: "Ladder drills, cone patterns, and directional change fundamentals.",
    icon: "🔀",
  },

  // ── TIER 3: Intermediate Skills ──────────────────────────────────────────────

  // STRENGTH
  {
    id: "push_up_progression", name: "Push-Up Progressions", category: "strength", tier: 3,
    prerequisites: ["push_up_basics"], x: CX.strength - 30, y: TY[3], xpCost: 150,
    description: "Diamond, wide, incline, and decline push-up variations. Build complete pressing strength.",
    icon: "📈",
  },
  {
    id: "pull_up_progression", name: "Pull-Up Progressions", category: "strength", tier: 3,
    prerequisites: ["pull_up_basics"], x: CX.strength + 30, y: TY[3] + 60, xpCost: 180,
    description: "Strict pull-up for 10 reps. Wide, close, and neutral grip variations for complete lat development.",
    icon: "🏋️",
  },
  {
    id: "pistol_squat_progression", name: "Pistol Squat Progression", category: "strength", tier: 3,
    prerequisites: ["squat_basics"], x: CX.strength - 60, y: TY[3] + 120, xpCost: 160,
    description: "Assisted pistol squat, box pistol, and shrimp squat regressions toward full pistol.",
    icon: "🎯",
  },
  {
    id: "ring_dips", name: "Ring Dips", category: "strength", tier: 3,
    prerequisites: ["dip_basics"], x: CX.strength + 60, y: TY[3] + 120, xpCost: 170,
    description: "Dips on gymnastic rings adding instability. Massively increases chest, tricep, and stabilizer demand.",
    icon: "⭕",
  },

  // BALANCE
  {
    id: "headstand", name: "Headstand", category: "balance", tier: 3,
    prerequisites: ["wall_handstand", "body_control_basics"], x: CX.balance - 30, y: TY[3], xpCost: 150,
    description: "Tripod and forearm headstands. Inversion practice with neck and shoulder loading.",
    icon: "🔻",
  },
  {
    id: "freestanding_handstand", name: "Freestanding Handstand", category: "balance", tier: 3,
    prerequisites: ["wall_handstand"], x: CX.balance + 30, y: TY[3] + 80, xpCost: 220,
    description: "10-second freestanding handstand. The cornerstone skill of gymnastics balance.",
    icon: "🏆",
  },
  {
    id: "pistol_squat_balance", name: "Pistol Squat Balance", category: "balance", tier: 3,
    prerequisites: ["single_leg_balance"], x: CX.balance - 20, y: TY[3] + 140, xpCost: 140,
    description: "Slow eccentric single-leg squat with balance control — the balance component of pistols.",
    icon: "⚖️",
  },

  // MOBILITY
  {
    id: "pancake_stretch", name: "Pancake Stretch", category: "mobility", tier: 3,
    prerequisites: ["hip_flexibility", "deep_squat_hold"], x: CX.mobility - 30, y: TY[3], xpCost: 130,
    description: "Straddled forward fold to the floor. Extreme hip and hamstring flexibility for splits and front lever.",
    icon: "🥞",
  },
  {
    id: "bridge_hold", name: "Bridge Hold", category: "mobility", tier: 3,
    prerequisites: ["shoulder_mobility"], x: CX.mobility + 30, y: TY[3] + 80, xpCost: 140,
    description: "Full back bridge held for time. Thoracic extension, shoulder flexibility, and hip flexor opening.",
    icon: "🌉",
  },
  {
    id: "l_sit_flexibility", name: "L-Sit Flexibility", category: "mobility", tier: 3,
    prerequisites: ["hip_flexibility"], x: CX.mobility - 15, y: TY[3] + 150, xpCost: 120,
    description: "Straight-leg seated stretch and pike position. Required hip flexor strength and hamstring length for L-sit.",
    icon: "📐",
  },

  // ENDURANCE
  {
    id: "interval_training", name: "Interval Training", category: "endurance", tier: 3,
    prerequisites: ["light_circuits", "jogging"], x: CX.endurance - 30, y: TY[3], xpCost: 140,
    description: "HIIT-style intervals mixing calisthenics and running for metabolic conditioning.",
    icon: "⏱️",
  },
  {
    id: "circuit_training", name: "Circuit Training", category: "endurance", tier: 3,
    prerequisites: ["light_circuits"], x: CX.endurance + 30, y: TY[3] + 80, xpCost: 130,
    description: "5+ exercise circuits with minimal rest. Build muscular and cardiovascular endurance together.",
    icon: "🔄",
  },

  // COORDINATION
  {
    id: "animal_flows", name: "Animal Flow Movements", category: "coordination", tier: 3,
    prerequisites: ["bear_crawl", "crab_walk"], x: CX.coordination - 30, y: TY[3], xpCost: 150,
    description: "Transitional ground movements connecting bear, crab, ape, and beast patterns.",
    icon: "🌊",
  },
  {
    id: "handstand_drills", name: "Handstand Coordination Drills", category: "coordination", tier: 3,
    prerequisites: ["bear_crawl"], x: CX.coordination + 30, y: TY[3] + 80, xpCost: 130,
    description: "Shoulder taps, forward rolls, and cartwheel entries building handstand coordination.",
    icon: "🔧",
  },

  // GRIP
  {
    id: "long_dead_hang", name: "Extended Dead Hang", category: "grip", tier: 3,
    prerequisites: ["dead_hang"], x: CX.grip - 30, y: TY[3], xpCost: 140,
    description: "2+ minute dead hang with active shoulder engagement. Extreme grip and forearm endurance.",
    icon: "⏳",
  },
  {
    id: "towel_hang", name: "Towel Hang", category: "grip", tier: 3,
    prerequisites: ["bar_hang_basics"], x: CX.grip + 30, y: TY[3] + 80, xpCost: 150,
    description: "Hanging from a towel draped over a bar. Trains crushing grip and wrist stability.",
    icon: "🏋️",
  },

  // STATIC STRENGTH
  {
    id: "l_sit", name: "L-Sit", category: "static_strength", tier: 3,
    prerequisites: ["tuck_hold", "l_sit_flexibility"], x: CX.static_strength - 40, y: TY[3], xpCost: 200,
    description: "Legs extended parallel to the floor on parallettes. The foundational compression hold.",
    icon: "📏",
  },
  {
    id: "planche_lean", name: "Planche Lean", category: "static_strength", tier: 3,
    prerequisites: ["support_hold", "hollow_body"], x: CX.static_strength + 40, y: TY[3] + 60, xpCost: 180,
    description: "Lean forward past hands in push-up position loading planche-specific muscles.",
    icon: "⬅️",
  },
  {
    id: "front_lever_tuck", name: "Tuck Front Lever", category: "static_strength", tier: 3,
    prerequisites: ["support_hold", "hollow_body"], x: CX.static_strength, y: TY[3] + 140, xpCost: 190,
    description: "Hanging tucked with back parallel to floor. First front lever progression.",
    icon: "🔰",
  },

  // POWER
  {
    id: "box_jumps", name: "Box Jumps", category: "power", tier: 3,
    prerequisites: ["jump_basics"], x: CX.power - 30, y: TY[3], xpCost: 140,
    description: "Explosive jump onto a box focusing on full hip extension and soft landings.",
    icon: "📦",
  },
  {
    id: "broad_jumps", name: "Broad Jumps", category: "power", tier: 3,
    prerequisites: ["jump_basics", "explosive_squat"], x: CX.power + 30, y: TY[3] + 80, xpCost: 150,
    description: "Maximum distance horizontal jumps. Tests lower body power and coordination.",
    icon: "➡️",
  },

  // EXPLOSIVENESS
  {
    id: "plyometric_push_ups", name: "Plyometric Push-Ups", category: "explosiveness", tier: 3,
    prerequisites: ["basic_plyometrics", "push_up_basics"], x: CX.explosiveness - 30, y: TY[3], xpCost: 160,
    description: "Explosive push-ups leaving the floor. Foundation for clapping push-ups and chest power.",
    icon: "💨",
  },
  {
    id: "explosive_pull", name: "Explosive Pull-Ups", category: "explosiveness", tier: 3,
    prerequisites: ["basic_plyometrics", "pull_up_basics"], x: CX.explosiveness + 30, y: TY[3] + 80, xpCost: 170,
    description: "Pull explosively to chest or above. Builds the power needed for muscle-up transitions.",
    icon: "🔝",
  },

  // ATHLETICISM
  {
    id: "lateral_agility", name: "Lateral Agility Drills", category: "athleticism", tier: 3,
    prerequisites: ["agility_basics", "sprint_mechanics"], x: CX.athleticism - 30, y: TY[3], xpCost: 130,
    description: "Side shuffle, crossover steps, and reactive lateral cuts. Essential sport movement.",
    icon: "↔️",
  },
  {
    id: "coordination_jumps", name: "Coordination Jumps", category: "athleticism", tier: 3,
    prerequisites: ["agility_basics", "jump_basics"], x: CX.athleticism + 30, y: TY[3] + 80, xpCost: 140,
    description: "Single leg bounds, skater hops, and hurdle drills for athletic coordination.",
    icon: "🦅",
  },

  // ── TIER 4: Advanced Skills ───────────────────────────────────────────────────

  // STRENGTH
  {
    id: "archer_pushup", name: "Archer Push-Ups", category: "strength", tier: 4,
    prerequisites: ["push_up_progression"], x: CX.strength - 40, y: TY[4], xpCost: 220,
    description: "One arm bends while the other stays extended as a guide. Key regression to one-arm push-up.",
    icon: "🎯",
  },
  {
    id: "pike_pushup", name: "Pike Push-Ups", category: "strength", tier: 4,
    prerequisites: ["push_up_progression"], x: CX.strength + 40, y: TY[4] + 60, xpCost: 200,
    description: "Hips high in inverted V position. Loads deltoids vertically — direct precursor to HSPU.",
    icon: "△",
  },
  {
    id: "weighted_pull", name: "Weighted Pull-Ups", category: "strength", tier: 4,
    prerequisites: ["pull_up_progression"], x: CX.strength - 20, y: TY[4] + 120, xpCost: 240,
    description: "Pull-ups with added weight. Builds the raw strength needed for advanced pulling skills.",
    icon: "🏋️",
  },
  {
    id: "pistol_squat", name: "Pistol Squats", category: "strength", tier: 4,
    prerequisites: ["pistol_squat_progression", "pistol_squat_balance"], x: CX.strength + 20, y: TY[4] + 180, xpCost: 250,
    description: "Full single-leg squat with free leg extended. Ultimate test of lower body strength and balance.",
    icon: "🦵",
  },

  // BALANCE
  {
    id: "handstand_walk", name: "Handstand Walk", category: "balance", tier: 4,
    prerequisites: ["freestanding_handstand"], x: CX.balance - 30, y: TY[4], xpCost: 280,
    description: "10+ steps on your hands. Dynamic balance and shoulder control. Crowd-stopping skill.",
    icon: "🚶",
  },
  {
    id: "one_arm_wall_handstand", name: "One Arm Wall Handstand", category: "balance", tier: 4,
    prerequisites: ["freestanding_handstand"], x: CX.balance + 30, y: TY[4] + 80, xpCost: 300,
    description: "Handstand against a wall using only one arm. Massive unilateral shoulder and wrist demand.",
    icon: "☝️",
  },

  // MOBILITY
  {
    id: "full_split", name: "Full Split", category: "mobility", tier: 4,
    prerequisites: ["pancake_stretch", "hip_flexibility"], x: CX.mobility - 30, y: TY[4], xpCost: 200,
    description: "Front or side splits reaching the floor. Elite flexibility achievement.",
    icon: "✌️",
  },
  {
    id: "deep_bridge", name: "Deep Bridge", category: "mobility", tier: 4,
    prerequisites: ["bridge_hold"], x: CX.mobility + 30, y: TY[4] + 80, xpCost: 190,
    description: "Full thoracic extension bridge with straight arms. Advanced spinal and shoulder flexibility.",
    icon: "🌈",
  },

  // ENDURANCE
  {
    id: "long_circuit", name: "Long Duration Circuits", category: "endurance", tier: 4,
    prerequisites: ["interval_training", "circuit_training"], x: CX.endurance - 30, y: TY[4], xpCost: 180,
    description: "30+ minute non-stop circuits. True test of muscular and cardiovascular endurance.",
    icon: "⏰",
  },
  {
    id: "endurance_pull_ups", name: "Pull-Up Endurance", category: "endurance", tier: 4,
    prerequisites: ["circuit_training", "pull_up_basics"], x: CX.endurance + 30, y: TY[4] + 80, xpCost: 170,
    description: "50+ pull-ups in a single session or time-based challenges. Extreme pulling endurance.",
    icon: "💪",
  },

  // GRIP
  {
    id: "one_arm_hang", name: "One Arm Dead Hang", category: "grip", tier: 4,
    prerequisites: ["long_dead_hang", "towel_hang"], x: CX.grip, y: TY[4], xpCost: 250,
    description: "Full bodyweight hang from a single arm. Insane grip and shoulder stability requirement.",
    icon: "✋",
  },

  // STATIC STRENGTH
  {
    id: "tuck_planche", name: "Tuck Planche", category: "static_strength", tier: 4,
    prerequisites: ["planche_lean"], x: CX.static_strength + 40, y: TY[4], xpCost: 280,
    description: "Knees tucked to chest, arms straight, body parallel to ground. First real planche position.",
    icon: "📍",
  },
  {
    id: "front_lever", name: "Front Lever", category: "static_strength", tier: 4,
    prerequisites: ["front_lever_tuck"], x: CX.static_strength - 40, y: TY[4] + 80, xpCost: 300,
    description: "Full body horizontal face-up, arms straight overhead on a bar. Extreme lat and core strength.",
    icon: "🚥",
  },
  {
    id: "v_sit", name: "V-Sit", category: "static_strength", tier: 4,
    prerequisites: ["l_sit"], x: CX.static_strength, y: TY[4] + 160, xpCost: 260,
    description: "L-sit with legs elevated above horizontal into a V. Gymnastic-level compression strength.",
    icon: "✌️",
  },

  // POWER
  {
    id: "depth_jumps", name: "Depth Jumps", category: "power", tier: 4,
    prerequisites: ["box_jumps", "broad_jumps"], x: CX.power - 30, y: TY[4], xpCost: 200,
    description: "Step off a box and immediately jump maximally upon landing. Extreme reactive power.",
    icon: "🎯",
  },
  {
    id: "explosive_dips", name: "Explosive Dips", category: "power", tier: 4,
    prerequisites: ["ring_dips", "box_jumps"], x: CX.power + 30, y: TY[4] + 80, xpCost: 190,
    description: "Explosive bar dips reaching momentary flight phase at the top. Power for muscle-ups.",
    icon: "💫",
  },

  // EXPLOSIVENESS
  {
    id: "clap_push_ups", name: "Clap Push-Ups", category: "explosiveness", tier: 4,
    prerequisites: ["plyometric_push_ups", "archer_pushup"], x: CX.explosiveness, y: TY[4], xpCost: 210,
    description: "Clap at the top of an explosive push-up. Measures upper body power output.",
    icon: "👏",
  },

  // ── TIER 5: Hybrid Skills ─────────────────────────────────────────────────────

  {
    id: "muscle_up", name: "Muscle-Up", category: "hybrid", tier: 5,
    prerequisites: ["explosive_pull", "weighted_pull"], x: midX("explosiveness", "strength"), y: TY[5], xpCost: 350,
    description: "Explosive pull transitioning above the bar into a dip. The iconic bar skill combining power and technique.",
    icon: "🔝",
  },
  {
    id: "handstand_pushup", name: "Handstand Push-Up", category: "hybrid", tier: 5,
    prerequisites: ["freestanding_handstand", "pike_pushup"], x: midX("balance", "strength") - 20, y: TY[5] + 80, xpCost: 380,
    description: "Full overhead press inverted. One of the most impressive pressing feats in bodyweight training.",
    icon: "🏆",
  },
  {
    id: "planche_pushup", name: "Planche Push-Up", category: "hybrid", tier: 5,
    prerequisites: ["tuck_planche", "archer_pushup"], x: midX("static_strength", "strength"), y: TY[5] + 160, xpCost: 420,
    description: "A push-up from the planche position. Requires extraordinary straight-arm pressing strength.",
    icon: "💎",
  },
  {
    id: "front_lever_pullup", name: "Front Lever Pull-Up", category: "hybrid", tier: 5,
    prerequisites: ["front_lever", "weighted_pull"], x: midX("static_strength", "strength") + 80, y: TY[5], xpCost: 450,
    description: "Pull-up performed from and returning to front lever. One of the most elite pulling feats.",
    icon: "🔱",
  },
  {
    id: "human_flag", name: "Human Flag", category: "hybrid", tier: 5,
    prerequisites: ["freestanding_handstand", "weighted_pull", "front_lever_tuck"], x: midX("balance", "strength", "static_strength") - 30, y: TY[5] + 240, xpCost: 500,
    description: "Body held horizontally sideways on a vertical pole. The most visually stunning static skill.",
    icon: "🚩",
  },
  {
    id: "dragon_flag", name: "Dragon Flag", category: "hybrid", tier: 5,
    prerequisites: ["l_sit", "weighted_pull"], x: midX("static_strength", "strength") - 80, y: TY[5] + 80, xpCost: 380,
    description: "Body held rigid from shoulders lowering and raising. Bruce Lee's signature core skill.",
    icon: "🐉",
  },
  {
    id: "pistol_jump", name: "Pistol Jump Squat", category: "hybrid", tier: 5,
    prerequisites: ["pistol_squat", "depth_jumps"], x: midX("strength", "power"), y: TY[5] + 160, xpCost: 360,
    description: "Explosive single-leg jump squat. Extreme lower body power and strength combination.",
    icon: "🚀",
  },
  {
    id: "handstand_walk_hybrid", name: "Handstand Walk + Turn", category: "hybrid", tier: 5,
    prerequisites: ["handstand_walk", "animal_flows"], x: midX("balance", "coordination"), y: TY[5] + 320, xpCost: 340,
    description: "Handstand walking with 90-degree turns and pirouettes. Balance meets coordination.",
    icon: "🌀",
  },

  // ── TIER 6: Elite Skills ──────────────────────────────────────────────────────

  {
    id: "one_arm_pull_up", name: "One Arm Pull-Up", category: "strength", tier: 6,
    prerequisites: ["weighted_pull", "one_arm_hang", "muscle_up"], x: CX.strength + 20, y: TY[6], xpCost: 600,
    description: "The absolute pinnacle of pulling strength. Full ROM pull-up on a single arm. World-class achievement.",
    icon: "☝️",
  },
  {
    id: "advanced_tuck_planche", name: "Advanced Tuck Planche", category: "static_strength", tier: 6,
    prerequisites: ["tuck_planche"], x: CX.static_strength + 40, y: TY[6], xpCost: 400,
    description: "Tuck planche with hips raised and back flat. Midpoint between tuck and straddle planche.",
    icon: "⬆️",
  },
  {
    id: "full_planche", name: "Full Planche", category: "static_strength", tier: 6,
    prerequisites: ["advanced_tuck_planche", "planche_pushup"], x: CX.static_strength, y: TY[6] + 100, xpCost: 700,
    description: "Body fully extended horizontal with straight arms. One of the most elite gymnastics holds.",
    icon: "🏅",
  },
  {
    id: "full_front_lever", name: "Full Front Lever", category: "static_strength", tier: 6,
    prerequisites: ["front_lever", "front_lever_pullup"], x: CX.static_strength - 40, y: TY[6], xpCost: 650,
    description: "5-second full front lever hold with perfect body alignment. Elite posterior chain mastery.",
    icon: "🎖️",
  },
  {
    id: "one_arm_pushup", name: "One Arm Push-Up", category: "strength", tier: 6,
    prerequisites: ["archer_pushup", "clap_push_ups"], x: CX.strength - 20, y: TY[6] + 100, xpCost: 580,
    description: "The pinnacle of push strength. Full ROM push-up on a single arm with feet hip-width.",
    icon: "🖐️",
  },
  {
    id: "back_lever", name: "Back Lever", category: "static_strength", tier: 6,
    prerequisites: ["front_lever", "tuck_planche"], x: CX.static_strength + 80, y: TY[6] + 200, xpCost: 500,
    description: "Body horizontal face-down on a bar or rings. Bicep tendon and shoulder flexibility demand.",
    icon: "🔰",
  },

  // ── TIER 7: Legendary Skills ──────────────────────────────────────────────────

  {
    id: "planche_handstand", name: "Planche to Handstand", category: "hybrid", tier: 7,
    prerequisites: ["full_planche", "handstand_pushup"], x: midX("static_strength", "balance"), y: TY[7], xpCost: 1000,
    description: "Transition from full planche to handstand and back. The ultimate pushing strength and control skill.",
    icon: "✨",
  },
  {
    id: "victorian_cross", name: "Victorian Cross", category: "static_strength", tier: 7,
    prerequisites: ["full_planche", "full_front_lever", "one_arm_pull_up"], x: CX.static_strength, y: TY[7] + 100, xpCost: 1500,
    description: "Arms extended sideways on rings, body horizontal. Perhaps the hardest static hold in existence.",
    icon: "⚔️",
  },
  {
    id: "one_arm_handstand", name: "One Arm Handstand", category: "balance", tier: 7,
    prerequisites: ["handstand_walk", "one_arm_wall_handstand", "one_arm_pushup"], x: CX.balance, y: TY[7], xpCost: 1200,
    description: "Freestanding handstand on a single arm. One of the rarest and most impressive feats in calisthenics.",
    icon: "🌟",
  },
  {
    id: "triple_muscle_up", name: "Triple Muscle-Up", category: "hybrid", tier: 7,
    prerequisites: ["muscle_up", "one_arm_pull_up"], x: midX("explosiveness", "strength") + 50, y: TY[7] + 100, xpCost: 1100,
    description: "Three consecutive muscle-ups without pause. Elite display of pulling power and endurance.",
    icon: "🔱",
  },
  {
    id: "iron_cross", name: "Iron Cross", category: "static_strength", tier: 7,
    prerequisites: ["full_planche", "back_lever", "human_flag"], x: CX.static_strength + 50, y: TY[7] + 200, xpCost: 1400,
    description: "Arms extended 90 degrees to the sides on rings. Olympic gymnastics ring strength at its finest.",
    icon: "✝️",
  },
  {
    id: "perfect_human_flag", name: "Perfect Human Flag", category: "hybrid", tier: 7,
    prerequisites: ["human_flag", "back_lever"], x: midX("balance", "static_strength"), y: TY[7] + 300, xpCost: 1300,
    description: "10-second human flag with locked arms and perfectly horizontal body. Legendary lateral strength.",
    icon: "🏳️",
  },
];

// ─── Exports ──────────────────────────────────────────────────────────────────

export const V2_NODE_MAP: Record<string, V2SkillNode> = Object.fromEntries(
  V2_SKILL_NODES.map((n) => [n.id, n])
);
