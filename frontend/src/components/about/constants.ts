import type { LucideIcon } from "lucide-react";
import {
  Lightbulb,
  Rocket,
  Target,
  Users,
  Code2,
  MessageSquare,
  Calendar,
  Bell,
  Zap,
  Shield,
  Heart,
  Github,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface TechStackItem {
  name: string;
  category: string;
  description: string;
}

export interface Principle {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FeatureHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
}

// ============================================================================
// Content
// ============================================================================

export const ABOUT_HERO = {
  badge: "About TaskFlow",
  title: "The Story Behind ",
  titleHighlight: "TaskFlow",
  description:
    "Born from frustration with complex task managers, TaskFlow reimagines productivity through the power of natural conversation.",
};

export const ORIGIN_STORY = {
  title: "How It All Started",
  description:
    "Every great product starts with a problem worth solving. For us, that problem was the unnecessary complexity of modern task management.",
  content: [
    {
      title: "The Problem",
      text: "Traditional task managers require too many clicks, too many forms, and too much cognitive overhead. We found ourselves spending more time organizing tasks than actually completing them.",
    },
    {
      title: "The Insight",
      text: "We realized that the most natural way to manage tasks is the same way we think about them — through language. When you think 'I need to call John tomorrow at 3pm', why not just type exactly that?",
    },
    {
      title: "The Solution",
      text: "TaskFlow was born from a simple idea: what if managing tasks was as easy as texting a friend? No buttons to click, no forms to fill, no learning curve. Just type what you want to do, and it's done.",
    },
  ],
};

export const TIMELINE: TimelineEvent[] = [
  {
    date: "January 2026",
    title: "The Idea",
    description: "First sketches and concept validation for a conversational task manager.",
  },
  {
    date: "February 2026",
    title: "Development Begins",
    description: "Building the core natural language processing engine and task management system.",
  },
  {
    date: "March 2026",
    title: "Alpha Release",
    description: "First internal testing with a small group of early adopters.",
  },
  {
    date: "Q2 2026",
    title: "Public Beta",
    description: "Opening TaskFlow to the public with core features and community feedback integration.",
  },
];

export const PRINCIPLES: Principle[] = [
  {
    icon: Lightbulb,
    title: "Simplicity First",
    description: "Every feature must pass the simplicity test. If it adds complexity without proportional value, it doesn't ship.",
  },
  {
    icon: Zap,
    title: "Speed Matters",
    description: "Task management should feel instant. Every interaction is optimized for speed and responsiveness.",
  },
  {
    icon: Heart,
    title: "User-Centric Design",
    description: "We build for real people with real needs. User feedback shapes every decision we make.",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Your data is yours. We implement industry-best security practices and never sell your information.",
  },
];

export const FEATURE_HIGHLIGHTS: FeatureHighlight[] = [
  {
    icon: MessageSquare,
    title: "Natural Language Processing",
    description: "Our custom-built NLP engine understands how you naturally describe tasks.",
    details: [
      "Understands dates like 'tomorrow', 'next Monday', 'in 2 hours'",
      "Extracts priorities from context ('urgent', 'when I have time')",
      "Recognizes task patterns and suggests improvements",
      "Learns from your writing style over time",
    ],
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Intelligent calendar integration that respects your time.",
    details: [
      "Visual calendar with drag-and-drop rescheduling",
      "Conflict detection and resolution suggestions",
      "Recurring task patterns recognized automatically",
      "Time zone aware for distributed teams",
    ],
  },
  {
    icon: Bell,
    title: "Contextual Reminders",
    description: "Reminders that make sense, not just notifications that annoy.",
    details: [
      "Smart timing based on task urgency",
      "Location-based reminders (coming soon)",
      "Do-not-disturb integration",
      "Escalation for overdue important tasks",
    ],
  },
];

export const TECH_STACK: TechStackItem[] = [
  { name: "React", category: "Frontend", description: "Modern UI with component-based architecture" },
  { name: "TypeScript", category: "Language", description: "Type-safe code for reliability" },
  { name: "Node.js", category: "Backend", description: "Fast, scalable server infrastructure" },
  { name: "Prisma", category: "Database", description: "Type-safe database access" },
  { name: "Tailwind CSS", category: "Styling", description: "Utility-first, responsive design" },
  { name: "Framer Motion", category: "Animation", description: "Smooth, performant animations" },
];

export const OPEN_SOURCE = {
  title: "Open Source at Heart",
  description:
    "We believe in the power of community. Core components of TaskFlow are open source, allowing developers to contribute, learn, and build upon our work.",
  links: [
    { icon: Github, label: "View on GitHub", href: "https://github.com" },
  ],
};

export const VISION = {
  title: "Our Vision for the Future",
  description:
    "TaskFlow is just getting started. We envision a world where technology adapts to human behavior, not the other way around.",
  goals: [
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Shared workspaces with natural language task delegation and team communication.",
    },
    {
      icon: Code2,
      title: "API & Integrations",
      description: "Connect TaskFlow with your favorite tools — Slack, GitHub, Google Calendar, and more.",
    },
    {
      icon: Rocket,
      title: "AI-Powered Insights",
      description: "Intelligent productivity analytics and personalized suggestions to improve your workflow.",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Long-term goal setting with automatic task breakdown and progress visualization.",
    },
  ],
};

export const CTA = {
  title: "Ready to Transform Your Productivity?",
  description: "Join thousands of users who've simplified their task management with TaskFlow.",
  primaryButton: "Get Started Free",
  secondaryButton: "Back to Home",
};
