/**
 * Ignyte preview content
 * ----------------------
 * Source of truth for the new game-jam sections brought in from
 * `frontend/public/ignyte-preview.html`. Centralising the data here lets
 * the section components stay small and keeps the content easy to edit.
 *
 * Sections that consume this file:
 *   - Mission.tsx
 *   - Roles.tsx        (9 roles + role quiz)
 *   - TheJam.tsx
 *   - ToolsSection.tsx
 *   - ArchitectSeat.tsx
 *   - Awards.tsx
 *   - Outcomes.tsx
 *   - ForParents.tsx
 *   - FAQ.tsx
 *   - PyrelochLab.tsx
 */

export type RoleCategory = 'code' | 'art' | 'direction'

export interface Role {
  id: string
  icon: string
  name: string
  cat: RoleCategory
  one: string
  do: string
  build: string
  love: string
  tint: string
  glow: string
}

export const ROLES: Role[] = [
  {
    id: 'gameplay',
    icon: 'gamepad-2',
    name: 'The Mechanic',
    cat: 'code',
    one: 'You make the world react.',
    do: 'You write the rules under every button press. Movement, collisions, scoring, the feel of a jump. Without you, nothing moves.',
    build: 'Computational thinking, logic, debugging.',
    love: 'You think in steps. When something breaks, you want to know why.',
    tint: 'oklch(0.8 0.16 60)',
    glow: 'oklch(0.75 0.17 58 / 0.45)',
  },
  {
    id: 'systems',
    icon: 'wrench',
    name: 'The Architect',
    cat: 'code',
    one: 'You build what the game runs on.',
    do: "Not gameplay — the plumbing. Websites, leaderboards, build scripts, deploy pipelines. The stuff that turns a folder into a shipped game.",
    build: 'Real software engineering. Web, backend, devops.',
    love: 'You love code but not necessarily game logic. You want to ship real things.',
    tint: 'oklch(0.74 0.11 158)',
    glow: 'oklch(0.6 0.1 158 / 0.45)',
  },
  {
    id: 'animator',
    icon: 'clapperboard',
    name: 'The Rigger',
    cat: 'code',
    one: 'You make things move, by code.',
    do: 'You build the skeletons and the systems that make things move — rigging, procedural motion, physics, VFX. You sit between art and code, turning animations into something the engine can actually play.',
    build: 'Math, timing, and a feel for motion.',
    love: 'You like code and visuals equally. You want things to look alive, not just correct.',
    tint: 'oklch(0.7 0.18 20)',
    glow: 'oklch(0.62 0.2 22 / 0.45)',
  },
  {
    id: 'concept',
    icon: 'palette',
    name: 'The Concept',
    cat: 'art',
    one: 'You give the world a face.',
    do: 'Characters, environments, colour and mood — and the 2D art that carries them. The first thing a player falls for. That\u2019s you, from a blank canvas.',
    build: 'Visual communication and composition.',
    love: 'You see the world in pictures before words.',
    tint: 'oklch(0.85 0.14 88)',
    glow: 'oklch(0.83 0.13 86 / 0.45)',
  },
  {
    id: 'sculpt',
    icon: 'boxes',
    name: 'The Sculptor',
    cat: 'art',
    one: 'You build in three dimensions.',
    do: 'You build in three dimensions — models, props, environments. You turn grey blocks into places a player wants to walk through.',
    build: 'Spatial thinking, form, and lighting.',
    love: 'You think in volume, not flat planes.',
    tint: 'oklch(0.72 0.19 35)',
    glow: 'oklch(0.56 0.21 38 / 0.45)',
  },
  {
    id: 'sound',
    icon: 'music',
    name: 'The Composer',
    cat: 'art',
    one: 'You set the mood.',
    do: 'Music and sound design. The thing players remember without knowing why. A game without you feels hollow.',
    build: 'Ear, timing, and emotional instinct.',
    love: 'You hum soundtracks. Silence bothers you more than noise.',
    tint: 'oklch(0.78 0.13 75)',
    glow: 'oklch(0.72 0.14 70 / 0.45)',
  },
  {
    id: 'writer',
    icon: 'pen-line',
    name: 'The Scribe',
    cat: 'direction',
    one: 'You give the world a soul.',
    do: 'You write the characters, the dialogue, the choices that branch. You give players a reason to care beyond the mechanics — a why behind every fight. A game without you is just a pile of systems.',
    build: 'Creative writing, structure, voice.',
    love: 'You hear characters talk in your head before you write them down.',
    tint: 'oklch(0.72 0.18 12)',
    glow: 'oklch(0.65 0.19 15 / 0.45)',
  },
  {
    id: 'designer',
    icon: 'map',
    name: 'The Weaver',
    cat: 'direction',
    one: 'You shape the experience.',
    do: 'You design the experience itself — the levels, the pacing, the rules that make it fun. You balance challenge and reward, decide what the player does moment to moment, and shape how the whole thing feels to play. You make it play well, not just look good.',
    build: 'Systems thinking, empathy, iteration.',
    love: "You've redone a level layout in your head three times already.",
    tint: 'oklch(0.72 0.11 165)',
    glow: 'oklch(0.6 0.1 160 / 0.45)',
  },
  {
    id: 'director',
    icon: 'target',
    name: 'The Director',
    cat: 'direction',
    one: 'You hold the vision.',
    do: "You hold the whole vision. You make the calls when the team disagrees, defend the scope when the clock's against you, and own what the game ultimately feels like to play. You're the tie-breaker and the north star — the one who makes sure five people ship one game, not five different ones.",
    build: 'Taste, communication, leadership.',
    love: "You see the whole game in your head and get frustrated when others don't. Yet.",
    tint: 'oklch(0.8 0.1 80)',
    glow: 'oklch(0.75 0.12 85 / 0.4)',
  },
]

