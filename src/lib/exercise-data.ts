// ─── Rich Exercise Metadata ────────────────────────────────────────────────────
// Provides descriptions, muscles, difficulty ratings, technique tips,
// and common mistakes for every exercise in the workout generator.

import { WorkoutDifficulty } from "./workout-types";

export interface ExerciseDetail {
  description:       string;
  primaryMuscles:    string[];
  secondaryMuscles?: string[];
  difficulty:        WorkoutDifficulty;
  tips:              string[];
  commonMistakes:    string[];
}

export const EXERCISE_DETAIL_MAP: Record<string, ExerciseDetail> = {

  // ── PUSH ────────────────────────────────────────────────────────────────────

  "Push-Ups": {
    description: "The foundational bodyweight push. Lower your chest all the way to the floor, then press back to full arm extension with a rigid body.",
    primaryMuscles: ["Chest", "Triceps", "Front Deltoids"],
    secondaryMuscles: ["Core", "Serratus Anterior"],
    difficulty: "beginner",
    tips: ["Keep your body in a straight line from head to heels", "Elbows at 30–45° to your torso — not flared wide", "Touch chest to floor on every rep for full range of motion"],
    commonMistakes: ["Hips sagging or piking up", "Partial range of motion", "Elbows flaring at 90°", "Head dropping forward"],
  },

  "Diamond Push-Ups": {
    description: "Hands form a diamond shape directly under your chest, shifting load heavily onto the triceps and inner chest.",
    primaryMuscles: ["Triceps", "Inner Chest"],
    secondaryMuscles: ["Front Deltoids", "Core"],
    difficulty: "beginner",
    tips: ["Index fingers and thumbs touch to form the diamond", "Keep elbows close to your sides as you lower", "Full lockout at the top on every rep"],
    commonMistakes: ["Hands placed too far forward or back", "Elbows flaring outward", "Partial range of motion"],
  },

  "Pike Push-Ups": {
    description: "Push-up with hips raised high in a pike position, shifting load to the shoulders. The foundation for handstand push-ups.",
    primaryMuscles: ["Front Deltoids", "Triceps"],
    secondaryMuscles: ["Upper Chest", "Serratus Anterior"],
    difficulty: "beginner",
    tips: ["Hips should be high — the more vertical your torso, the harder it is", "Lower your head toward the floor between your hands", "Press through shoulders, not just arms"],
    commonMistakes: ["Hips too low (becomes a regular push-up)", "Head not going far enough forward", "Bending at the hips during the rep"],
  },

  "Wide Push-Ups": {
    description: "Hands placed wider than shoulder-width to emphasize chest activation and stretch at the bottom.",
    primaryMuscles: ["Chest (Outer)"],
    secondaryMuscles: ["Front Deltoids", "Triceps"],
    difficulty: "beginner",
    tips: ["Wide hands increase chest stretch at the bottom", "Keep core tight throughout", "Don't let elbows travel past 90° at the bottom"],
    commonMistakes: ["Hands so wide they strain the wrists", "Hips sagging", "Rushing through reps"],
  },

  "Decline Push-Ups": {
    description: "Feet elevated on a surface to increase load and target the upper chest and front deltoids.",
    primaryMuscles: ["Upper Chest", "Front Deltoids"],
    secondaryMuscles: ["Triceps", "Core"],
    difficulty: "intermediate",
    tips: ["The higher the elevation, the more shoulder-dominant it becomes", "Keep body rigid — avoid bending at hips", "Control the descent for maximum benefit"],
    commonMistakes: ["Hips piking up", "Neck craning forward", "Using momentum instead of controlled reps"],
  },

  "Pseudo Planche Push-Ups": {
    description: "Hands rotated backward with weight forward over hands, simulating planche lean. Builds the wrist, shoulder, and chest strength for planche work.",
    primaryMuscles: ["Front Deltoids", "Chest", "Wrist Flexors"],
    secondaryMuscles: ["Triceps", "Core"],
    difficulty: "advanced",
    tips: ["Fingers point toward feet or to the sides", "Lean forward before you lower — keep shoulders over or past hands", "Protract (spread) your scapulae throughout"],
    commonMistakes: ["Not enough forward lean — it becomes a regular push-up", "Wrists collapsing inward", "Shoulder blades retracting instead of protracting"],
  },

  "Archer Push-Ups": {
    description: "One-arm loading push-up variation where the working arm bends while the extended arm assists. A stepping stone to one-arm push-ups.",
    primaryMuscles: ["Chest", "Triceps (One Side)"],
    secondaryMuscles: ["Front Deltoids", "Core"],
    difficulty: "advanced",
    tips: ["The extended arm acts as a guide, not a pusher — minimize its contribution over time", "Lower slowly to increase difficulty", "Keep hips square and core braced"],
    commonMistakes: ["Extended arm doing too much work", "Rotating the hips", "Going too wide with the extended arm"],
  },

  "Incline Push-Ups": {
    description: "Hands elevated on a surface to reduce load, making them easier for beginners or for high-rep endurance sets.",
    primaryMuscles: ["Lower Chest", "Triceps"],
    secondaryMuscles: ["Front Deltoids", "Core"],
    difficulty: "beginner",
    tips: ["Higher surface = easier; use this to build base strength", "Maintain rigid body alignment", "Progress to floor push-ups when you can do 20+ clean reps"],
    commonMistakes: ["Hips sagging", "Partial range of motion", "Moving too quickly"],
  },

  "Parallette Push-Ups": {
    description: "Push-ups on parallettes allow a deeper range of motion below the hands, increasing chest stretch and shoulder engagement.",
    primaryMuscles: ["Chest", "Triceps", "Serratus Anterior"],
    secondaryMuscles: ["Front Deltoids", "Core"],
    difficulty: "intermediate",
    tips: ["Lower chest BELOW the parallettes for full ROM", "Protract scapulae at the top", "Keep wrists neutral — one benefit of parallettes"],
    commonMistakes: ["Not using the extra depth available", "Collapsing at the wrists", "Forgetting to protract at top"],
  },

  "Parallette Dips": {
    description: "Dips performed on parallettes instead of bars, providing more freedom for wrist positioning and deeper range of motion.",
    primaryMuscles: ["Triceps", "Chest", "Front Deltoids"],
    secondaryMuscles: ["Core"],
    difficulty: "intermediate",
    tips: ["Lower until upper arms are parallel to the floor (or deeper)", "Keep body slightly forward to load chest more", "Full lockout at the top"],
    commonMistakes: ["Partial range of motion", "Shrugging shoulders at the top", "Swinging for momentum"],
  },

  "L-Sit Dips": {
    description: "Dips performed while holding an L-sit position, combining pressing strength with hip flexor and core strength.",
    primaryMuscles: ["Triceps", "Chest", "Hip Flexors"],
    secondaryMuscles: ["Core", "Quads", "Front Deltoids"],
    difficulty: "advanced",
    tips: ["Master L-sit holds separately before combining with dips", "Keep legs straight and horizontal throughout", "Brace core hard — resist the urge to bend legs"],
    commonMistakes: ["Legs dropping during the dip", "Incomplete dip range of motion", "Hips swinging"],
  },

  "Ring Dips": {
    description: "Dips on gymnastic rings. The instability of the rings demands significant shoulder stability and muscle co-contraction.",
    primaryMuscles: ["Triceps", "Chest", "Anterior Deltoids"],
    secondaryMuscles: ["Core", "Rotator Cuff"],
    difficulty: "intermediate",
    tips: ["Keep rings close to your body throughout", "Turn rings out (RTO) at the top for stability", "Keep shoulder blades retracted and depressed"],
    commonMistakes: ["Rings flaring out uncontrolled", "Not locking out at the top", "Shrugging shoulders instead of using the pecs"],
  },

  "Ring Push-Ups": {
    description: "Push-ups on gymnastics rings set at chest height. The rings can rotate freely, demanding shoulder stability and co-contraction.",
    primaryMuscles: ["Chest", "Triceps", "Serratus Anterior"],
    secondaryMuscles: ["Core", "Rotator Cuff"],
    difficulty: "intermediate",
    tips: ["The lower the rings, the harder — rings at knee level is advanced", "Turn rings out at the top", "Control every rep — no bouncing or swinging"],
    commonMistakes: ["Rings too high making it too easy", "Not turning rings out", "Letting rings drift apart"],
  },

  "Dips": {
    description: "Compound dip on parallel bars or dip station. One of the best upper body mass builders in calisthenics.",
    primaryMuscles: ["Triceps", "Chest", "Front Deltoids"],
    secondaryMuscles: ["Core"],
    difficulty: "beginner",
    tips: ["Lower until upper arms reach parallel with the floor", "Slight forward lean for more chest focus", "Full lockout — lock your elbows at the top"],
    commonMistakes: ["Shrugging at the top", "Partial range of motion", "Flaring elbows far out"],
  },

  "Handstand Push-Up Negatives": {
    description: "Wall-supported handstand push-ups, focusing only on the eccentric (lowering) phase with a 5-second controlled descent.",
    primaryMuscles: ["Deltoids", "Triceps", "Upper Traps"],
    secondaryMuscles: ["Core", "Serratus"],
    difficulty: "advanced",
    tips: ["5-second descent, then kick down — don't push up yet", "Wrists directly under shoulders", "Keep the entire back against the wall"],
    commonMistakes: ["Dropping too fast (no benefit)", "Head going too far forward", "Wrists in weak position"],
  },

  "Straddle Planche Leans": {
    description: "Feet shoulder-width apart in straddle, lean forward over hands until shoulders are over wrists. Builds planche-specific shoulder and wrist strength.",
    primaryMuscles: ["Front Deltoids", "Serratus Anterior", "Wrist Flexors"],
    secondaryMuscles: ["Core", "Chest"],
    difficulty: "intermediate",
    tips: ["Lean forward until shoulders are at or past wrist level", "Protract scapulae fully", "Toes pointed, core tight"],
    commonMistakes: ["Not leaning far enough forward", "Scapulae retracting", "Arms bending"],
  },

  "Ring Fly": {
    description: "Chest fly movement on gymnastic rings. Eccentric control is key — lower slowly to a wide position then press back together.",
    primaryMuscles: ["Chest (Outer)", "Front Deltoids"],
    secondaryMuscles: ["Biceps", "Rotator Cuff"],
    difficulty: "advanced",
    tips: ["Control the lowering phase over 3–5 seconds", "Keep a slight bend in elbows throughout", "Only lower as far as shoulder mobility allows comfortably"],
    commonMistakes: ["Dropping too fast on the way down", "Locking elbows straight (joint stress)", "Going too wide before building the strength"],
  },

  "Shoulder Taps": {
    description: "Push-up position balance drill. Alternate lifting each hand to touch the opposite shoulder while keeping the hips square.",
    primaryMuscles: ["Core (Anti-Rotation)", "Serratus", "Deltoids"],
    secondaryMuscles: ["Chest", "Triceps"],
    difficulty: "beginner",
    tips: ["Widen your feet for more stability", "The goal is zero hip rotation", "Move slowly and deliberately"],
    commonMistakes: ["Hips rocking side to side", "Doing them too fast", "Not keeping core braced"],
  },

  "Tricep Push-Ups": {
    description: "Push-up with hands narrow and elbows tracking straight back along the ribcage, maximizing tricep isolation.",
    primaryMuscles: ["Triceps"],
    secondaryMuscles: ["Chest", "Front Deltoids"],
    difficulty: "beginner",
    tips: ["Elbows move backward along your sides — not outward", "Keep hands shoulder-width or closer", "Full lockout at top"],
    commonMistakes: ["Elbows flaring out (becomes regular push-up)", "Hips sagging", "Partial ROM"],
  },

  // ── PULL ────────────────────────────────────────────────────────────────────

  "Pull-Ups": {
    description: "The king of upper body pulling. Hang from a bar, depress and retract scapulae, then pull chest to bar.",
    primaryMuscles: ["Lats", "Biceps", "Rear Deltoids"],
    secondaryMuscles: ["Core", "Rhomboids", "Teres Major"],
    difficulty: "beginner",
    tips: ["Start each rep in a dead hang — full arm extension", "Lead with the chest, not the chin", "Depress your shoulder blades before pulling"],
    commonMistakes: ["Chin-up style (not pulling chest to bar)", "Kipping (unless training specifically for it)", "Not reaching a full dead hang between reps"],
  },

  "Chin-Ups": {
    description: "Pull-up with underhand (supine) grip, emphasizing biceps and allowing a more vertical pulling path.",
    primaryMuscles: ["Biceps", "Lats"],
    secondaryMuscles: ["Rear Deltoids", "Core"],
    difficulty: "beginner",
    tips: ["Supinate (curl) the wrists as you pull for maximum bicep engagement", "Full dead hang start", "Chest to bar — full ROM"],
    commonMistakes: ["Partial range of motion", "Shrugging shoulders", "Swinging body"],
  },

  "Australian Rows": {
    description: "Horizontal bodyweight rows under a bar or rings. Excellent for beginners building pulling strength and for intermediate athletes targeting rear deltoids.",
    primaryMuscles: ["Rear Deltoids", "Rhomboids", "Biceps"],
    secondaryMuscles: ["Lats", "Core"],
    difficulty: "beginner",
    tips: ["Set bar at hip height for moderate difficulty — lower = harder", "Keep body straight from head to heels", "Pull chest to bar, not chin"],
    commonMistakes: ["Hips sagging", "Pulling with elbows flared too wide", "Short ROM — not touching bar at chest"],
  },

  "Dead Hangs": {
    description: "Passive or active hang from a bar for time. Builds grip strength, decompresses the spine, and prepares connective tissue for pulling work.",
    primaryMuscles: ["Forearm Flexors (Grip)", "Lats (Passive Stretch)"],
    secondaryMuscles: ["Shoulders", "Core"],
    difficulty: "beginner",
    tips: ["Relax fully for spinal decompression", "For active dead hangs, depress shoulder blades without bending arms", "Build up to 60-second holds"],
    commonMistakes: ["Holding breath", "Bent arms (that's a hang with activation, not a dead hang)", "Gripping too tight at wrist level"],
  },

  "Scapular Pull-Ups": {
    description: "Arms-straight scapular depression and retraction drill. Activates the lower traps and lats before pulling — the foundation of safe pull-up mechanics.",
    primaryMuscles: ["Lower Trapezius", "Serratus Anterior", "Lats (Initial Activation)"],
    difficulty: "beginner",
    tips: ["Arms stay straight throughout — this is ALL scapular movement", "Depress (pull down) AND retract (pull together)", "Think 'put your shoulder blades in your back pockets'"],
    commonMistakes: ["Bending the elbows (not the right movement)", "Only doing depression — not also retracting", "Moving too fast"],
  },

  "Archer Pull-Ups": {
    description: "Assymetric pull-up where one arm pulls toward the bar while the other stays extended. Leads toward one-arm pull-ups.",
    primaryMuscles: ["Lats (Pulling Side)", "Biceps (Pulling Side)"],
    secondaryMuscles: ["Core", "Rear Deltoids"],
    difficulty: "advanced",
    tips: ["Working arm pulls chest to it while extended arm guides", "Minimize assistance from the extended arm over time", "Full dead hang between reps"],
    commonMistakes: ["Extended arm contributing too much force", "Rotating the body", "Partial range of motion"],
  },

  "L-Sit Pull-Ups": {
    description: "Pull-ups while maintaining an L-sit hold — legs straight and horizontal. Combines upper body pulling with extreme core compression.",
    primaryMuscles: ["Lats", "Biceps", "Hip Flexors"],
    secondaryMuscles: ["Quads", "Core"],
    difficulty: "advanced",
    tips: ["Master both L-sit holds and pull-ups separately first", "Pull chest to bar while keeping legs horizontal", "Compress your abs to maintain leg position"],
    commonMistakes: ["Legs dropping during the pull", "Incomplete pull-up range of motion", "Rushing and losing the L position"],
  },

  "Muscle-Ups": {
    description: "Pull-up transitioning through the bar to a dip — a complete upper body movement combining pulling and pressing strength.",
    primaryMuscles: ["Lats", "Chest", "Triceps", "Biceps"],
    secondaryMuscles: ["Core", "Deltoids"],
    difficulty: "advanced",
    tips: ["Pull HIGH above the bar before transitioning — not just to chin", "The transition is the hardest part — practice bar dips + chest-to-bar pulls separately", "Keep false grip (for ring muscle-ups)"],
    commonMistakes: ["Not pulling high enough", "Kipping without strength foundation", "Not locking out the dip fully"],
  },

  "Ring Rows": {
    description: "Horizontal rows on gymnastics rings. More challenging than bar rows due to instability.",
    primaryMuscles: ["Rear Deltoids", "Rhomboids", "Biceps"],
    secondaryMuscles: ["Rotator Cuff", "Core"],
    difficulty: "beginner",
    tips: ["Adjust body angle for difficulty — more horizontal = harder", "Keep rings close to ribcage at the top", "Full protraction at the bottom, full retraction at top"],
    commonMistakes: ["Rings drifting away from body at the top", "Hips sagging", "Moving too fast"],
  },

  "Ring Pull-Ups": {
    description: "Pull-ups on gymnastic rings. Ring instability recruits additional stabilizers throughout the shoulder girdle.",
    primaryMuscles: ["Lats", "Biceps"],
    secondaryMuscles: ["Rotator Cuff", "Rear Deltoids"],
    difficulty: "intermediate",
    tips: ["Turn rings out (RTO) at top — palms face forward", "Keep rings close to the body throughout", "Full dead hang start"],
    commonMistakes: ["Rings swinging and twisting", "Not turning out at top", "Momentum"],
  },

  "Ring Muscle-Ups": {
    description: "Muscle-up on gymnastic rings — harder than bar muscle-ups due to instability and the requirement for false grip.",
    primaryMuscles: ["Lats", "Chest", "Triceps"],
    secondaryMuscles: ["Core", "Rotator Cuff"],
    difficulty: "elite",
    tips: ["False grip is essential — wrist on top of ring", "Pull rings to chest then roll forward aggressively", "Rings should turn out at top lockout"],
    commonMistakes: ["No false grip (limits the transition)", "Not committing to the transition", "Bending arms in the hanging position"],
  },

  "Negative Pull-Ups": {
    description: "Only the eccentric (lowering) phase of a pull-up. Start at the top position and lower over 5–7 seconds. Best way to build pull-up strength.",
    primaryMuscles: ["Lats", "Biceps", "Rear Deltoids"],
    secondaryMuscles: ["Core", "Rhomboids"],
    difficulty: "beginner",
    tips: ["Take at least 5 seconds to lower — count out loud", "Start from a true top position (chest to bar)", "Rest adequately — these cause significant muscle damage"],
    commonMistakes: ["Dropping too fast", "Starting from chin height instead of chest to bar", "Not doing full range to dead hang"],
  },

  "Band-Assisted Pull-Ups": {
    description: "Pull-ups with a resistance band looped around the bar and under the feet or knees, reducing bodyweight load.",
    primaryMuscles: ["Lats", "Biceps"],
    secondaryMuscles: ["Rear Deltoids", "Core"],
    difficulty: "beginner",
    tips: ["Use the lightest band that lets you do full ROM pull-ups", "Progress by using thinner bands over time", "Still focus on full dead hang and chest to bar"],
    commonMistakes: ["Relying on the band too much — jumping instead of pulling", "Using a band so thick it becomes a bounce assist", "Not practicing unassisted negatives too"],
  },

  "Commando Pull-Ups": {
    description: "Pull-ups with a parallel (neutral) grip on a bar, alternating which side of the bar the head goes to each rep.",
    primaryMuscles: ["Biceps", "Lats", "Rear Deltoids"],
    secondaryMuscles: ["Core", "Obliques"],
    difficulty: "intermediate",
    tips: ["Grip the bar with both hands facing each other (neutral grip)", "Alternate left and right each rep", "Keep hips from swinging"],
    commonMistakes: ["Bar-crashing into the face when changing sides", "Using momentum to swing", "Incomplete range of motion"],
  },

  "Front Lever Tuck Hold": {
    description: "Hanging from a bar with body horizontal, knees tucked to chest. The entry-level front lever progression that builds scapular and lat strength.",
    primaryMuscles: ["Lats", "Lower Traps", "Core"],
    secondaryMuscles: ["Rear Deltoids", "Biceps (Isometric)"],
    difficulty: "intermediate",
    tips: ["Arms straight — this is an isometric hold, not a pull", "Push the bar toward your feet (don't pull it)", "Tuck hips tightly — aim for the body to be horizontal"],
    commonMistakes: ["Bending the arms", "Hips below horizontal (not tuck enough)", "Holding breath — breathe steadily"],
  },

  // ── CORE ────────────────────────────────────────────────────────────────────

  "Hollow Body Hold": {
    description: "The fundamental gymnastic tension shape. Lower back pressed into the floor, legs and shoulders elevated, creating a concave 'hollow' curve.",
    primaryMuscles: ["Rectus Abdominis", "Hip Flexors", "Obliques"],
    secondaryMuscles: ["Quads", "Glutes", "Serratus"],
    difficulty: "beginner",
    tips: ["Lower back MUST touch the floor — this is non-negotiable", "Arms overhead makes it harder; arms at sides is easier", "Breathe — don't hold breath"],
    commonMistakes: ["Lower back arching off the floor", "Legs too high (makes it easier, defeats purpose)", "Tensing neck and face"],
  },

  "Plank": {
    description: "Forearm or straight-arm hold with body in a rigid straight line. Trains anti-extension core stability.",
    primaryMuscles: ["Core (Transverse Abdominis)", "Glutes"],
    secondaryMuscles: ["Shoulders", "Quads"],
    difficulty: "beginner",
    tips: ["Forearm plank: elbows under shoulders", "Squeeze glutes hard — prevents hip sagging", "Look down at the floor, neutral neck"],
    commonMistakes: ["Hips sagging or piking", "Holding breath", "Looking forward (neck strain)"],
  },

  "Side Plank": {
    description: "Lateral plank position targeting the obliques and hip abductors. Trains anti-lateral-flexion stability.",
    primaryMuscles: ["Obliques", "Hip Abductors", "Glutes (Medius)"],
    secondaryMuscles: ["Core", "Shoulder (Stabilizer)"],
    difficulty: "beginner",
    tips: ["Stack feet on top of each other or stagger for stability", "Drive hips up — don't let them sag to floor", "Straight line from head to heels"],
    commonMistakes: ["Hips dropping down", "Bottom shoulder collapsing", "Holding breath"],
  },

  "Dragon Flag Negatives": {
    description: "Bench-anchored hold where the body is kept rigid from shoulders down. Lowering only — one of the most challenging core exercises available.",
    primaryMuscles: ["Rectus Abdominis", "Hip Flexors"],
    secondaryMuscles: ["Lats", "Lower Back (Isometric)"],
    difficulty: "advanced",
    tips: ["Grip the bench above your head with both hands", "Body must be rigid — no pike at the hips", "Lower as slow as possible — 5–8 seconds is ideal"],
    commonMistakes: ["Hips dropping (piking) — ruins the drill", "Bending knees to make it easier (defeats purpose)", "Momentum from a swing"],
  },

  "L-Sit Tuck": {
    description: "Parallel-bar or floor hold with knees pulled to chest, body lifted off the surface. Foundation for the full L-sit.",
    primaryMuscles: ["Hip Flexors", "Triceps", "Core"],
    secondaryMuscles: ["Chest", "Quads"],
    difficulty: "beginner",
    tips: ["Push straight DOWN through hands to elevate hips", "Pull knees as tight to chest as possible", "Depress shoulder blades before lifting"],
    commonMistakes: ["Bending arms instead of pushing down", "Not getting hips off the ground", "Shrugging shoulders"],
  },

  "Hanging Leg Raises": {
    description: "From a dead hang, raise legs to horizontal (or higher) without swinging. Builds hanging core strength and hip flexor power.",
    primaryMuscles: ["Hip Flexors", "Rectus Abdominis (Lower)"],
    secondaryMuscles: ["Lats (Grip)", "Core"],
    difficulty: "intermediate",
    tips: ["Start from a dead hang — no swing to begin", "Posterior tilt pelvis at the top for extra ab contraction", "Lower with control — don't drop legs"],
    commonMistakes: ["Swinging for momentum", "Bending knees to reduce difficulty", "Dropping legs fast without control"],
  },

  "Ab Wheel Rollouts": {
    description: "Roll an ab wheel forward from kneeling, extending the body, then pull back. Builds powerful anti-extension core strength.",
    primaryMuscles: ["Rectus Abdominis", "Lats"],
    secondaryMuscles: ["Hip Flexors", "Obliques"],
    difficulty: "intermediate",
    tips: ["Start from knees — standing rollouts are extremely advanced", "Don't let your lower back sag at full extension", "Pull back by contracting your abs, not just your lats"],
    commonMistakes: ["Rolling out too far too soon", "Lower back arching", "Using only lat pull instead of core"],
  },

  "V-Ups": {
    description: "Simultaneously raise straight legs and upper body to meet in a V shape. A dynamic core exercise targeting hip flexors and abs.",
    primaryMuscles: ["Hip Flexors", "Rectus Abdominis"],
    difficulty: "intermediate",
    tips: ["Touch hands to feet at the top", "Lower both halves simultaneously with control", "Keep legs straight"],
    commonMistakes: ["Bending knees to make it easier", "Using momentum to swing up", "Not controlling the descent"],
  },

  "Bicycle Crunches": {
    description: "Alternating elbow-to-knee rotation crunches. One of the most effective oblique exercises available.",
    primaryMuscles: ["Obliques", "Rectus Abdominis"],
    difficulty: "beginner",
    tips: ["Move slowly and deliberately — quality over speed", "Extend the opposite leg fully straight", "Hands behind head but don't pull on your neck"],
    commonMistakes: ["Moving too fast (loses effectiveness)", "Neck strain from pulling on head", "Not fully rotating"],
  },

  "Parallette L-Sit": {
    description: "Full L-sit held on parallettes — legs straight and horizontal, body elevated. The goal standard for static core work.",
    primaryMuscles: ["Hip Flexors", "Triceps", "Core"],
    secondaryMuscles: ["Quads", "Lats"],
    difficulty: "intermediate",
    tips: ["Legs must be fully straight and horizontal", "Push hard through hands to lift hips", "Point toes for aesthetic and full quad contraction"],
    commonMistakes: ["Bent knees (it's a tuck L-sit, not full)", "Hips not fully elevated", "Arms bent"],
  },

  "Parallette V-Sit": {
    description: "Advanced L-sit variation where the hips are raised above shoulder height, creating a V shape with the torso and legs.",
    primaryMuscles: ["Hip Flexors", "Core", "Triceps"],
    secondaryMuscles: ["Lats", "Quads"],
    difficulty: "elite",
    tips: ["You need strong compression — practice hip flexor work", "Push hips up and forward", "Maintain external shoulder rotation"],
    commonMistakes: ["Not enough hip compression to elevate legs above horizontal", "Shrugging shoulders", "Bent knees"],
  },

  "Tuck Hold on Floor": {
    description: "Both hands on floor with a tuck body position, attempting to lift and hold bodyweight up. Foundational for tuck planche.",
    primaryMuscles: ["Chest", "Triceps", "Front Deltoids"],
    secondaryMuscles: ["Core", "Serratus"],
    difficulty: "intermediate",
    tips: ["Lean forward so shoulders are over wrists", "Protract scapulae fully", "Tuck knees tightly to chest — compress the tuck"],
    commonMistakes: ["Not enough forward lean — hips stay heavy", "Arms bent", "Scapulae not protracted"],
  },

  "Windshield Wipers": {
    description: "From a bar hang with legs raised, rotate legs from side to side like windshield wipers. Advanced rotational core exercise.",
    primaryMuscles: ["Obliques", "Hip Flexors", "Rectus Abdominis"],
    secondaryMuscles: ["Lats", "Lower Back"],
    difficulty: "advanced",
    tips: ["Get legs to horizontal or higher before rotating", "Control the rotation — don't let gravity take over", "Breathe rhythmically throughout"],
    commonMistakes: ["Swinging legs rather than rotating with control", "Legs bent", "Not returning to center between reps"],
  },

  "Tuck Planche Hold": {
    description: "Planche progression with knees tucked to chest and body balanced horizontally on hands. Builds planche-specific shoulder and core strength.",
    primaryMuscles: ["Front Deltoids", "Serratus Anterior", "Core"],
    secondaryMuscles: ["Chest", "Triceps"],
    difficulty: "intermediate",
    tips: ["Arms stay straight throughout — this is isometric", "Lean forward until shoulders are past wrists", "Protract scapulae maximally"],
    commonMistakes: ["Bent arms", "Not enough forward lean", "Hips dropping below horizontal"],
  },

  // ── BALANCE ─────────────────────────────────────────────────────────────────

  "Single Leg Balance": {
    description: "Stand on one foot and hold, developing proprioception, ankle stability, and single-leg strength.",
    primaryMuscles: ["Glutes", "Calves", "Ankle Stabilizers"],
    secondaryMuscles: ["Core", "Quads"],
    difficulty: "beginner",
    tips: ["Fix your gaze on a point ahead (focal point helps balance)", "Micro-adjustments through the foot — stay active", "Progress to eyes closed or an unstable surface"],
    commonMistakes: ["Gripping the floor with toes too hard", "Stiff, tense body — stay relaxed", "Not maintaining correct posture"],
  },

  "Handstand Wall Hold": {
    description: "Wall-supported handstand held for time. Builds shoulder endurance, wrist strength, and body line awareness.",
    primaryMuscles: ["Deltoids", "Triceps", "Wrist Flexors"],
    secondaryMuscles: ["Core", "Serratus"],
    difficulty: "beginner",
    tips: ["Chest-to-wall position: hands 6 inches from wall, face the floor", "Squeeze glutes and point toes for full body tension", "Press through hands — active shoulders"],
    commonMistakes: ["Banana shape (lower back arch)", "Passive arms instead of pressing up", "Looking down at the floor (ruins alignment)"],
  },

  "Crow Pose": {
    description: "Yoga-origin arm balance with knees resting on upper arms. The first basic arm balance — develops wrist and shoulder strength.",
    primaryMuscles: ["Triceps", "Wrist Flexors", "Core"],
    secondaryMuscles: ["Chest", "Deltoids"],
    difficulty: "beginner",
    tips: ["Shift weight progressively forward onto hands — tipping point is the skill", "Look forward (not down) to shift weight", "Squeeze elbows inward to create shelf for knees"],
    commonMistakes: ["Looking down (shifts weight backward)", "Not leaning forward enough", "Arms too wide"],
  },

  "Headstand": {
    description: "Tripod or straight-arm headstand held for time. Develops inversion comfort, neck strength, and balance.",
    primaryMuscles: ["Neck", "Deltoids", "Core"],
    difficulty: "beginner",
    tips: ["Tripod: head and hands form a triangle on the floor", "Always kick up near a wall first", "Keep legs together and pointed"],
    commonMistakes: ["Too much weight on neck (use strong arms to support)", "Legs bent and uncontrolled", "Looking forward instead of down"],
  },

  "Handstand Kick-Ups": {
    description: "Practice kicking into a free handstand. The repetitive drill for developing freestanding handstand balance.",
    primaryMuscles: ["Deltoids", "Core", "Wrist Flexors"],
    secondaryMuscles: ["Serratus", "Glutes"],
    difficulty: "intermediate",
    tips: ["Consistent kick — same energy every time to learn the balance point", "Kick up gently — you don't need much force", "Actively adjust fingers to balance: tuck into fall, push to come back"],
    commonMistakes: ["Kicking too hard and over-shooting", "Inconsistent kick strength (can't learn the balance point)", "Stiff wrists not absorbing and adjusting"],
  },

  "Tuck Handstand": {
    description: "Handstand with knees tucked to chest, reducing height and making balance more accessible. Bridge between wall handstand and freestanding.",
    primaryMuscles: ["Deltoids", "Wrist Flexors", "Core"],
    difficulty: "intermediate",
    tips: ["Pull knees toward chest — keep tuck tight", "Keep arms straight", "Balance adjustments through fingers"],
    commonMistakes: ["Arms bending under the load", "Tuck not tight enough", "Tensing the whole body instead of just using finger pressure to adjust"],
  },

  "Frog Stand": {
    description: "Hands on the floor with knees resting on the back of the upper arms. Held for time. Entry-level arm balance.",
    primaryMuscles: ["Triceps", "Wrist Flexors", "Core"],
    difficulty: "beginner",
    tips: ["Knees rest on arms above the elbow (tricep area)", "Lean forward slowly until feet lift off", "Look slightly forward"],
    commonMistakes: ["Not leaning forward enough — weight stays in feet", "Knees below the elbows (no shelf)", "Holding breath"],
  },

  "Parallette Frog Stand": {
    description: "Frog stand on parallettes, allowing more forward lean and deeper wrist loading. Builds toward tuck planche.",
    primaryMuscles: ["Triceps", "Front Deltoids", "Core"],
    difficulty: "intermediate",
    tips: ["Parallettes allow wrists to be neutral — less wrist strain", "Lean farther forward than on floor frog stand", "Protract scapulae"],
    commonMistakes: ["Same as frog stand — not enough forward lean", "Arms bent", "Tight hip flexors preventing the tuck"],
  },

  "Wall Handstand": {
    description: "General wall handstand practice at various levels. Builds confidence and time under tension in inversion.",
    primaryMuscles: ["Deltoids", "Triceps", "Serratus"],
    difficulty: "beginner",
    tips: ["Use as time under tension — hold as long as form allows", "Keep a rigid body with engaged core", "Breathe steadily"],
    commonMistakes: ["Banana back", "Not actively pressing", "Relying entirely on the wall"],
  },

  "Tiger Bend Hold": {
    description: "Forearm handstand (elbow balance) hold. A precursor to the tiger bend push-up and valuable for shoulder flexibility.",
    primaryMuscles: ["Deltoids", "Core", "Triceps"],
    difficulty: "intermediate",
    tips: ["Forearms on the floor with elbows at shoulder width", "Press forearms down to elevate body", "Tall neck"],
    commonMistakes: ["Elbows too wide", "Not enough pressure through forearms to stay stable", "Arched lower back"],
  },

  // ── EXPLOSIVE ───────────────────────────────────────────────────────────────

  "Box Jumps": {
    description: "Explosive jump onto a box, developing lower body power, fast-twitch recruitment, and landing mechanics.",
    primaryMuscles: ["Quads", "Glutes", "Calves"],
    secondaryMuscles: ["Core", "Hamstrings"],
    difficulty: "intermediate",
    tips: ["Swing arms for momentum", "Land softly — absorb with hips and knees", "Step down, don't jump down"],
    commonMistakes: ["Jumping down (joint stress)", "Landing with knees caving in", "Box too high for current ability"],
  },

  "Clap Push-Ups": {
    description: "Explosive push-up where you push off the floor and clap before catching yourself. Builds upper body power.",
    primaryMuscles: ["Chest", "Triceps", "Front Deltoids"],
    difficulty: "intermediate",
    tips: ["Push EXPLOSIVELY — you need height, not just hand speed for the clap", "Land with slightly bent arms to absorb", "Full push-up ROM before the explosive push"],
    commonMistakes: ["Partial range before the explosive push", "Landing with locked elbows (injury risk)", "Not generating enough height"],
  },

  "Plyometric Push-Ups": {
    description: "Any explosive push-up variant where hands leave the floor. Develops upper body power and fast-twitch fibers.",
    primaryMuscles: ["Chest", "Triceps", "Deltoids"],
    difficulty: "intermediate",
    tips: ["Full ROM before the explosive phase", "Land soft with bent arms", "Keep core rigid throughout"],
    commonMistakes: ["Partial ROM before pushing", "Stiff-arm landing", "No power — just shuffling hands"],
  },

  "Explosive Pull-Ups": {
    description: "Pull-up performed as fast and high as possible, aiming to get chest or abdomen to bar. Foundation for muscle-ups.",
    primaryMuscles: ["Lats", "Biceps", "Rear Deltoids"],
    difficulty: "intermediate",
    tips: ["Pull AS FAST as possible — this is about speed, not load", "Aim to pull higher than the bar each rep", "Rest 2–3 minutes between sets for full power output"],
    commonMistakes: ["Kipping instead of straight-body explosive pulling", "Not pulling high enough", "Insufficient rest — fatigued explosive work is just slow pull-ups"],
  },

  "Kip Swings": {
    description: "Hollow-arch swing mechanic on a bar. The fundamental skill for kipping pull-ups and bar muscle-ups.",
    primaryMuscles: ["Lats", "Core", "Shoulders"],
    difficulty: "beginner",
    tips: ["Alternate between hollow body and arch body in a wave pattern", "Push the bar away at the front of the swing", "Build amplitude gradually"],
    commonMistakes: ["Bending knees (kills the swing)", "Moving from hips instead of chest/shoulders", "Too much amplitude too soon"],
  },

  "Burpees": {
    description: "Full-body explosive conditioning movement: squat, plank, push-up, squat, jump. High metabolic demand.",
    primaryMuscles: ["Full Body — Quads, Chest, Shoulders"],
    difficulty: "beginner",
    tips: ["Maintain push-up form even when tired", "Jump explosively at the top", "Set a sustainable pace — don't blow up in the first set"],
    commonMistakes: ["Sloppy push-up portion", "Weak jump at the top", "Moving too fast and breaking down form"],
  },

  "Jumping Lunges": {
    description: "Explosive alternating lunge jumps that switch legs in the air. Develops single-leg power and cardiovascular fitness.",
    primaryMuscles: ["Quads", "Glutes", "Calves"],
    secondaryMuscles: ["Core", "Hamstrings"],
    difficulty: "intermediate",
    tips: ["Land with soft knee — knee stays over foot", "Drive through the front heel to launch", "Use arms for momentum"],
    commonMistakes: ["Knee caving inward on landing", "Shallow lunge depth", "Landing heavy — no absorption"],
  },

  "Tuck Jumps": {
    description: "Vertical jumps where knees are pulled to chest at the peak. Develops explosive power and hip flexor speed.",
    primaryMuscles: ["Quads", "Glutes", "Hip Flexors"],
    difficulty: "beginner",
    tips: ["Maximize height before pulling knees up", "Land with soft knees", "Get back into jump immediately for plyometric benefit"],
    commonMistakes: ["Not getting full height first", "Landing stiff-legged", "Knees not reaching chest"],
  },

  "Broad Jump": {
    description: "Maximal horizontal jump for distance. Tests and develops explosive lower body power.",
    primaryMuscles: ["Quads", "Glutes", "Calves"],
    difficulty: "intermediate",
    tips: ["Swing arms back before the jump", "Push off at approximately 45° angle", "Land with both feet, absorb through hips and knees"],
    commonMistakes: ["Not using arm swing", "Too vertical or too horizontal angle", "Landing stiff"],
  },

  "Depth Jumps": {
    description: "Step off a box, land, and immediately jump as high as possible. Maximizes stretch-shortening cycle power.",
    primaryMuscles: ["Quads", "Glutes", "Calves"],
    difficulty: "advanced",
    tips: ["Ground contact time must be MINIMAL — the speed of the reactive jump is the goal", "Step off, don't jump off", "Box height should be low — 12–18 inches is plenty"],
    commonMistakes: ["Jumping off the box instead of stepping", "Long ground contact (defeats purpose)", "Box too high (too much impact)"],
  },

  "Lateral Bounds": {
    description: "Explosive single-leg lateral jumps from side to side. Develops lateral power and hip stability.",
    primaryMuscles: ["Glutes (Abductors)", "Quads", "Calves"],
    difficulty: "beginner",
    tips: ["Land on a single foot, absorb the load, then bound the other direction", "Drive off the outside of the foot", "Keep torso upright"],
    commonMistakes: ["Landing with knee caving inward", "Two-foot landing (loses single-leg demand)", "Short bounds with no power"],
  },

  // ── LEGS ────────────────────────────────────────────────────────────────────

  "Squats": {
    description: "The foundational lower body strength exercise. Hip crease below knee with chest up and weight through heels.",
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core", "Calves"],
    difficulty: "beginner",
    tips: ["Knees track over toes — push them out", "Depth: hip crease below knee minimum", "Drive through heels and mid-foot to stand"],
    commonMistakes: ["Knees caving inward", "Heels lifting (hip and ankle mobility issue)", "Rounding lower back at the bottom"],
  },

  "Lunges": {
    description: "Alternating single-leg step lunge. Develops quad and glute strength with single-leg stability demand.",
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core", "Hip Flexors"],
    difficulty: "beginner",
    tips: ["Front knee stays over front ankle — don't let it shoot past toes", "Back knee comes to about an inch from the floor", "Keep torso upright"],
    commonMistakes: ["Front knee caving inward", "Leaning forward with torso", "Incomplete range of motion"],
  },

  "Bulgarian Split Squats": {
    description: "Rear foot elevated split squat — extremely challenging single-leg exercise for quad and glute development.",
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Core", "Hip Flexors (Rear Leg)"],
    difficulty: "intermediate",
    tips: ["Rear foot on bench, laces down", "Torso upright (for quad focus) or slightly forward (glute focus)", "Front foot far enough forward that shin stays close to vertical"],
    commonMistakes: ["Front foot too close (knee past toes excessively)", "Torso collapsing forward", "Knee caving"],
  },

  "Pistol Squat Negatives": {
    description: "Single-leg squat lowering only — one leg extended forward while squatting to depth on the other. Builds toward the full pistol squat.",
    primaryMuscles: ["Quads", "Glutes (Single Leg)"],
    secondaryMuscles: ["Core", "Ankle Stabilizers"],
    difficulty: "intermediate",
    tips: ["Take 5 seconds to lower — count it out", "Hold onto something for balance assistance as needed", "Keep heel of working leg down the whole time"],
    commonMistakes: ["Dropping too fast", "Heel lifting", "Torso collapsing forward"],
  },

  "Nordic Curls": {
    description: "Knees anchored, lower body under its own weight. The gold standard for hamstring eccentric strength.",
    primaryMuscles: ["Hamstrings"],
    secondaryMuscles: ["Glutes", "Calves"],
    difficulty: "advanced",
    tips: ["Lower as slowly as possible — catch yourself with hands when you can't control it", "Keep body straight from knees to head", "Use hands to push back up"],
    commonMistakes: ["Hips bending (using hip extensors instead of hamstrings)", "Dropping too fast", "Not anchoring feet properly"],
  },

  "Jump Squats": {
    description: "Explosive squat variation jumping at the top. Develops lower body power and plyometric ability.",
    primaryMuscles: ["Quads", "Glutes", "Calves"],
    difficulty: "beginner",
    tips: ["Squat to parallel then drive explosively", "Land softly — absorb through ankles, knees, hips", "Minimal ground contact for plyometric training"],
    commonMistakes: ["Landing stiff-legged", "Knee collapse on landing", "Shallow squat before jumping"],
  },

  "Calf Raises": {
    description: "Single or double leg calf raise through full range of motion. Builds gastrocnemius and soleus strength.",
    primaryMuscles: ["Gastrocnemius", "Soleus"],
    difficulty: "beginner",
    tips: ["Full range — stretch at the bottom, max elevation at top", "Slow and controlled for strength; faster for endurance", "Single leg increases difficulty significantly"],
    commonMistakes: ["Partial range (not stretching heel below platform)", "Bouncing at the bottom", "Rolling ankle outward"],
  },

  "Glute Bridges": {
    description: "Supine hip extension exercise targeting the glutes. Foundation for hip hinge strength and glute development.",
    primaryMuscles: ["Glutes", "Hamstrings"],
    secondaryMuscles: ["Core", "Lower Back"],
    difficulty: "beginner",
    tips: ["Drive through heels — not the balls of feet", "Squeeze glutes at the top for 1–2 seconds", "Keep core braced — don't hyperextend lower back"],
    commonMistakes: ["Using lower back to lift instead of glutes", "Feet too close or far from body", "Not squeezing at the top"],
  },

  "Step-Ups": {
    description: "Step onto an elevated surface with one leg at a time. Develops single-leg quad strength and coordination.",
    primaryMuscles: ["Quads", "Glutes"],
    difficulty: "beginner",
    tips: ["Drive through the heel of the elevated foot — don't push off the back foot", "Box height: knee at 90° when foot is on step", "Control the lowering phase"],
    commonMistakes: ["Pushing off the rear foot (making it a calf raise assist)", "Knee caving inward", "Not controlling the descent"],
  },

  "Single-Leg Deadlift": {
    description: "Hip-hinge on a single leg with the opposite leg extending behind. Develops hip hinge mechanics, hamstring flexibility, and single-leg stability.",
    primaryMuscles: ["Hamstrings", "Glutes"],
    secondaryMuscles: ["Core", "Lower Back"],
    difficulty: "intermediate",
    tips: ["Hinge at the hip — not the lower back", "Keep back flat throughout", "Working leg has a slight bend — not locked"],
    commonMistakes: ["Rounding the back", "Hip rotating open instead of square", "Rushing through reps"],
  },

  "Sumo Squats": {
    description: "Wide stance squat with toes pointing outward, targeting inner thighs and glutes differently than conventional squats.",
    primaryMuscles: ["Glutes", "Inner Thighs (Adductors)", "Quads"],
    difficulty: "beginner",
    tips: ["Stance: about 1.5–2x shoulder width, toes out 30–45°", "Knees track over toes throughout", "Stay upright — less forward lean than regular squats"],
    commonMistakes: ["Stance too narrow (loses inner thigh benefits)", "Knees caving inward", "Excessive forward lean"],
  },

  "Reverse Lunges": {
    description: "Step backward into a lunge, reducing knee stress compared to forward lunges while building single-leg strength.",
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Core", "Hamstrings"],
    difficulty: "beginner",
    tips: ["Step back far enough that front shin stays vertical", "Lower back knee toward the floor with control", "Drive through the front heel to return"],
    commonMistakes: ["Front knee shooting forward past toes", "Collapsing torso forward", "Rear knee crashing into floor"],
  },

  // ── MOBILITY ────────────────────────────────────────────────────────────────

  "Deep Squat Hold": {
    description: "Hold the bottom of a squat position (heels flat, hips below knees) for extended time. Restores fundamental movement capacity.",
    primaryMuscles: ["Hip Flexors", "Hip External Rotators", "Ankles"],
    difficulty: "beginner",
    tips: ["Use a doorframe or pole to assist initially", "Push knees out with elbows for hip external rotation", "Work depth gradually — don't force"],
    commonMistakes: ["Heels rising (use heel elevation until ankle mobility improves)", "Rounding the lower back excessively", "Knees collapsing inward"],
  },

  "Jefferson Curl": {
    description: "Slow, articulated spinal flexion stretch with weight. Progressively decompresses and mobilizes each vertebral segment.",
    primaryMuscles: ["Spinal Extensors (Stretch)", "Hamstrings"],
    difficulty: "beginner",
    tips: ["Move slowly — articulate each vertebra from neck to lumbar", "Start light or with no weight", "Reverse the movement just as slowly"],
    commonMistakes: ["Moving too fast (no articulation benefit)", "Too much weight before tissue is adapted", "Holding breath"],
  },

  "Shoulder Dislocates": {
    description: "Straight-arm rotation with a stick or band from front to back. Essential shoulder mobility drill for overhead and handstand work.",
    primaryMuscles: ["Shoulder Capsule", "Pecs", "Rear Deltoids"],
    difficulty: "beginner",
    tips: ["Start with a wide grip — bring it closer over time", "Keep elbows straight throughout", "Move through full range — don't stop at discomfort"],
    commonMistakes: ["Bending elbows to make it easier", "Grip too narrow before ready", "Rushing through the movement"],
  },

  // ── WARMUP ──────────────────────────────────────────────────────────────────

  "Arm Circles": {
    description: "Shoulder joint warm-up. Progressively increasing circles in both directions to prepare the shoulder girdle.",
    primaryMuscles: ["Deltoids", "Rotator Cuff"],
    difficulty: "beginner",
    tips: ["Start small and increase circle size", "Keep arm straight and feel the rotation at the shoulder joint", "Both directions — 10–15 each"],
    commonMistakes: ["Moving too fast", "Using the whole torso to swing the arm"],
  },

  "Inchworms": {
    description: "Walk hands out to push-up position, then walk feet to hands. A full-body warm-up targeting hamstrings, shoulders, and thoracic spine.",
    primaryMuscles: ["Hamstrings", "Calves", "Shoulders"],
    difficulty: "beginner",
    tips: ["Keep legs as straight as possible walking out and in", "Pause in push-up position for 1–2 seconds", "Spread the movement through the whole spine"],
    commonMistakes: ["Bending knees too much", "Rushing (loses thoracic benefit)", "Not pausing at push-up position"],
  },

  "Jumping Jacks": {
    description: "Classic full-body cardiovascular warm-up raising heart rate and mobilizing hips and shoulders.",
    primaryMuscles: ["Full Body (Cardio)"],
    difficulty: "beginner",
    tips: ["Land softly on the balls of feet", "Full arm extension overhead on each rep", "Set a consistent rhythm"],
    commonMistakes: ["Landing heavy on heels", "Half-range arm movement", "Going too fast too soon"],
  },

  "Wrist Circles": {
    description: "Full wrist joint warm-up circles. Essential before any pressing, planche, or handstand work.",
    primaryMuscles: ["Wrist Flexors/Extensors", "Forearm Muscles"],
    difficulty: "beginner",
    tips: ["Both directions — 10–15 each direction", "Make the circles as large as possible", "Include loaded stretches (lean on hands on floor) after circles"],
    commonMistakes: ["Skipping this before wrist-intensive work", "Small range circles", "Only doing one direction"],
  },
};
