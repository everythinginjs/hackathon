# Design Tokens

Professional design system inspired by Figma and Linear.

## Color Palette

### Brand Colors
- **Primary**: Purple-blue (`oklch(0.55 0.22 264)`) - Main brand color for primary actions
- **Secondary**: Lighter purple (`oklch(0.65 0.15 250)`) - Supporting brand color
- **Accent**: Accent purple (`oklch(0.70 0.18 280)`) - Highlights and accents

### Semantic Colors
- **Success**: Modern green (`oklch(0.60 0.18 145)`) - Success states
- **Warning**: Warm orange (`oklch(0.70 0.18 70)`) - Warning states
- **Destructive**: Vibrant red (`oklch(0.55 0.22 25)`) - Destructive actions
- **Info**: Cool blue (`oklch(0.60 0.20 230)`) - Informational states

### Background Hierarchy
**Light Mode:**
- `background`: Pure white with slight warmth (`oklch(0.99 0 0)`)
- `background-secondary`: Subtle gray (`oklch(0.975 0 0)`)
- `background-tertiary`: Card backgrounds (`oklch(0.96 0 0)`)

**Dark Mode:**
- `background`: Deep charcoal (`oklch(0.13 0 0)`)
- `background-secondary`: Slightly lighter (`oklch(0.16 0 0)`)
- `background-tertiary`: Card backgrounds (`oklch(0.18 0 0)`)

### Text Hierarchy
**Light Mode:**
- `foreground`: Near black (`oklch(0.15 0 0)`) - Primary text
- `foreground-secondary`: Medium gray (`oklch(0.45 0 0)`) - Secondary text
- `foreground-tertiary`: Light gray (`oklch(0.60 0 0)`) - Tertiary text

**Dark Mode:**
- `foreground`: Near white (`oklch(0.95 0 0)`) - Primary text
- `foreground-secondary`: Medium gray (`oklch(0.65 0 0)`) - Secondary text
- `foreground-tertiary`: Subtle gray (`oklch(0.50 0 0)`) - Tertiary text

## Border Radius

Modern, subtle roundness inspired by Figma:

- `radius-sm`: 0.125rem (2px) - Tight radius for small elements
- `radius-md`: 0.375rem (6px) - Medium radius
- `radius-lg`: 0.5rem (8px) - Default radius
- `radius-xl`: 0.625rem (10px) - Large radius
- `radius-2xl`: 0.75rem (12px) - Extra large
- `radius-3xl`: 0.875rem (14px) - Buttons, cards
- `radius-4xl`: 1rem (16px) - Large containers

## Borders

**Light Mode:**
- `border`: Light gray (`oklch(0.90 0 0)`) - Default borders
- `border-strong`: Stronger gray (`oklch(0.80 0 0)`) - Emphasis borders

**Dark Mode:**
- `border`: Subtle gray (`oklch(0.25 0 0)`) - Default borders
- `border-strong`: Stronger gray (`oklch(0.35 0 0)`) - Emphasis borders

## Typography

### Font Features
- Font smoothing: antialiased
- Text rendering: optimizeLegibility
- Features: 'rlig' (ligatures), 'calt' (contextual alternates)

### Scale
- **h1**: 2.25rem (36px), -0.02em tracking
- **h2**: 1.875rem (30px), -0.015em tracking
- **h3**: 1.5rem (24px), -0.01em tracking
- **h4**: 1.25rem (20px)
- **h5**: 1.125rem (18px)
- **h6**: 1rem (16px)

All headings use semibold weight with tight tracking for a modern look.

## Interactive States

### Focus
- 2px ring with brand color
- 2px offset from element
- High contrast for accessibility

### Selection
- 20% opacity brand color background
- Maintains text readability

## Scrollbar Styling

Clean, minimal scrollbars:
- 8px width/height
- Transparent track
- 50% opacity thumb on idle
- Full opacity on hover
- 4px border radius

## Usage Examples

```tsx
// Primary button
<Button variant="default">Primary Action</Button>

// Secondary button
<Button variant="secondary">Secondary Action</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Outline style
<Button variant="outline">Cancel</Button>

// Ghost style
<Button variant="ghost">Learn More</Button>
```

## Dark Mode

Toggle dark mode by adding the `dark` class to the root element:

```tsx
<html className="dark">
  {/* Your app */}
</html>
```

Or use a theme provider:

```tsx
import { useEffect } from 'react';

function ThemeToggle() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

## Chart Colors

Professional data visualization palette:

1. **Purple-blue**: Primary brand color
2. **Teal**: Cool, analytical
3. **Yellow-green**: Warm, positive
4. **Magenta**: Vibrant accent
5. **Orange**: Warm accent

All colors maintain good contrast ratios in both light and dark modes.