export interface Tool {
  name: string
  kind: string
  icon: string
  filter: string
}

export const TOOLS: Tool[] = [
  { name: 'Godot', kind: 'Game engine', icon: 'gamepad-2', filter: 'engine' },
  { name: 'Unity', kind: 'Game engine', icon: 'gamepad-2', filter: 'engine' },
  { name: 'Unreal', kind: 'Game engine', icon: 'monitor-play', filter: 'engine' },
  { name: 'Defold', kind: '2D engine', icon: 'gamepad-2', filter: 'engine' },
  { name: 'Bevy', kind: 'Rust engine', icon: 'cpu', filter: 'engine' },
  { name: 'Krita', kind: 'Digital painting', icon: 'palette', filter: 'art' },
  { name: 'Aseprite', kind: 'Pixel art', icon: 'layers', filter: 'art' },
  { name: 'GIMP', kind: 'Image editing', icon: 'palette', filter: 'art' },
  { name: 'Inkscape', kind: 'Vector art', icon: 'pen-tool', filter: 'art' },
  { name: 'Blender', kind: '3D + animation', icon: 'boxes', filter: '3d' },
  { name: 'Spine', kind: '2D animation', icon: 'clapperboard', filter: 'art' },
  { name: 'OpenToonz', kind: '2D animation', icon: 'clapperboard', filter: 'art' },
  { name: 'Synfig', kind: '2D animation', icon: 'clapperboard', filter: 'art' },
  { name: 'Audacity', kind: 'Sound editing', icon: 'music', filter: 'audio' },
  { name: 'LMMS', kind: 'Music making', icon: 'music', filter: 'audio' },
  { name: 'Reaper', kind: 'DAW', icon: 'music', filter: 'audio' },
  { name: 'Bosca Ceoil', kind: 'Music, easy', icon: 'music', filter: 'audio' },
  { name: 'jsfxr', kind: 'Sound effects', icon: 'music', filter: 'audio' },
  { name: 'Figma', kind: 'UI design', icon: 'pen-tool', filter: 'art' },
  { name: 'Penpot', kind: 'UI design, open', icon: 'pen-tool', filter: 'art' },
  { name: 'VS Code', kind: 'Code editor', icon: 'code-2', filter: 'code' },
  { name: 'Cursor', kind: 'AI code editor', icon: 'code-2', filter: 'code' },
  { name: 'Git', kind: 'Version control', icon: 'git-branch', filter: 'code' },
  { name: 'GitHub Desktop', kind: 'Git, visual', icon: 'git-branch', filter: 'code' },
  { name: 'Twine', kind: 'Narrative', icon: 'pen-line', filter: 'narrative' },
  { name: 'ink', kind: 'Branching story', icon: 'pen-line', filter: 'narrative' },
  { name: 'DaVinci Resolve', kind: 'Trailer editing', icon: 'clapperboard', filter: 'ship' },
  { name: 'OBS', kind: 'Capture + stream', icon: 'monitor-play', filter: 'ship' },
  { name: 'Notion', kind: 'Docs + planning', icon: 'layers', filter: 'ship' },
  { name: 'Next.js', kind: 'Game websites', icon: 'globe', filter: 'code' },
  { name: 'Trello', kind: 'Task tracking', icon: 'target', filter: 'ship' },
]

