// Generated from tokens.json by scripts/build-tokens.mjs. Do not edit by hand.
export const tokens = {
  "$description": "Astodesign design tokens. Source of truth for tokens.css and tokens.ts, and 1:1 with the Figma variables (text/primary -> --text-primary). Values come from astodesign.com unless marked \"gap\" (added because the portfolio had no answer).",
  "color": {
    "primitive": {
      "night-900": "#0e2a36",
      "night-800": "#123a4c",
      "night-700": "#163f52",
      "night-600": "#1d5064",
      "night-500": "#2b6577",
      "night-300": "#6fa8c7",
      "paper-50": "#fffdf8",
      "paper-100": "#f6f0e2",
      "paper-200": "#f6ead0",
      "paper-300": "#f3ecdc",
      "paper-400": "#efe6d2",
      "paper-500": "#c9bfae",
      "ink-900": "#1f1a17",
      "ink-800": "#2a2420",
      "ink-700": "#2e2e2e",
      "ink-600": "#4a4038",
      "ink-500": "#5c5652",
      "ink-400": "#5a5a5a",
      "ink-300": "#8a8074",
      "gold-500": "#d8a44a",
      "gold-700": "#8a6a2e",
      "lacquer-700": "#7a2e2e",
      "lacquer-600": "#8b2722",
      "lacquer-900": "#3f0d0d",
      "red-600": "#b8302f",
      "green-600": "#3f7449",
      "sakura-300": "#eaa3b4",
      "sakura-500": "#d9708b",
      "white": "#ffffff"
    },
    "pigment": {
      "$description": "The six cover pigments (CoverTile, Card cover). The only raw colours allowed in layouts.",
      "lacquer": "#8b2722",
      "teal": "#1d5064",
      "moss": "#3f7449",
      "plum": "#6b2347",
      "ochre": "#a8762c",
      "ink": "#2e2e2e"
    },
    "semantic": {
      "$description": "Night = the painted scene and shells. Paper = washi pages, cards, streams, forms. Components only use these names.",
      "bg-canvas": {
        "night": "night-700",
        "paper": "paper-100"
      },
      "bg-surface": {
        "night": "night-800",
        "paper": "paper-300"
      },
      "bg-raised": {
        "night": "night-600",
        "paper": "paper-50"
      },
      "bg-sunken": {
        "night": "night-900",
        "paper": "paper-400",
        "gap": true
      },
      "bg-scrim": {
        "night": "night-900",
        "paper": "ink-900"
      },
      "text-primary": {
        "night": "paper-200",
        "paper": "ink-900"
      },
      "text-secondary": {
        "night": "paper-500",
        "paper": "ink-500"
      },
      "text-muted": {
        "night": "night-300",
        "paper": "ink-300"
      },
      "text-accent": {
        "night": "gold-500",
        "paper": "gold-700"
      },
      "border-subtle": {
        "night": "night-500",
        "paper": "paper-500"
      },
      "border-strong": {
        "night": "paper-200",
        "paper": "ink-600"
      },
      "focus": {
        "night": "gold-500",
        "paper": "lacquer-700"
      },
      "action-bg": {
        "night": "ink-700",
        "paper": "ink-700"
      },
      "action-text": {
        "night": "white",
        "paper": "white"
      },
      "action-bg-hover": {
        "night": "white",
        "paper": "white"
      },
      "action-text-hover": {
        "night": "ink-400",
        "paper": "ink-400"
      },
      "accent-gold": {
        "night": "gold-500",
        "paper": "gold-500"
      },
      "accent-lacquer": {
        "night": "lacquer-600",
        "paper": "lacquer-600"
      },
      "accent-sakura": {
        "night": "sakura-300",
        "paper": "sakura-500",
        "gap": true
      },
      "status-error": {
        "night": "#e07a6a",
        "paper": "red-600"
      },
      "status-success": {
        "night": "#9bd2a8",
        "paper": "green-600"
      },
      "status-warning": {
        "night": "gold-500",
        "paper": "gold-700",
        "gap": true
      },
      "status-info": {
        "night": "night-300",
        "paper": "night-600",
        "gap": true
      }
    }
  },
  "font": {
    "serif": "\"Cormorant Garamond\", \"Cormorant\", \"EB Garamond\", Georgia, \"Times New Roman\", serif",
    "sans": "\"Helvetica Neue\", Helvetica, Inter, Arial, sans-serif",
    "mono": "\"SFMono-Regular\", Menlo, Consolas, monospace"
  },
  "type": {
    "display-xl": {
      "font": "serif",
      "size": 80,
      "line": 82,
      "weight": 600,
      "fluid": "clamp(40px, 6vw, 80px)"
    },
    "display-l": {
      "font": "serif",
      "size": 56,
      "line": 60,
      "weight": 600,
      "fluid": "clamp(34px, 4.4vw, 56px)"
    },
    "heading-2": {
      "font": "serif",
      "size": 44,
      "line": 48,
      "weight": 600,
      "fluid": "clamp(30px, 3.2vw, 44px)"
    },
    "heading-3": {
      "font": "serif",
      "size": 26,
      "line": 30,
      "weight": 600,
      "fluid": "clamp(22px, 1.9vw, 26px)"
    },
    "heading-4": {
      "font": "serif",
      "size": 21,
      "line": 26,
      "weight": 600
    },
    "tagline": {
      "font": "serif",
      "size": 28,
      "line": 36,
      "weight": 600,
      "style": "italic",
      "fluid": "clamp(21px, 2.2vw, 28px)"
    },
    "whisper": {
      "font": "serif",
      "size": 18,
      "line": 24,
      "weight": 600,
      "style": "italic",
      "tracking": 0.04
    },
    "field": {
      "font": "serif",
      "size": 21,
      "line": 28,
      "weight": 600
    },
    "body-l": {
      "font": "sans",
      "size": 17,
      "line": 30,
      "weight": 400
    },
    "body-m": {
      "font": "sans",
      "size": 15,
      "line": 24,
      "weight": 400
    },
    "body-s": {
      "font": "sans",
      "size": 13.5,
      "line": 20,
      "weight": 400
    },
    "caption": {
      "font": "sans",
      "size": 13.5,
      "line": 18,
      "weight": 400,
      "gap": true
    },
    "label-button": {
      "font": "sans",
      "size": 12.5,
      "line": 12.5,
      "weight": 700,
      "tracking": 0.06,
      "case": "upper"
    },
    "label-nav": {
      "font": "sans",
      "size": 14,
      "line": 14,
      "weight": 700,
      "tracking": 0.04,
      "case": "upper"
    },
    "label-kicker": {
      "font": "sans",
      "size": 11,
      "line": 11,
      "weight": 700,
      "tracking": 0.2,
      "case": "upper"
    },
    "label-tag": {
      "font": "sans",
      "size": 10.5,
      "line": 10.5,
      "weight": 700,
      "tracking": 0.08,
      "case": "upper"
    },
    "label-field": {
      "font": "sans",
      "size": 11,
      "line": 11,
      "weight": 700,
      "tracking": 0.14,
      "case": "upper"
    }
  },
  "space": {
    "0": 0,
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "5": 20,
    "6": 24,
    "8": 32,
    "10": 40,
    "12": 48,
    "16": 64,
    "24": 96
  },
  "radius": {
    "none": 0,
    "xs": 2,
    "sm": 3,
    "md": 4,
    "lg": 6,
    "xl": 14,
    "full": 999
  },
  "elevation": {
    "0-flat": "none",
    "1-hairline": "inset 0 0 0 1px var(--border-subtle)",
    "2-lift": "0 6px 18px rgba(0, 0, 0, .18), inset 0 0 0 1px rgba(255, 255, 255, .08)",
    "3-float": "0 6px 18px rgba(0, 0, 0, .3), 0 0 0 1px rgba(246, 234, 208, .25)",
    "4-book": "0 30px 60px rgba(4, 14, 20, .6)"
  },
  "motion": {
    "duration": {
      "instant": 120,
      "fast": 200,
      "base": 350,
      "enter": 450,
      "turn": 800,
      "slow": 1000,
      "scene": 1200,
      "sway": 7000
    },
    "easing": {
      "standard": "ease",
      "settle": "cubic-bezier(.2, .7, .2, 1)",
      "turn": "cubic-bezier(.65, 0, .3, 1)",
      "sway": "ease-in-out"
    },
    "enter-distance": 22
  },
  "layout": {
    "content-max": 1280,
    "reading-max": "66ch",
    "gutter": "clamp(16px, 4vw, 64px)",
    "breakpoints": {
      "phone": 560,
      "rail-sheet": 760,
      "tablet": 900,
      "aside": 1100,
      "desktop": 1200
    },
    "z": {
      "base": 0,
      "scene": 1,
      "content": 10,
      "sticky": 20,
      "menu": 50,
      "overlay": 80,
      "toast": 90
    },
    "icon": {
      "s": 16,
      "m": 20,
      "l": 24,
      "stroke": 1.6
    },
    "hit-min": 44
  }
} as const;

export type SurfaceTone = 'night' | 'paper';
export type SemanticColor = 'bg-canvas' | 'bg-surface' | 'bg-raised' | 'bg-sunken' | 'bg-scrim' | 'text-primary' | 'text-secondary' | 'text-muted' | 'text-accent' | 'border-subtle' | 'border-strong' | 'focus' | 'action-bg' | 'action-text' | 'action-bg-hover' | 'action-text-hover' | 'accent-gold' | 'accent-lacquer' | 'accent-sakura' | 'status-error' | 'status-success' | 'status-warning' | 'status-info';
export type Space = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '24';
export const cssVar = (name: SemanticColor) => `var(--${name})`;
export const space = (step: Space) => `var(--space-${step})`;
