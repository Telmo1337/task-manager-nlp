import type { LucideIcon } from "lucide-react";
import { MessageSquare, Calendar, Clock, Zap, Shield, Sparkles } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface NavLink {
  label: string;
  href: string;
}

export interface DemoMessage {
  role: "user" | "assistant";
  content: string;
  isList?: boolean;
  listItems?: string[];
}

export interface Step {
  title: string;
  description: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "blue" | "green" | "purple" | "orange" | "cyan" | "pink";
}

export interface PricingFeature {
  text: string;
}

export interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period: string;
  features: PricingFeature[];
  cta: string;
  highlighted?: boolean;
  comingSoon?: boolean;
}

// ============================================================================
// Brand
// ============================================================================

export const BRAND = {
  name: "TaskFlow",
  tagline: "Natural Language Task Management",
  copyright: "© 2026 TaskFlow. All rights reserved.",
} as const;

// ============================================================================
// Navigation
// ============================================================================

export const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

// ============================================================================
// Hero Section
// ============================================================================

export const HERO = {
  badge: "Natural Language Task Management",
  title: "Manage tasks with",
  titleHighlight: " simple conversations",
  description:
    "Just type what you want to do. Create tasks, set reminders, and organize your day using natural language — no complex forms or clicks needed.",
  primaryCta: "Start for Free",
  secondaryCta: "I already have an account",
} as const;

// ============================================================================
// Demo Chat
// ============================================================================

export const DEMO_MESSAGES: DemoMessage[] = [
  {
    role: "user",
    content: "Create a meeting with John tomorrow at 3pm",
  },
  {
    role: "assistant",
    content: '✓ Created task "meeting with John" for tomorrow at 3:00 PM',
  },
  {
    role: "user",
    content: "Show my tasks for this week",
  },
  {
    role: "assistant",
    content: "Here are your tasks:",
    isList: true,
    listItems: [
      "Meeting with John - Tomorrow 3:00 PM",
      "Review project proposal - Wed 10:00 AM",
      "Send weekly report - Completed",
    ],
  },
];

// ============================================================================
// How It Works
// ============================================================================

export const HOW_IT_WORKS = {
  title: "How TaskFlow Works",
  description: "Three simple steps to transform how you manage your daily tasks",
} as const;

export const STEPS: Step[] = [
  {
    title: "Type Your Task",
    description:
      'Simply describe what you need to do in plain English. "Call mom this Sunday at 5pm" or "Finish report by Friday".',
  },
  {
    title: "We Understand",
    description:
      "TaskFlow's smart parser extracts the task, date, time, priority, and any recurring patterns automatically.",
  },
  {
    title: "Stay Organized",
    description:
      "View your tasks in the calendar, track progress, and manage everything through simple chat commands.",
  },
];

// ============================================================================
// Features
// ============================================================================

export const FEATURES_SECTION = {
  title: "Everything You Need",
  description: "Powerful features wrapped in a simple, conversational interface",
} as const;

export const FEATURES: Feature[] = [
  {
    icon: MessageSquare,
    title: "Natural Language",
    description:
      "Just type like you're texting a friend. No need to learn special commands or navigate complex menus.",
    color: "blue",
  },
  {
    icon: Calendar,
    title: "Calendar View",
    description:
      "See all your tasks organized by date. Click any day to view or create tasks for that specific date.",
    color: "green",
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description:
      'Say "tomorrow," "next week," or "every Monday" — we understand natural time expressions.',
    color: "purple",
  },
  {
    icon: Zap,
    title: "Priority Levels",
    description:
      "Mark tasks as urgent, high, normal, or low priority. Focus on what matters most first.",
    color: "orange",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is encrypted and secure. Only you can access your tasks and personal information.",
    color: "cyan",
  },
  {
    icon: Sparkles,
    title: "Recurring Tasks",
    description:
      'Set up daily, weekly, or monthly recurring tasks. "Water plants every Sunday" just works.',
    color: "pink",
  },
];

// Color mapping for features
export const FEATURE_COLORS = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    icon: "text-green-600 dark:text-green-400",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    icon: "text-purple-600 dark:text-purple-400",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    icon: "text-orange-600 dark:text-orange-400",
  },
  cyan: {
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
    icon: "text-cyan-600 dark:text-cyan-400",
  },
  pink: {
    bg: "bg-pink-100 dark:bg-pink-900/30",
    icon: "text-pink-600 dark:text-pink-400",
  },
} as const;

// ============================================================================
// Pricing
// ============================================================================

export const PRICING_SECTION = {
  title: "Simple, Transparent Pricing",
  description: "Start free, upgrade when you need more",
} as const;

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Free",
    description: "Perfect for personal use",
    price: "$0",
    period: "/month",
    features: [
      { text: "Unlimited tasks" },
      { text: "Natural language input" },
      { text: "Calendar view" },
      { text: "Priority levels" },
    ],
    cta: "Get Started Free",
  },
  {
    name: "Pro",
    description: "For power users & teams",
    price: "$9",
    period: "/month",
    features: [
      { text: "Everything in Free" },
      { text: "Team collaboration" },
      { text: "Advanced analytics" },
      { text: "Priority support" },
    ],
    cta: "Coming Soon",
    highlighted: true,
    comingSoon: true,
  },
];

// ============================================================================
// CTA Section
// ============================================================================

export const CTA = {
  title: "Ready to simplify your task management?",
  description: "Join thousands of users who manage their tasks with natural conversations.",
  button: "Create Free Account",
} as const;