export const TOOL_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'engine', label: 'Engines' },
  { id: 'art', label: 'Art & 2D' },
  { id: '3d', label: '3D' },
  { id: 'audio', label: 'Audio' },
  { id: 'code', label: 'Code' },
  { id: 'narrative', label: 'Narrative' },
  { id: 'ship', label: 'Ship & Stream' },
]

export interface Award {
  icon: string
  name: string
  blurb: string
}

export const AWARDS: Award[] = [
  { icon: 'lightbulb', name: 'Most Original Concept', blurb: 'The idea nobody else would\u2019ve thought of.' },
  { icon: 'star', name: 'Best Character & World', blurb: 'The one players won\u2019t shut up about.' },
  { icon: 'cpu', name: 'Best Technical Build', blurb: 'Clean code, smooth ship, no crashes.' },
  { icon: 'palette', name: 'Best Art & Sound', blurb: 'The look and the mood, together.' },
  { icon: 'pen-line', name: 'Best Story & Design', blurb: 'The narrative and the systems that carried it.' },
  { icon: 'trophy', name: 'People\u2019s Choice', blurb: 'Voted by everyone in the room.' },
]

export interface Outcome {
  icon: string
  label: string
}

export const OUTCOMES: Outcome[] = [
  { icon: 'layers', label: 'Systems & design thinking' },
  { icon: 'pen-line', label: 'Writing that carries weight' },
  { icon: 'palette', label: 'A real visual eye' },
  { icon: 'users', label: 'Shipping with a team' },
  { icon: 'megaphone', label: 'Pitching your work' },
  { icon: 'timer', label: 'Cutting under pressure' },
]

export interface Faq {
  q: string
  a: string
}

export const FAQS: Faq[] = [
  {
    q: 'Do I need to know how to code?',
    a: 'No. Nine roles, and only some of them touch code. Artists, writers, designers, sound folks. Every team needs all of them.',
  },
  {
    q: 'How does my team get built?',
    a: 'Five fixed seats: a Captain, a Code role, an Art role, a Narrative/Design role, and a Wildcard who can be anything. You bring the people, we slot them into the seats.',
  },
  {
    q: 'What if I don\u2019t have a full team?',
    a: 'Register what you have and mark it on the form. We\u2019ll match you with free agents before kickoff to round out your seats.',
  },
  {
    q: 'What does it cost?',
    a: '₹500 per student. That\u2019s the whole fee for the two days.',
  },
  {
    q: 'What should I bring?',
    a: 'A laptop if you have one. We\u2019ll have machines for teams that don\u2019t. Everything else, the tools and assets, is free.',
  },
  {
    q: 'Do I pick my role ahead of time?',
    a: 'You can. Take the quiz above and lock it in on the form. You can also figure it out at kickoff. No pressure either way.',
  },
  {
    q: 'Who picks the theme?',
    a: 'Pyreloch. It stays sealed until kickoff. Everyone finds out at the same moment.',
  },
  {
    q: 'What can we actually make in two days?',
    a: 'Small and finished beats big and broken. A tight platformer, a short narrative, a polished mini-game. Scope down, polish up.',
  },
]

export type QuizAnswer = 'coder' | 'artist' | 'director'

export interface QuizQuestion {
  q: string
  options: [string, QuizAnswer][]
}

