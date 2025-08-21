/**
 * Standardized icon sizing system for consistent iconography
 * 
 * Usage: Import and use these class names consistently across components
 */

// Icon Size Classes
export const ICON_SIZES = {
  // Extra Small: 16px - For inline icons, button icons in compact areas
  xs: 'w-4 h-4',
  
  // Small: 20px - For navigation, toolbar icons, small buttons
  sm: 'w-5 h-5',
  
  // Medium: 24px - For section headers, feature highlights, standard UI
  md: 'w-6 h-6', 
  
  // Large: 32px - For skill cards, prominent features, hero sections
  lg: 'w-8 h-8',
  
  // Extra Large: 40px - For major sections, marketing areas
  xl: 'w-10 h-10'
} as const;

// Stroke Width Classes (for consistent line thickness)
export const ICON_STROKES = {
  // Thin: 1px - For subtle icons
  thin: 'stroke-1',
  
  // Default: 1.5px - Standard stroke (Lucide default)
  default: 'stroke-[1.5]',
  
  // Medium: 2px - For emphasis and better visibility
  medium: 'stroke-2',
  
  // Bold: 2.5px - For prominent icons and headers
  bold: 'stroke-[2.5]'
} as const;

// Color Classes for icons
export const ICON_COLORS = {
  // Primary accent color
  accent: 'text-accent',
  
  // Muted/secondary color
  muted: 'text-muted-foreground',
  
  // Primary text color
  primary: 'text-primary',
  
  // Inherit from parent
  inherit: 'text-current'
} as const;

// Combined utility classes for common patterns
export const ICON_VARIANTS = {
  // Skill category icons - prominent and colorful
  skill: `${ICON_SIZES.lg} ${ICON_COLORS.accent} ${ICON_STROKES.medium}`,
  
  // Section header icons - medium size with accent
  sectionHeader: `${ICON_SIZES.md} ${ICON_COLORS.accent} ${ICON_STROKES.medium}`,
  
  // Navigation icons - compact but visible
  navigation: `${ICON_SIZES.sm} ${ICON_COLORS.muted} ${ICON_STROKES.default}`,
  
  // Button icons - small and subtle
  button: `${ICON_SIZES.xs} ${ICON_COLORS.inherit} ${ICON_STROKES.default}`,
  
  // Feature highlight icons - medium with emphasis
  feature: `${ICON_SIZES.md} ${ICON_COLORS.accent} ${ICON_STROKES.bold}`,
  
  // Social media icons - standard size
  social: `${ICON_SIZES.sm} ${ICON_COLORS.muted} ${ICON_STROKES.default}`
} as const;

export type IconSize = keyof typeof ICON_SIZES;
export type IconStroke = keyof typeof ICON_STROKES;
export type IconColor = keyof typeof ICON_COLORS;
export type IconVariant = keyof typeof ICON_VARIANTS;