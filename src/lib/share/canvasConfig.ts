/**
 * Centralized Canvas style configuration for Share Service v2.
 *
 * This file defines the global visual standard for all 1200×630 share cards:
 *   - Somna dark theme palette
 *   - Typography scale
 *   - Layout spacing and alignment
 *   - Logo dimensions
 *
 * Keeping these values in one place ensures every template renders consistently
 * and makes future A/B style swaps straightforward.
 */

export const CANVAS = {
  width: 1200,
  height: 630,
} as const;

export const COLORS = {
  background: "#0B1020",
  surface: "#151B2F",
  accent: "#7C8CFF",
  text: "#F5F7FF",
  muted: "#9AA3C7",
  danger: "#FF4D5A",
  success: "#63D39A",
} as const;

export const FONTS = {
  sans: "Inter, 'Noto Sans SC', sans-serif",
  display: "Fraunces, 'Noto Serif SC', serif",
  metric: "Inter, sans-serif",
} as const;

export const FONT_SIZES = {
  brand: 34,
  eyebrow: 22,
  metric: 170,
  metricSmall: 130,
  title: 74,
  titleSmall: 66,
  body: 32,
  bodySmall: 30,
  caption: 28,
  footer: 24,
  error: 52,
} as const;

export const SPACING = {
  paddingX: 60,
  paddingY: 60,
  brandX: 60,
  brandY: 80,
  footerY: 580,
  centerY: 315,
  glowX: 1080,
  glowY: 80,
  glowRadius: 500,
} as const;

export const BRAND = {
  word: "SOMNA",
  dotRadius: 6,
  dotX: 222,
  dotY: 70,
} as const;

export const SITE_HOST = "somna.help";