export const QUIZ: QuizQuestion[] = [
  {
    q: 'A blank screen. What goes there first?',
    options: [
      ['The rules — what can the player actually do?', 'coder'],
      ['A character. What do they look like?', 'artist'],
      ['A line of dialogue. Who\u2019s talking and why?', 'director'],
    ],
  },
  {
    q: 'The part of any game you fall for hardest.',
    options: [
      ['The systems ticking under the hood', 'coder'],
      ['The art and the music', 'artist'],
      ['The characters and where the story goes', 'director'],
    ],
  },
  {
    q: 'Your favourite kind of problem.',
    options: [
      ['Something won\u2019t compile and I want to know why', 'coder'],
      ["The composition\u2019s off and I can feel it", 'artist'],
      ['The pacing drags and I need to cut', 'director'],
    ],
  },
  {
    q: 'Pick the tool you\u2019d open, just for fun.',
    options: [
      ['A code editor', 'coder'],
      ['A drawing tablet or a DAW', 'artist'],
      ['A blank doc or a notebook', 'director'],
    ],
  },
  {
    q: 'In a group, you end up...',
    options: [
      ['Wiring it all together', 'coder'],
      ['Making it look and sound right', 'artist'],
      ['Holding the vision and the clock', 'director'],
    ],
  },
  {
    q: 'Your dream project, one sentence.',
    options: [
      ['A tight mechanic that just feels good', 'coder'],
      ['A world people get lost in', 'artist'],
      ['A story people replay to see the other end', 'director'],
    ],
  },
]

export const CAT_META: Record<QuizAnswer, { tint: string; glow: string }> = {
  coder: { tint: 'oklch(0.8 0.16 60)', glow: 'oklch(0.75 0.17 58 / 0.45)' },
  artist: { tint: 'oklch(0.85 0.14 88)', glow: 'oklch(0.83 0.13 86 / 0.45)' },
  director: { tint: 'oklch(0.72 0.18 12)', glow: 'oklch(0.65 0.19 15 / 0.45)' },
}

export const CAT_ICON: Record<QuizAnswer, string> = {
  coder: 'code-2',
  artist: 'palette',
  director: 'pen-line',
}

export const CAT_LABEL: Record<RoleCategory, string> = {
  code: 'Code',
  art: 'Art & Sound',
  direction: 'Direction',
}

export const ROLE_FILTERS: { id: 'all' | RoleCategory; label: string; icon?: string }[] = [
  { id: 'all', label: 'All · 9' },
  { id: 'code', label: 'Code', icon: 'code-2' },
  { id: 'art', label: 'Art & Sound', icon: 'palette' },
  { id: 'direction', label: 'Direction', icon: 'pen-line' },
]

/** Map quiz result → role ids to surface in the result card. */
export const QUIZ_ROLE_MAP: Record<QuizAnswer, string[]> = {
  coder: ['gameplay', 'systems', 'animator'],
  artist: ['concept', 'sculpt', 'sound'],
  director: ['writer', 'designer'],
}

/** Architect seat cards — used by ArchitectSeat.tsx */
export interface ArchitectCard {
  icon: string
  title: string
  body: string
}

export const ARCHITECT_CARDS: ArchitectCard[] = [
  { icon: 'globe', title: 'Game website', body: "A landing page for the team\u2019s game. Screenshots, story, a playable link." },
  { icon: 'trophy', title: 'Leaderboard', body: 'A score server so playtesters can actually compete.' },
  { icon: 'rocket', title: 'Build & deploy', body: 'Wire the game to build and ship online. Real release engineering.' },
  { icon: 'wrench', title: 'Tools & scripts', body: 'Small utilities that speed your team up. Importers, exporters, editors.' },
  { icon: 'monitor-play', title: 'Trailer & stream', body: 'Cut a trailer, run the showcase stream. The stuff people remember.' },
  { icon: 'megaphone', title: 'Marketing page', body: 'Copy, visuals, a launch post. Make sure people actually play it.' },
]

/** "For parents" card grid */
export interface ParentCard {
  icon: string
  title: string
  body: string
}

export const PARENT_CARDS: ParentCard[] = [
  { icon: 'sparkles', title: 'No experience needed', body: 'Stick figures are fine. The whole point is finding where you fit.' },
  { icon: 'users', title: 'Real teamwork', body: 'Five people, five seats, one deadline. That\u2019s the whole skill.' },
  { icon: 'hammer', title: 'They build, not scroll', body: 'Screens are a tool here, not the activity. They create with them.' },
  { icon: 'award', title: 'Everyone\u2019s recognised', body: 'Every team takes home a certificate. Six ways to win more.' },
]
