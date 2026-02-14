# Color Variable Mapping Guide

## Current Color Scheme (Health-care Green Theme)

### Primary Colors
- **Primary**: Green (#22c55e / oklch(0.55 0.15 150))
- **Secondary**: Light Emerald (#10b981 / oklch(0.65 0.12 160))
- **Accent**: Very Light Green (oklch(0.95 0.05 150))

### Tailwind to CSS Variable Mapping

#### Green Colors (Primary Theme)
- `bg-green-50` → `bg-accent` or `bg-green-50/[opacity]`
- `bg-green-500` → `bg-primary`
- `bg-green-600` → `bg-primary` (darker variant)
- `text-green-600` → `text-primary`
- `border-green-500` → `border-primary`
- `from-green-500 to-emerald-600` → `from-primary to-secondary`

#### Blue/Teal/Cyan (Should be converted to Green)
- `bg-blue-50` → `bg-accent`
- `bg-blue-500/600` → `bg-primary`
- `text-blue-600` → `text-primary`
- `from-blue-500 to-cyan-600` → `from-primary to-secondary`
- `border-blue-200` → `border-accent`

#### Purple/Indigo (Accent colors - keep for variety or convert)
- `bg-purple-50` → `bg-accent` or keep for visual variety
- `bg-indigo-600` → `bg-primary` (for consistency)
- `text-indigo-600` → `text-primary`

#### Neutral Colors (Keep as is)
- `bg-slate-*` → Keep (neutral backgrounds)
- `text-slate-*` → Keep (text colors)
- `border-slate-*` → Keep (borders)

### Recommended Replacements

1. **Buttons & CTAs**: Use `bg-primary`, `hover:bg-primary/90`, `text-primary-foreground`
2. **Links & Accents**: Use `text-primary`, `hover:text-primary/80`
3. **Borders**: Use `border-primary` for active states, `border-border` for neutral
4. **Backgrounds**: Use `bg-accent` for light backgrounds, `bg-primary` for strong emphasis
5. **Gradients**: Use `from-primary to-secondary` for brand gradients

### Implementation Strategy

1. Replace all blue/teal/cyan with green (primary/secondary)
2. Convert hardcoded indigo/purple to primary where appropriate
3. Keep purple/indigo for visual variety in illustrations only
4. Use CSS variables for all interactive elements
5. Maintain neutral slate colors for text and backgrounds
