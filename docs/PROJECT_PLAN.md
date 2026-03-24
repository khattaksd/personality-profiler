# 🎯 Personality Profiler: Project Master Plan & Context

## 📖 The Journey So Far

This project aims to bridge the gap between **Academic Psychometrics** and **Engaging Pop-Psychology**. We started with the goal of creating a viral, mobile-first web app that provides deep insights through a frictionless, anonymous-first experience.

### Key Decisions Made:

1.  **Scientific Model**: We are using the **Big Five (OCEAN)** model (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) as the core scoring engine, complemented by optional secondary models:
    - **MBTI Framework**: For archetype mapping and personality typing.
    - **Enneagram**: A 9-type system for deeper motivational insights.
    - **StrengthsFinder**: Top 5 talent themes for career and personal development alignment.
2.  **Tech Stack**:
    - **Frontend**: Vue 3.5 (Composition API) + TypeScript.
    - **State Management**: Pinia 3.0 (for reactive scoring and theme state).
    - **Styling**: Tailwind CSS + Shadcn/Vue (Radix UI primitives).
    - **Build Tool**: Vite (Next-gen frontend tooling).
3.  **UI/UX Philosophy**:
    - **No Sliders**: We rejected traditional sliders for a "Segmented Tap-Scale" (tactile, pill-shaped buttons) to ensure mobile friendliness.
    - **Dynamic Depth**: A "Snapshot" (5-10 questions) followed by a "Go Deeper" (40+ questions) flow.
    - **User-Selectable Themes**: CSS Variable-based theming (The Lab, The Wild, The Nebula).
4.  **Viral Hook**: Client-side generation of "Personality Tarot Cards" using HTML5 Canvas or Satori for zero-cost social sharing.

---

## 🧠 Phase 1: The Scoring Engine (Current Focus)

### 1.1 The "Friendly Labels" (Abstract Mapping)

To make the clinical data approachable, we have mapped the OCEAN traits to "The Five Elements of You":

- **Openness** → _The Horizon_ (Exploring new ideas)
- **Conscientiousness** → _The Blueprint_ (Structure and planning)
- **Extraversion** → _The Spark_ (Social energy)
- **Agreeableness** → _The Anchor_ (Trust and cooperation)
- **Neuroticism** → _The Pulse_ (Emotional sensitivity)

### 1.2 Secondary Model Mappings

**MBTI Framework** (4 Dichotomies):

- **Extraversion vs. Introversion** → _The Pulse_ (Social Energy)
- **Sensing vs. Intuition** → _The Horizon_ (Pattern Recognition)
- **Thinking vs. Feeling** → _The Anchor_ (Decision-Making)
- **Judging vs. Perceiving** → _The Blueprint_ (Structure Preference)

**Enneagram** (9 Types):

- Core motivations mapped to OCEAN trait clusters
- Dynamic wings and stress/growth arrows tied to trait intensity shifts
- Friendly labels: "The Advocate," "The Achiever," "The Idealist," etc.

**StrengthsFinder** (34 Themes):

- Top 5 talents extracted via OCEAN pattern matching
- Paired with career alignment data
- Labels: "Leadership," "Ideation," "Adaptability," "Relator," etc.

**Unified Scoring**:
Each model uses the same **0-100% Simple Average** and **Percentile-Based** logic, ensuring consistent UX across all personality frameworks.

### 1.2 The Hybrid Scoring Logic

We are implementing a dual-scoring system:

- **Simple Average (0-100%)**: (Score - 1) / 4 \* 100. Intuitive for users.
- **Percentile-Based**: Calculated against academic population means to provide an "Authoritative" feel.
  - _Openness Mean_: 3.5
  - _Conscientiousness Mean_: 3.4
  - _Extraversion Mean_: 3.2
  - _Agreeableness Mean_: 3.6
  - _Neuroticism Mean_: 3.0

---

## 🎨 Phase 2: The "Vibe-Scale" UI & Theming

### 2.1 The Interaction

- **Component**: `VibeScale.vue`
- **Design**: 5 discrete segments.
- **Feedback**: Active segment scales by 105% and adds a subtle glow/shadow.

### 2.2 The Themes

We are using CSS Variables in `index.css` to swap themes instantly:

- **"The Lab"**: Clinical, white/gray, Apple-style minimalist.
- **"The Wild"**: Nature-inspired, organic greens, soft earth tones.
- **"The Nebula"**: Dark mode, deep purples, neon accents, ethereal.

---

## 📊 Phase 3: Results & Archetypes (Upcoming)

- **Archetype Engine**: Mapping OCEAN clusters to 1 of 16 custom archetypes (e.g., "The Architect," "The Nomad").
- **Card Generator**: A "Share" button that renders the user's result into a beautiful, vertical "Tarot Card" image locally in the browser.

---

## 🚀 Technical Requirements for Copilot CLI/VSCode

- **State Source of Truth**: `src/stores/personality.ts`
- **Data Source**: `src/data/questions.json`
- **Component Entry**: `src/components/assessment/QuestionCard.vue`
- **Global Styles**: `src/assets/main.css` (with Tailwind and Theme Variables)

## ✅ Success Metrics

- **Completion Rate**: Users should reach the "Snapshot" results in under 60 seconds.
- **Shareability**: Result cards must be visually stunning and download-ready.
- **Performance**: Zero-lag transitions between questions (use Framer Motion/Motion One).
