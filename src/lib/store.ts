import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Goal = "lose_fat" | "build_muscle" | "stay_fit" | "improve_health" | "athletic";
export type Diet = "veg" | "non_veg" | "vegan";
export type Environment = "gym" | "home" | "hybrid";

export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest: number; // seconds
};

export type Workout = {
  id: string;
  name: string;
  category: "Push" | "Pull" | "Legs" | "Full Body" | "Cardio" | "Mobility";
  duration: number;
  level: number;
  exercises: Exercise[];
};

export type Meal = {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  at: number; // timestamp
};

export type CoachMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  at: number;
};

export type Achievement = { id: string; title: string; unlockedAt: number };
export type WeightEntry = { date: string; kg: number };
export type SessionLog = {
  id: string;
  workoutId: string;
  name: string;
  at: number;
  duration: number;
  xp: number;
};

type AppState = {
  // Targets (derived from onboarding, with sensible defaults)
  targets: { kcal: number; protein: number; water: number };
  // Daily progress
  today: { date: string; kcalIn: number; proteinIn: number; waterMl: number; workoutDone: boolean };
  // Streak & XP
  streak: number;
  lastActiveDate: string | null;
  xp: number;
  level: number;
  // Nutrition log
  meals: Meal[];
  // Workouts
  sessions: SessionLog[];
  // Progress
  weights: WeightEntry[];
  achievements: Achievement[];
  // Coach
  messages: CoachMessage[];
  // Notifications
  notifications: { id: string; title: string; body: string; at: number; read: boolean }[];

  // Actions
  setTargets: (t: Partial<AppState["targets"]>) => void;
  logMeal: (m: Omit<Meal, "id" | "at">) => void;
  removeMeal: (id: string) => void;
  addWater: (ml: number) => void;
  completeWorkout: (w: Workout) => void;
  addWeight: (kg: number) => void;
  addMessage: (m: Omit<CoachMessage, "id" | "at">) => CoachMessage;
  clearMessages: () => void;
  markNotificationsRead: () => void;
  rollDayIfNeeded: () => void;
  reset: () => void;
};

const today = () => new Date().toISOString().slice(0, 10);

const seedNotifications = [
  {
    id: "n1",
    title: "Time to train",
    body: "Your Push Day is ready.",
    at: Date.now() - 1000 * 60 * 60 * 2,
    read: false,
  },
  {
    id: "n2",
    title: "Hydration check",
    body: "You're behind on water today.",
    at: Date.now() - 1000 * 60 * 60 * 5,
    read: false,
  },
  {
    id: "n3",
    title: "Coach insight",
    body: "Your recovery score is up 12%.",
    at: Date.now() - 1000 * 60 * 60 * 22,
    read: true,
  },
];

const seedAchievements: Achievement[] = [
  { id: "a1", title: "First workout", unlockedAt: Date.now() - 1000 * 60 * 60 * 24 * 14 },
  { id: "a2", title: "7-day streak", unlockedAt: Date.now() - 1000 * 60 * 60 * 24 * 7 },
];

const seedWeights: WeightEntry[] = Array.from({ length: 8 }).map((_, i) => ({
  date: new Date(Date.now() - (7 - i) * 86400000 * 4).toISOString().slice(0, 10),
  kg: 78 - i * 0.4 + (i % 2) * 0.15,
}));

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      targets: { kcal: 2400, protein: 160, water: 3000 },
      today: { date: today(), kcalIn: 0, proteinIn: 0, waterMl: 0, workoutDone: false },
      streak: 5,
      lastActiveDate: null,
      xp: 1240,
      level: 3,
      meals: [],
      sessions: [],
      weights: seedWeights,
      achievements: seedAchievements,
      messages: [
        {
          id: "m0",
          role: "ai",
          text: "Morning. Recovery looks strong today. I've queued a focused **Push** session — ready when you are.",
          at: Date.now() - 1000 * 60 * 30,
        },
      ],
      notifications: seedNotifications,

      setTargets: (t) => set({ targets: { ...get().targets, ...t } }),

      logMeal: (m) => {
        const meal: Meal = { ...m, id: crypto.randomUUID(), at: Date.now() };
        const t = get().today;
        set({
          meals: [meal, ...get().meals].slice(0, 200),
          today: { ...t, kcalIn: t.kcalIn + m.kcal, proteinIn: t.proteinIn + m.protein },
        });
      },

      removeMeal: (id) => {
        const meal = get().meals.find((x) => x.id === id);
        if (!meal) return;
        const t = get().today;
        set({
          meals: get().meals.filter((x) => x.id !== id),
          today: {
            ...t,
            kcalIn: Math.max(0, t.kcalIn - meal.kcal),
            proteinIn: Math.max(0, t.proteinIn - meal.protein),
          },
        });
      },

      addWater: (ml) => {
        const t = get().today;
        set({ today: { ...t, waterMl: t.waterMl + ml } });
      },

      completeWorkout: (w) => {
        const t = get().today;
        const today2 = today();
        const last = get().lastActiveDate;
        const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const newStreak = last === today2 ? get().streak : last === yest ? get().streak + 1 : 1;
        const xpGain = 80 + w.exercises.length * 10;
        const newXp = get().xp + xpGain;
        const newLevel = Math.floor(newXp / 500) + 1;
        set({
          today: { ...t, workoutDone: true },
          sessions: [
            {
              id: crypto.randomUUID(),
              workoutId: w.id,
              name: w.name,
              at: Date.now(),
              duration: w.duration,
              xp: xpGain,
            },
            ...get().sessions,
          ].slice(0, 100),
          streak: newStreak,
          lastActiveDate: today2,
          xp: newXp,
          level: newLevel,
          notifications: [
            {
              id: crypto.randomUUID(),
              title: "Workout complete",
              body: `+${xpGain} XP from ${w.name}`,
              at: Date.now(),
              read: false,
            },
            ...get().notifications,
          ],
        });
      },

      addWeight: (kg) => {
        set({ weights: [...get().weights, { date: today(), kg }] });
      },

      addMessage: (m) => {
        const msg: CoachMessage = { ...m, id: crypto.randomUUID(), at: Date.now() };
        set({ messages: [...get().messages, msg] });
        return msg;
      },

      clearMessages: () => set({ messages: [] }),

      markNotificationsRead: () =>
        set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) }),

      rollDayIfNeeded: () => {
        const t = get().today;
        const d = today();
        if (t.date !== d) {
          set({ today: { date: d, kcalIn: 0, proteinIn: 0, waterMl: 0, workoutDone: false } });
        }
      },

      reset: () =>
        set({
          meals: [],
          sessions: [],
          messages: [],
          notifications: [],
          xp: 0,
          level: 1,
          streak: 0,
        }),
    }),
    { name: "athlyt-app-v1" },
  ),
);

