/**
 * skill-academy-data.ts
 *
 * Extended skill guides for the Skill Academy.
 * Supplements the LibrarySkill data (which already has benefits,
 * commonMistakes, coachingTips, etc.) with:
 *   - Structured technique breakdown
 *   - Primary / secondary muscles
 *   - Training exercises to build toward the skill
 *   - Difficulty context
 */

export interface SkillTechniqueGuide {
  setup:        string[];
  execution:    string[];
  bodyPosition: string[];
  breathing:    string[];
  keyCues:      string[];
}

export interface SkillMuscles {
  primary:   string[];
  secondary: string[];
}

export interface TrainingExercise {
  name:    string;
  purpose: string;
}

export interface SkillAcademyEntry {
  skillId:         string;
  technique:       SkillTechniqueGuide;
  muscles:         SkillMuscles;
  training:        TrainingExercise[];
  difficultyNote?: string;
}

// ─── Academy Data ─────────────────────────────────────────────────────────────

const ACADEMY_DATA: SkillAcademyEntry[] = [

  // ── PUSH ────────────────────────────────────────────────────────────────────

  {
    skillId: "push_up",
    technique: {
      setup:        ["Place hands slightly wider than shoulder-width", "Form a rigid plank from head to heels", "Engage core and squeeze glutes before you begin"],
      execution:    ["Lower your chest to 1–2 cm off the floor", "Keep elbows at roughly 45° to your torso", "Push through both palms explosively back to start"],
      bodyPosition: ["Neutral spine — no banana back or piked hips", "Head in line with spine, eyes down", "Full shoulder protraction at the top"],
      breathing:    ["Inhale on the way down", "Exhale forcefully on the way up"],
      keyCues:      ["Chest to floor, not nose", "Elbows 45° not flared wide", "Straight body line throughout", "Squeeze glutes for hip stability"],
    },
    muscles: {
      primary:   ["Pectoralis Major", "Triceps Brachii", "Anterior Deltoid"],
      secondary: ["Core (Rectus Abdominis)", "Serratus Anterior", "Glutes"],
    },
    training: [
      { name: "Plank Holds",        purpose: "Builds the full-body tension needed" },
      { name: "Incline Push-Ups",   purpose: "Regression to build initial strength" },
      { name: "Chest Dips",         purpose: "Overloads the same push pattern" },
      { name: "Hollow Body Hold",   purpose: "Teaches the body-tension you need" },
    ],
  },

  {
    skillId: "archer_push_up",
    difficultyNote: "The archer push-up is a powerful bridge to the one-arm push-up. One arm bears roughly 70% of your bodyweight.",
    technique: {
      setup:        ["Set hands very wide — about 1.5× shoulder width", "Keep both arms straight at the start", "Engage core tightly before you move"],
      execution:    ["Shift your weight over the working arm", "Bend that elbow while the other arm stays fully extended", "Lower until your chest is 2–3 cm from the floor", "Push back through the working arm to start"],
      bodyPosition: ["Hips level throughout — no rotation", "Working-arm elbow stays close to torso", "Extended arm stays straight with fingers pointed away"],
      breathing:    ["Inhale as you lower toward the working arm", "Exhale as you press back up"],
      keyCues:      ["Keep hips square", "Full extension on the straight arm", "Don't rotate the torso"],
    },
    muscles: {
      primary:   ["Pectoralis Major (unilateral)", "Triceps Brachii", "Anterior Deltoid"],
      secondary: ["Core (Obliques)", "Serratus Anterior", "Glutes"],
    },
    training: [
      { name: "Wide Push-Ups",        purpose: "Prepares the wide base position" },
      { name: "Push-Up",              purpose: "Build baseline bilateral strength" },
      { name: "Diamond Push-Up",      purpose: "Builds tricep and inner chest strength" },
      { name: "Plank with Weight Shift", purpose: "Trains lateral loading" },
    ],
  },

  {
    skillId: "one_arm_push_up",
    difficultyNote: "One of the hardest bodyweight pushing skills. It requires not just unilateral strength, but exceptional full-body tension and anti-rotation core control.",
    technique: {
      setup:        ["Place your working hand in the center of your chest — not shoulder-width", "Set your feet wide for stability", "Place your free hand behind your back or on your hip"],
      execution:    ["Lower slowly, maintaining a perfectly square torso", "Touch your chest 2–3 cm from the floor", "Push explosively back to full extension"],
      bodyPosition: ["Hips must stay level — no twisting", "Spine neutral throughout", "Elbow travels back, not out"],
      breathing:    ["Inhale on the descent", "Exhale forcefully on the press"],
      keyCues:      ["Square hips — the biggest challenge", "Elbow back not flared", "Tense everything: glutes, core, lats", "Wide feet help beginners"],
    },
    muscles: {
      primary:   ["Pectoralis Major", "Triceps Brachii", "Anterior Deltoid"],
      secondary: ["Core (entire)", "Glutes", "Obliques (anti-rotation)"],
    },
    training: [
      { name: "Archer Push-Up",           purpose: "The main progression — builds unilateral strength" },
      { name: "Pseudo Planche Push-Up",   purpose: "Builds wrist and push strength at centre position" },
      { name: "Deficit Push-Up",          purpose: "Increases range of motion" },
      { name: "Plank Weight Shift",       purpose: "Anti-rotation core work" },
    ],
  },

  {
    skillId: "handstand_push_up",
    difficultyNote: "Requires both handstand balance AND overhead pressing strength. Most athletes need 6–12 months of handstand work before attempting freestanding HSPUs.",
    technique: {
      setup:        ["Kick up to wall handstand or freestanding position", "Set hands shoulder-width with fingers spread", "Engage shoulders hard — push the floor away"],
      execution:    ["Lower slowly until head lightly touches the floor (for wall) or reaches shoulder level (freestanding)", "Pause briefly at the bottom", "Press back up to full lockout"],
      bodyPosition: ["Straight line from wrists through hips and feet", "Elbows travel forward, not flared", "Core tight throughout"],
      breathing:    ["Inhale on the way down", "Exhale hard as you press up"],
      keyCues:      ["Push the floor away at lockout", "Elbows forward 30–45°", "Stay hollow — don't banana", "Controlled descent, explosive press"],
    },
    muscles: {
      primary:   ["Anterior & Lateral Deltoids", "Triceps Brachii", "Upper Trapezius"],
      secondary: ["Pectoralis Minor", "Serratus Anterior", "Core"],
    },
    training: [
      { name: "Pike Push-Up",           purpose: "Primary strength builder for the pattern" },
      { name: "Wall Handstand Hold",    purpose: "Builds the shoulder endurance required" },
      { name: "Decline Push-Up",        purpose: "Loads the shoulders in a similar angle" },
      { name: "Overhead Press",         purpose: "Builds raw vertical press strength" },
      { name: "Freestanding Handstand", purpose: "Develops the balance component" },
    ],
  },

  // ── PULL ────────────────────────────────────────────────────────────────────

  {
    skillId: "dead_hang",
    technique: {
      setup:        ["Grip the bar with an overhand grip just wider than shoulder-width", "Let your body hang completely straight", "Relax your shoulders into full elevation"],
      execution:    ["Breathe steadily and hold the position", "Focus on letting the shoulders fully unload", "Build duration progressively — start 15 s, target 60 s+"],
      bodyPosition: ["Completely straight arms", "Shoulders fully elevated (passive dead hang)", "Feet together, legs straight"],
      breathing:    ["Slow, controlled breathing throughout", "Don't hold your breath"],
      keyCues:      ["Let shoulders fully relax upward", "Straight arms always", "This is a mobility exercise — don't actively pull", "Build to 60 seconds"],
    },
    muscles: {
      primary:   ["Forearm Flexors (grip)", "Brachioradialis", "Rotator Cuff"],
      secondary: ["Latissimus Dorsi", "Biceps Brachii", "Shoulder Girdle"],
    },
    training: [
      { name: "Farmer Carries",       purpose: "Builds raw grip strength" },
      { name: "Towel Hangs",          purpose: "Increases grip difficulty" },
      { name: "Timed Dead Hang Sets", purpose: "Progressive overload for grip endurance" },
    ],
  },

  {
    skillId: "pull_up",
    technique: {
      setup:        ["Begin in a full dead hang — arms completely straight", "Grip overhand, hands shoulder-width or slightly wider", "Engage core and scapulars before pulling"],
      execution:    ["Retract and depress your scapulars first", "Pull elbows down and back toward your hips", "Clear your chin completely over the bar", "Lower under control back to full dead hang"],
      bodyPosition: ["Chest up, slight lean back at top", "Elbows track down, not flared", "Full dead hang at the bottom every rep"],
      breathing:    ["Exhale as you pull up", "Inhale on the way down"],
      keyCues:      ["Dead hang start every single rep", "Retract scapula before pulling", "Chin clearly over bar", "Control the negative"],
    },
    muscles: {
      primary:   ["Latissimus Dorsi", "Biceps Brachii", "Teres Major"],
      secondary: ["Rear Deltoid", "Rhomboids", "Core", "Forearms"],
    },
    training: [
      { name: "Dead Hang",             purpose: "Builds grip and shoulder health" },
      { name: "Scapular Pull-Ups",     purpose: "Teaches proper scapular engagement" },
      { name: "Negative Pull-Ups",     purpose: "Builds strength through the full ROM" },
      { name: "Rows",                  purpose: "Horizontal pull strength transfers directly" },
      { name: "Band-Assisted Pull-Up", purpose: "Allows training the full movement pattern" },
    ],
  },

  {
    skillId: "muscle_up",
    difficultyNote: "The muscle-up demands pulling strength, timing, explosive power, AND the ability to transition from a pull to a push — a coordination challenge that trips up most athletes for months.",
    technique: {
      setup:        ["Begin in a full dead hang with a false grip or regular grip", "Generate a slight swing (kipping) or attempt strict from dead hang", "Retract scapulars aggressively"],
      execution:    ["Explosively pull the bar down toward your hips rather than your chest", "As the bar reaches chest height, shoot your elbows forward over the bar", "Transition smoothly by leaning forward and pressing to lockout"],
      bodyPosition: ["Bar path: pull to lower sternum/hips, not chin", "At transition: lean chest over the bar", "Finish in a full dip lockout"],
      breathing:    ["Big exhale at the transition point", "Maintain breath control throughout"],
      keyCues:      ["Pull the bar to your HIPS, not your chin", "Lean forward at the top of the pull", "Shoot elbows over the bar", "The transition is the hardest part — drill it separately"],
    },
    muscles: {
      primary:   ["Latissimus Dorsi", "Biceps Brachii", "Triceps Brachii"],
      secondary: ["Pectoralis Major", "Anterior Deltoid", "Core", "Forearms"],
    },
    training: [
      { name: "Pull-Up (15+ reps)",  purpose: "Raw pulling strength — need a big base" },
      { name: "Chest-to-Bar Pull-Up", purpose: "Trains the bar path and high pull" },
      { name: "Explosive Pull-Up",   purpose: "Builds the power needed for the transition" },
      { name: "Bar Dips",            purpose: "Builds the push component" },
      { name: "Transition Drills",   purpose: "Practise the elbow-over at a low bar or with a box" },
    ],
  },

  {
    skillId: "archer_pull_up",
    difficultyNote: "The archer pull-up shifts roughly 70% of load to the working arm. It is the primary bridge skill toward the one-arm pull-up.",
    technique: {
      setup:        ["Grip the bar wide — 1.5–2× shoulder-width", "Begin in a full dead hang", "Decide which arm will be the working arm"],
      execution:    ["Shift your body weight toward the working arm", "Pull that elbow down toward your hip", "The opposite arm stays straight as you rise", "Clear chin above the bar"],
      bodyPosition: ["Hips remain square — no rotation", "Working arm stays close to the body", "Straight arm is fully extended the whole time"],
      breathing:    ["Exhale on the pull up", "Inhale on the way down"],
      keyCues:      ["Shift weight FIRST, then pull", "Straight arm stays straight", "No hip rotation"],
    },
    muscles: {
      primary:   ["Latissimus Dorsi (unilateral)", "Biceps Brachii", "Teres Major"],
      secondary: ["Rear Deltoid", "Core (Obliques)", "Forearms"],
    },
    training: [
      { name: "Pull-Up",               purpose: "Must have 10+ strict reps first" },
      { name: "Wide-Grip Pull-Up",     purpose: "Practices the wide base position" },
      { name: "Unilateral Rows",       purpose: "Builds single-arm pulling strength" },
      { name: "Dead Hang Shifts",      purpose: "Weight transfer practice" },
    ],
  },

  {
    skillId: "one_arm_pull_up",
    difficultyNote: "One of the rarest skills in calisthenics. Most athletes with 20+ strict pull-ups still need 6–18 months of specific training. Requires not just strength but exceptional scapular control and anti-rotation.",
    technique: {
      setup:        ["Grab the bar with one hand, overhand grip", "The free hand can rest on the wrist, forearm, or behind your back", "Begin in a full dead hang with shoulder elevated"],
      execution:    ["Depress and retract the scapula", "Pull the elbow down toward your hip", "Rotate slightly toward the working arm as you rise", "Clear chin above the bar"],
      bodyPosition: ["Slight lateral lean toward the working arm is normal", "Core braced hard to prevent excessive rotation", "Full dead hang start every rep"],
      breathing:    ["Big exhale at the pull", "Inhale on the controlled descent"],
      keyCues:      ["Pull the elbow to the hip, not the bar to the chin", "Slight rotation is okay — excessive rotation is cheating", "Full dead hang every rep", "Eccentric (negative) work is critical"],
    },
    muscles: {
      primary:   ["Latissimus Dorsi", "Biceps Brachii", "Teres Major"],
      secondary: ["Rear Deltoid", "Core (entire)", "Forearms", "Rhomboids"],
    },
    training: [
      { name: "Archer Pull-Up",       purpose: "The primary stepping stone" },
      { name: "One-Arm Negative",     purpose: "Eccentric OAPUs build specific strength faster" },
      { name: "Towel Pull-Up",        purpose: "Unequal loading with easier hand position" },
      { name: "One-Arm Dead Hang",    purpose: "Builds single-arm grip and scapular strength" },
      { name: "Weighted Pull-Up",     purpose: "Increases overall pulling strength" },
    ],
  },

  // ── CORE ────────────────────────────────────────────────────────────────────

  {
    skillId: "plank",
    technique: {
      setup:        ["Place forearms (or hands for straight-arm) on the floor", "Elbows directly under shoulders", "Form a straight line from head to heels"],
      execution:    ["Hold the position with everything squeezed", "Don't let hips sag or pike", "Build duration: target 60 s then 2 min"],
      bodyPosition: ["Neutral spine — lower back should not arch", "Glutes squeezed hard", "Head neutral, eyes down"],
      breathing:    ["Slow and controlled throughout", "Engage your core on the exhale"],
      keyCues:      ["Squeeze glutes AND quads", "Push the floor away", "Neck neutral", "Think 'rigid plank' not just 'hold'"],
    },
    muscles: {
      primary:   ["Rectus Abdominis", "Transversus Abdominis", "Erector Spinae"],
      secondary: ["Glutes", "Quads", "Shoulder Stabilisers"],
    },
    training: [
      { name: "Hollow Body Hold",  purpose: "Harder plank variation, superior for calisthenics" },
      { name: "Dead Bug",          purpose: "Anti-extension core work with movement" },
      { name: "Ab Wheel Rollout",  purpose: "Progressive anti-extension overload" },
    ],
  },

  {
    skillId: "hollow_body",
    difficultyNote: "The hollow body hold is the single most important foundational skill in gymnastics and calisthenics. Master this before any advanced skill.",
    technique: {
      setup:        ["Lie flat on your back", "Press your lower back into the floor — no arch", "Arms overhead, legs straight"],
      execution:    ["Lift arms, shoulders, and legs off the floor simultaneously", "Hold the curved 'banana' shape with lower back glued to floor", "Build from 10 s to 60+ s"],
      bodyPosition: ["Lower back MUST contact the floor — this is non-negotiable", "Toes pointed", "Arms in line with ears"],
      breathing:    ["Breathe slowly — this is hard while hollow", "Short exhales to maintain tension"],
      keyCues:      ["Lower back to floor — the entire point", "Point the toes", "Arms inline with ears not perpendicular", "Tuck chin slightly"],
    },
    muscles: {
      primary:   ["Rectus Abdominis", "Transversus Abdominis", "Hip Flexors"],
      secondary: ["Obliques", "Serratus Anterior", "Shoulder Flexors"],
    },
    training: [
      { name: "Plank",               purpose: "Builds basic core tension" },
      { name: "Dead Bug",            purpose: "Anti-extension core in motion" },
      { name: "V-Up",                purpose: "Dynamic version to build strength" },
      { name: "Hollow Body Rock",    purpose: "Progress from static to dynamic" },
    ],
  },

  {
    skillId: "l_sit",
    difficultyNote: "Despite looking simple, the L-sit is brutally hard for beginners. Compression strength and straight-arm support are both required simultaneously.",
    technique: {
      setup:        ["Place hands directly under your hips on parallettes (or floor)", "Lock your elbows completely straight", "Depress shoulders hard — don't shrug"],
      execution:    ["Lift your legs to horizontal, keeping them completely straight", "Point toes for full range of motion", "Hold for as long as possible — start 5 s"],
      bodyPosition: ["Legs perfectly parallel to floor — higher is not better", "Arms locked at elbows", "Shoulders depressed — actively push down"],
      breathing:    ["Short controlled breaths while holding", "Don't hold breath"],
      keyCues:      ["Lock the elbows", "Depress shoulders hard", "Point the toes", "Hold both height AND arm lockout"],
    },
    muscles: {
      primary:   ["Hip Flexors (Iliopsoas)", "Rectus Abdominis", "Triceps Brachii"],
      secondary: ["Wrist Flexors", "Serratus Anterior", "Shoulder Depressors"],
    },
    training: [
      { name: "Tuck L-Sit",          purpose: "Learn arm position with knees bent" },
      { name: "Hanging Leg Raise",   purpose: "Builds hip flexor and core strength" },
      { name: "Compression Stretching", purpose: "Hamstring flexibility for full leg extension" },
      { name: "Dip Support Hold",    purpose: "Builds straight-arm support strength" },
    ],
  },

  {
    skillId: "dragon_flag",
    difficultyNote: "Made famous by Bruce Lee. One of the most demanding anterior chain exercises. Requires exceptional core strength and full-body tension.",
    technique: {
      setup:        ["Lie on a bench and grip the bench behind your head", "Raise your body off the bench until vertical"],
      execution:    ["Lower your entire body as one rigid unit toward the bench", "Only shoulders and head contact the bench", "Pause just above horizontal and drive back up"],
      bodyPosition: ["Perfectly straight line from shoulders to feet", "Hips must NOT break — this is the hardest part", "Arms pull the bench to stabilise"],
      breathing:    ["Inhale before lowering", "Exhale and brace hard as you hold position"],
      keyCues:      ["One straight line — no hip drop", "Pull the bench away for shoulder stability", "Lower slowly — eccentric first", "Glutes and quads squeezed the whole time"],
    },
    muscles: {
      primary:   ["Rectus Abdominis", "Hip Flexors", "Spinal Erectors (isometric)"],
      secondary: ["Glutes", "Quads", "Lats (for support)"],
    },
    training: [
      { name: "Hollow Body Hold",    purpose: "Core foundation for the position" },
      { name: "L-Sit",               purpose: "Hip flexor and core compression strength" },
      { name: "Tuck Dragon Flag",    purpose: "Easier version with legs tucked" },
      { name: "Ab Wheel Rollout",    purpose: "Anti-extension core progressive overload" },
      { name: "Leg Raise",           purpose: "Hip flexor strength with hanging or lying" },
    ],
  },

  // ── STATIC / BALANCE ────────────────────────────────────────────────────────

  {
    skillId: "handstand",
    difficultyNote: "The freestanding handstand typically takes 6–12 months of daily practice to achieve. Consistent short practice sessions beat infrequent long sessions.",
    technique: {
      setup:        ["Start in a lunge, working hand forward", "Place hands shoulder-width with fingers spread", "Push the floor away before kicking up"],
      execution:    ["Kick up with control — don't slam into it", "Stack wrists, elbows, shoulders, hips, ankles, feet in a vertical line", "Balance through finger pressure and shoulder adjustments"],
      bodyPosition: ["Perfectly straight line — no banana back", "Neutral head position — eyes between hands or at the floor", "Toes pointed"],
      breathing:    ["Slow, controlled breathing throughout", "Don't hold your breath — it kills endurance"],
      keyCues:      ["Push the floor away at all times", "Finger tips are the brake — use them", "Stay hollow — no arch", "Small adjustments from the shoulders, not the hips"],
    },
    muscles: {
      primary:   ["Deltoids", "Serratus Anterior", "Wrist Flexors & Extensors"],
      secondary: ["Triceps Brachii", "Core", "Traps (upper)"],
    },
    training: [
      { name: "Wall Handstand",       purpose: "Builds shoulder endurance and alignment" },
      { name: "Handstand Shrugs",     purpose: "Strengthens the shoulder elevation needed" },
      { name: "Wall Walks",           purpose: "Builds confidence and shoulder strength" },
      { name: "Pike Press",           purpose: "Teaches hip-over-shoulder mechanics" },
      { name: "Wrist Conditioning",   purpose: "Protects wrists from overuse injury" },
    ],
  },

  {
    skillId: "front_lever",
    difficultyNote: "The front lever is one of the most technically demanding static holds. It requires simultaneous straight-arm strength, lat strength, and full-body tension. Expect 12–24 months from pull-up to front lever.",
    technique: {
      setup:        ["Hang from a bar in a dead hang", "Begin in a tuck front lever or desired progression"],
      execution:    ["Retract and depress scapulars aggressively", "Press lats into the bar — imagine bending the bar toward you", "Extend to the hold position", "Maintain a perfectly flat body from head to heels"],
      bodyPosition: ["Flat horizontal body — no hip sag, no hip pike", "Arms completely straight — any bend is a regression", "Shoulders behind the bar, not under it"],
      breathing:    ["Short controlled breaths — full exhale kills tension", "Breathe into your chest, not your belly"],
      keyCues:      ["Depress scapulars HARD — the key to the skill", "Pull lats down as if bending the bar", "Completely straight arms", "Hips level with shoulders — the hardest part"],
    },
    muscles: {
      primary:   ["Latissimus Dorsi", "Posterior Deltoid", "Teres Major"],
      secondary: ["Core (entire)", "Biceps Brachii (isometric)", "Rhomboids", "Forearms"],
    },
    training: [
      { name: "Tuck Front Lever Hold",    purpose: "Master each tuck progression first" },
      { name: "Front Lever Raises",       purpose: "Dynamic version builds strength quickly" },
      { name: "Weighted Pull-Ups",        purpose: "Increases raw lat strength" },
      { name: "Scapular Pull-Ups",        purpose: "Teaches the scapular depression pattern" },
      { name: "Dragon Flags",             purpose: "Core tension practice in similar position" },
      { name: "Australian Rows",          purpose: "Builds horizontal pulling strength" },
    ],
  },

  {
    skillId: "human_flag",
    difficultyNote: "The human flag is one of the most visually striking skills. It requires extreme lateral body strength that most athletes have never trained.",
    technique: {
      setup:        ["Grab a vertical pole with arms wide apart (bottom arm bent, top arm bent)", "Begin leaning against the pole"],
      execution:    ["Press the lower arm down into the pole", "Pull the upper arm down toward you", "Drive your hips up and away from the pole", "Achieve horizontal position"],
      bodyPosition: ["Arms are not parallel to each other — they push/pull against the pole", "Body perfectly horizontal", "Legs together and straight"],
      breathing:    ["Short, controlled breaths during the hold", "Full breath before attempting"],
      keyCues:      ["Push AND pull against the pole simultaneously", "Drive hips UP first", "Keep both arms fairly bent", "The bottom hand pushes DOWN, top hand pulls DOWN (toward your body)"],
    },
    muscles: {
      primary:   ["Latissimus Dorsi", "Obliques", "Deltoids"],
      secondary: ["Core", "Pectorals (bottom arm push)", "Biceps (top arm pull)", "Glutes"],
    },
    training: [
      { name: "Side Plank",           purpose: "Lateral core strength foundation" },
      { name: "Vertical Flag",        purpose: "Learn pole mechanics before horizontal" },
      { name: "Tuck Human Flag",      purpose: "Full pattern with reduced load" },
      { name: "Pull-Ups + Dips",      purpose: "General upper body strength base" },
      { name: "Pole Supports",        purpose: "Condition shoulders for pole grip" },
    ],
  },

  {
    skillId: "planche_lean",
    technique: {
      setup:        ["Start in a push-up top position", "Rotate wrists so fingers point backward or to the side", "Shift your weight forward"],
      execution:    ["Lean forward until shoulders are well past your wrists", "Keep arms straight throughout", "Feel weight transferring to straight-arm support"],
      bodyPosition: ["Perfectly straight body", "Hips at same height as shoulders", "Toes elevated can help beginners"],
      breathing:    ["Slow and controlled throughout"],
      keyCues:      ["Shoulders past wrists — that's the goal", "Protract the scapulars hard", "Maintain wrist flexibility", "This is a strength AND mobility drill"],
    },
    muscles: {
      primary:   ["Wrist Flexors", "Serratus Anterior", "Anterior Deltoid"],
      secondary: ["Core", "Triceps Brachii", "Pectoralis Minor"],
    },
    training: [
      { name: "Push-Up",               purpose: "Base pressing strength" },
      { name: "Wrist Conditioning",    purpose: "Prepare wrists for pressure" },
      { name: "Crow Stand",            purpose: "Learn weight shifting to straight arms" },
      { name: "Hollow Body Hold",      purpose: "Body tension required" },
    ],
  },

  {
    skillId: "tuck_planche",
    difficultyNote: "Your first real planche skill. Every kilogram of bodyweight is now fully supported on straight arms with your legs tucked. Most intermediate athletes need 6–18 months of consistent work.",
    technique: {
      setup:        ["Begin in a planche lean", "Place hands turned out or to the side", "Tuck your knees tightly to your chest"],
      execution:    ["Elevate your hips by leaning far forward", "Both feet leave the ground simultaneously", "Protract scapulars as hard as possible", "Hold"],
      bodyPosition: ["Hips and knees at the same height as shoulders", "Arms completely straight", "Shoulders past wrists"],
      breathing:    ["Short breaths only — hold phase requires serious tension"],
      keyCues:      ["Protract (spread) scapulars maximally", "Lean far enough forward — undershooting is the most common mistake", "Straight arms always", "Tight tuck = easier"],
    },
    muscles: {
      primary:   ["Serratus Anterior", "Anterior Deltoid", "Pectoralis Minor"],
      secondary: ["Core", "Wrist Flexors", "Triceps Brachii", "Rhomboids"],
    },
    training: [
      { name: "Planche Lean",         purpose: "Straight-arm forward lean strength" },
      { name: "Pseudo Planche Push-Up", purpose: "Trains the same arm position under load" },
      { name: "Crow Stand",           purpose: "Learn the balance point" },
      { name: "Frog Stand",           purpose: "First bent-arm balance to straight-arm bridge" },
      { name: "Band-Assisted Tuck Planche", purpose: "Allows training the full position" },
    ],
  },

  {
    skillId: "full_planche",
    difficultyNote: "The full planche is an elite-level skill achieved by only a small fraction of serious athletes. Expect 3–7+ years from beginner level, or 1–3 years from tuck planche. Every gram matters.",
    technique: {
      setup:        ["Extend from tuck or straddle planche position", "Maintain all the lean and scapular protraction of the tuck"],
      execution:    ["Extend legs back to a completely straight horizontal position", "Keep hips from dropping — this is the hardest part", "Maintain full arm lockout"],
      bodyPosition: ["Perfectly horizontal from head to heels", "Scapulars maximally protracted", "Hips in line with shoulders — NOT lower"],
      breathing:    ["Very short controlled breaths"],
      keyCues:      ["Progress through straddle before full", "Straight body line — hips level with shoulders", "Protract scapulars even harder than tuck", "Squeeze glutes and quads to stop legs dropping"],
    },
    muscles: {
      primary:   ["Serratus Anterior", "Anterior Deltoid", "Pectoralis Major & Minor"],
      secondary: ["Core (entire)", "Triceps Brachii", "Wrist Flexors", "Glutes"],
    },
    training: [
      { name: "Straddle Planche Hold",  purpose: "Direct progression — reduce leg lever" },
      { name: "Planche Push-Up (Tuck)", purpose: "Builds dynamic planche strength" },
      { name: "Band-Assisted Full Planche", purpose: "Practice the exact position" },
      { name: "Planche Leans (Max Lean)", purpose: "Increase shoulder-past-wrist angle" },
    ],
  },

  {
    skillId: "full_front_lever",
    difficultyNote: "The full front lever is a true elite skill. Smaller, lighter athletes have a significant advantage due to the lever arm involved.",
    technique: {
      setup:        ["Build from straddle front lever", "Hang from bar, arms straight, scapulars depressed"],
      execution:    ["Pull legs together from straddle", "Maintain flat horizontal body position", "Keep arms absolutely straight"],
      bodyPosition: ["Perfectly flat — like lying on an invisible table", "Shoulders level with hips", "Arms straight at all times"],
      breathing:    ["Short controlled breaths", "Exhaling fully causes tension loss"],
      keyCues:      ["Depress scapulars with maximum intent", "Lats pushing into the bar", "Straight arms are non-negotiable", "Progress systematically through tuck → adv tuck → straddle → full"],
    },
    muscles: {
      primary:   ["Latissimus Dorsi", "Posterior Deltoid", "Teres Major"],
      secondary: ["Core (entire)", "Biceps (isometric)", "Lower Traps", "Rhomboids"],
    },
    training: [
      { name: "Straddle Front Lever",   purpose: "The final step before full" },
      { name: "Front Lever Rows",       purpose: "Dynamic strength from front lever position" },
      { name: "Front Lever Raises",     purpose: "Power through the full range" },
      { name: "Weighted Pull-Ups",      purpose: "Continued lat strength gains" },
    ],
  },

  // ── LEGS ────────────────────────────────────────────────────────────────────

  {
    skillId: "pistol_squat",
    difficultyNote: "Equal parts strength, flexibility, and balance. The ankle dorsiflexion and hip flexibility requirements stop many athletes before strength even becomes the limiting factor.",
    technique: {
      setup:        ["Stand on one leg, the other extended straight in front", "Arms out in front for counterbalance", "Find a firm balance before descending"],
      execution:    ["Sit down slowly, keeping your heel flat on the floor", "The free leg stays parallel to the floor throughout", "Touch your glute to your heel at the bottom", "Drive back up through your heel"],
      bodyPosition: ["Heel flat throughout — no heel rise", "Chest up — forward lean is okay but not excessive", "Knee tracks over your toes"],
      breathing:    ["Inhale on the descent", "Exhale and drive on the way up"],
      keyCues:      ["Heel flat is the hardest part", "Use counterbalance arms", "Full depth — glute to heel", "Drive through the heel on the ascent"],
    },
    muscles: {
      primary:   ["Quadriceps", "Glutes", "Hamstrings"],
      secondary: ["Hip Flexors", "Calves", "Core (balance)"],
    },
    training: [
      { name: "Squat",                  purpose: "Bilateral leg strength foundation" },
      { name: "Negative Pistol",        purpose: "Lower slowly — build eccentric strength" },
      { name: "Box Pistol",             purpose: "Limits depth while building the pattern" },
      { name: "Ankle Mobility Work",    purpose: "Dorsiflexion is often the limiting factor" },
      { name: "Hip Flexor Stretching",  purpose: "Free leg height requires hip flexor mobility" },
    ],
  },

  // ── ICONIC SKILLS ───────────────────────────────────────────────────────────

  {
    skillId: "one_arm_handstand",
    difficultyNote: "Perhaps the most demanding skill in bodyweight training. Requires not just double the one-arm balance strength, but exponentially more wrist and finger precision. Expected timeline: 2–5+ years from freestanding handstand.",
    technique: {
      setup:        ["Begin in a solid freestanding two-arm handstand", "Gradually shift weight to one arm over many sessions", "Hand should be directly under the center of mass"],
      execution:    ["Transfer all weight to one hand", "Balance through micro finger pressure adjustments", "Free arm can be by your side or extended"],
      bodyPosition: ["The body shifts slightly to the working arm side — this is normal", "Perfect vertical line still required", "Head neutral or looking at floor"],
      breathing:    ["Slow and controlled — any startle reflex will cause collapse"],
      keyCues:      ["Build through half-transfers first (barely lift one hand)", "Wrist strength and conditioning is critical", "Fingertip sensitivity is the actual skill", "Daily practice of short quality sets"],
    },
    muscles: {
      primary:   ["Deltoids", "Wrist Flexors & Extensors", "Serratus Anterior"],
      secondary: ["Core (entire)", "Finger Flexors", "Triceps"],
    },
    training: [
      { name: "Freestanding Handstand (30+ s)", purpose: "Must be rock solid first" },
      { name: "One-Arm Wall Handstand",          purpose: "Builds single-arm shoulder tolerance" },
      { name: "Handstand Weight Shifts",         purpose: "Learn to transfer weight smoothly" },
      { name: "Wrist Presses & Curls",           purpose: "Condition wrists for single-arm load" },
    ],
  },

  {
    skillId: "iron_cross",
    difficultyNote: "A legendary rings skill requiring exceptional straight-arm horizontal strength. Most athletes need 4–8 years to achieve from a beginner level.",
    technique: {
      setup:        ["Begin in a ring support hold (dip lockout)", "Arms at 90° from body on rings"],
      execution:    ["From support, slowly lower arms to the side to 90°", "Maintain straight arms throughout the lowering", "Hold the cross position"],
      bodyPosition: ["Arms perfectly parallel to the floor", "Straight arms — any bend is a regression", "Body vertical, not leaning"],
      breathing:    ["Short controlled breaths at the hold"],
      keyCues:      ["Straight arms always — this is the entire challenge", "Build through ring dip strength, cross negative, and cross hold with bands", "Work eccentrically first"],
    },
    muscles: {
      primary:   ["Pectoralis Major (deep fibers)", "Anterior Deltoid", "Biceps (isometric)"],
      secondary: ["Serratus Anterior", "Triceps (lockout)", "Core"],
    },
    training: [
      { name: "Ring Dips",             purpose: "Ring instability tolerance and lock-out strength" },
      { name: "Ring Support Hold",     purpose: "Build ring-specific shoulder strength" },
      { name: "Band-Assisted Cross",   purpose: "Practice the exact position safely" },
      { name: "Cross Negatives",       purpose: "Eccentric strength is more achievable first" },
      { name: "Planche Training",      purpose: "Straight-arm horizontal strength transfers" },
    ],
  },

  {
    skillId: "v_sit",
    difficultyNote: "The V-sit demands extreme hip flexor and compression strength. Most athletes find the V-sit significantly harder than the L-sit despite it looking like a small change.",
    technique: {
      setup:        ["Begin from an L-sit position on parallettes", "Arms locked, shoulders depressed"],
      execution:    ["Elevate your legs above horizontal — target 45° above", "Maintain completely straight legs", "Hold"],
      bodyPosition: ["Legs above 45° from horizontal", "Toes pointed", "Arms still locked, shoulders still depressed"],
      breathing:    ["Short controlled breaths"],
      keyCues:      ["Compression strength — it's entirely about hip flexors", "Toes pointed for full extension", "Straight legs non-negotiable", "Protract scapulars hard"],
    },
    muscles: {
      primary:   ["Hip Flexors (Iliopsoas)", "Rectus Abdominis", "Triceps Brachii"],
      secondary: ["Serratus Anterior", "Shoulder Depressors", "Wrist Flexors"],
    },
    training: [
      { name: "L-Sit",                  purpose: "Master L-sit first — must be solid" },
      { name: "Compression Training",   purpose: "Active hip flexor flexibility beyond L-sit height" },
      { name: "Hanging Leg Raises",     purpose: "Hip flexor strength" },
      { name: "Tuck-to-L Sits",         purpose: "Build the support strength dynamically" },
    ],
  },

];

// ─── Lookup Map ───────────────────────────────────────────────────────────────

export const SKILL_ACADEMY_MAP: Record<string, SkillAcademyEntry> = Object.fromEntries(
  ACADEMY_DATA.map((e) => [e.skillId, e]),
);

export function getAcademyEntry(skillId: string): SkillAcademyEntry | null {
  return SKILL_ACADEMY_MAP[skillId] ?? null;
}

// Skills featured on the academy home page (ordered)
export const FEATURED_SKILL_IDS = [
  "muscle_up",
  "front_lever",
  "handstand",
  "human_flag",
  "tuck_planche",
  "one_arm_pull_up",
  "l_sit",
  "handstand_push_up",
  "dragon_flag",
  "pistol_squat",
  "full_planche",
  "full_front_lever",
];