// Catalogs (not persisted)
export const WORKOUTS: Workout[] = [
  {
    id: "push-1",
    name: "Express Push",
    category: "Push",
    duration: 22,
    level: 3,
    exercises: [
      { name: "Incline DB Press", sets: 4, reps: "8-10", rest: 75 },
      { name: "Cable Fly", sets: 3, reps: "12", rest: 60 },
      { name: "Overhead Press", sets: 4, reps: "6-8", rest: 90 },
      { name: "Tricep Pushdown", sets: 3, reps: "12-15", rest: 45 },
    ],
  },
  {
    id: "pull-1",
    name: "Heavy Pull",
    category: "Pull",
    duration: 35,
    level: 3,
    exercises: [
      { name: "Pull-ups", sets: 4, reps: "AMRAP", rest: 90 },
      { name: "Barbell Row", sets: 4, reps: "8", rest: 90 },
      { name: "Face Pulls", sets: 3, reps: "15", rest: 45 },
      { name: "DB Curl", sets: 3, reps: "10", rest: 60 },
    ],
  },
  {
    id: "legs-1",
    name: "Leg Architect",
    category: "Legs",
    duration: 45,
    level: 4,
    exercises: [
      { name: "Back Squat", sets: 5, reps: "5", rest: 120 },
      { name: "Romanian Deadlift", sets: 4, reps: "8", rest: 90 },
      { name: "Walking Lunges", sets: 3, reps: "12/leg", rest: 60 },
      { name: "Calf Raises", sets: 4, reps: "15", rest: 45 },
    ],
  },
  {
    id: "full-1",
    name: "Total Body Reset",
    category: "Full Body",
    duration: 30,
    level: 2,
    exercises: [
      { name: "Goblet Squat", sets: 3, reps: "12", rest: 60 },
      { name: "DB Press", sets: 3, reps: "10", rest: 60 },
      { name: "Bent Row", sets: 3, reps: "10", rest: 60 },
      { name: "Plank", sets: 3, reps: "45s", rest: 45 },
    ],
  },
  {
    id: "cardio-1",
    name: "Zone 2 Burn",
    category: "Cardio",
    duration: 30,
    level: 1,
    exercises: [{ name: "Incline Walk", sets: 1, reps: "30 min", rest: 0 }],
  },
  {
    id: "mob-1",
    name: "Mobility Flow",
    category: "Mobility",
    duration: 15,
    level: 1,
    exercises: [
      { name: "Hip Openers", sets: 2, reps: "8/side", rest: 0 },
      { name: "Thoracic Rotations", sets: 2, reps: "10/side", rest: 0 },
      { name: "Cat-Cow", sets: 2, reps: "10", rest: 0 },
    ],
  },
];

export const FOODS = [
  { name: "Chicken Breast (150g)", kcal: 240, protein: 45, carbs: 0, fat: 5 },
  { name: "4 Whole Eggs", kcal: 280, protein: 24, carbs: 2, fat: 20 },
  { name: "Greek Yogurt (200g)", kcal: 130, protein: 18, carbs: 8, fat: 2 },
  { name: "Brown Rice (100g)", kcal: 220, protein: 5, carbs: 46, fat: 2 },
  { name: "Salmon Fillet (180g)", kcal: 360, protein: 38, carbs: 0, fat: 22 },
  { name: "Oats (60g)", kcal: 230, protein: 8, carbs: 39, fat: 5 },
  { name: "Banana", kcal: 105, protein: 1, carbs: 27, fat: 0 },
  { name: "Whey Shake", kcal: 160, protein: 30, carbs: 5, fat: 2 },
  { name: "Almonds (30g)", kcal: 180, protein: 6, carbs: 6, fat: 15 },
  { name: "Sweet Potato (200g)", kcal: 180, protein: 4, carbs: 41, fat: 0 },
];
