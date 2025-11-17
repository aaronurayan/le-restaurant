# 101. 🎨 DESIGN PRINCIPLES COMPLIANCE GUIDE

![Documentation Status](https://img.shields.io/badge/documentation-complete-brightgreen)
![Document Number](https://img.shields.io/badge/document-101-blue)
![Design System](https://img.shields.io/badge/design-system-active-blue)
![Last Updated](https://img.shields.io/badge/updated-2025--01--XX-lightgrey)

**Author**: UI/UX Design Team  
**Date**: 2025-01-XX  
**Version**: 1.0  
**Status**: ✅ Active Guidelines

---

## 📋 Overview

This document ensures the Le Restaurant website follows industry best practices for fonts, colors, and spacing as outlined in:
- [Landing Page Design: Fonts and Colors](https://kickofflabs.com/blog/landing-page-fonts-colors/)
- [Principles of Spacing in UI Design: 4-Point System](https://uxplanet.org/principles-of-spacing-in-ui-design-a-beginners-guide-to-the-4-point-spacing-system-6e88233b527a)

---

## 🎨 COLOR SYSTEM

### Principle: Limit Color Palette

**Guideline**: Use 1-3 colors maximum on any page, with one primary CTA color.

#### Current Implementation

**Primary Colors** (CTA & Brand):
```css
--primary-500: #f59e0b;  /* Main CTA color - Warm amber */
--primary-600: #d97706;  /* Hover state */
--primary-700: #b45309;  /* Active state */
```

**Secondary Colors** (Supporting):
```css
--secondary-500: #22c55e;  /* Success states */
--secondary-600: #16a34a;
```

**Neutral Colors** (Background & Text):
```css
--neutral-50: #fafafa;   /* Light backgrounds */
--neutral-100: #f5f5f5;
--neutral-500: #737373;  /* Body text */
--neutral-700: #404040;   /* Headings */
--neutral-900: #171717;  /* Dark text */
```

#### Color Usage Rules

1. **Primary Color (Amber)**: 
   - ✅ Use ONLY for CTAs (buttons, links)
   - ✅ Use for brand elements (logo, highlights)
   - ❌ Do NOT use for body text
   - ❌ Do NOT use for backgrounds

2. **Secondary Color (Green)**:
   - ✅ Use for success states
   - ✅ Use for positive indicators
   - ❌ Do NOT use as primary CTA

3. **Neutral Colors**:
   - ✅ Use for all text (body, headings)
   - ✅ Use for backgrounds
   - ✅ Use for borders and dividers

#### Color Assignment

| Element | Color | Purpose |
|---------|-------|---------|
| Primary Buttons | `--primary-500` | Main CTAs |
| Hover States | `--primary-600` | Interactive feedback |
| Success Messages | `--secondary-500` | Positive feedback |
| Body Text | `--neutral-700` | Readability |
| Headings | `--neutral-900` | Hierarchy |
| Backgrounds | `--neutral-50/100` | Clean appearance |

#### Compliance Checklist

- [x] Limited to 3 main colors (Primary, Secondary, Neutral)
- [x] One strong CTA color (Primary Amber)
- [x] Complementary colors don't overpower CTA
- [x] Consistent color usage across pages
- [x] High contrast for accessibility (WCAG AA)

---

## 🔤 TYPOGRAPHY SYSTEM

### Principle: One Font Family

**Guideline**: Use one primary font family with variations (weight, style, size).

#### Current Implementation

**Primary Font Family**: Inter (Sans-serif)
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```
- ✅ Used for: Body text, UI elements, navigation
- ✅ Weights: 300, 400, 500, 600, 700, 800
- ✅ Styles: Regular, Italic, Bold

**Secondary Font Family**: Playfair Display (Serif)
```css
--font-serif: 'Playfair Display', Georgia, serif;
```
- ✅ Used for: Headings, brand elements, hero text
- ✅ Weights: 400, 500, 600, 700, 800
- ⚠️ Limited use only (headings, not body)

#### Typography Hierarchy

| Element | Font Family | Size | Weight | Use Case |
|---------|-------------|------|--------|----------|
| H1 (Hero) | Playfair Display | 3xl-4xl | 700-800 | Page titles |
| H2 | Playfair Display | 2xl-3xl | 600-700 | Section titles |
| H3 | Inter | xl-2xl | 600 | Subsection titles |
| Body | Inter | base-lg | 400 | Body text |
| Small | Inter | sm | 400 | Captions, labels |
| Button | Inter | base | 600 | CTA buttons |

#### Font Styling Rules

1. **Weight Variations**:
   - Regular (400): Body text
   - Medium (500): Emphasis
   - Semibold (600): Headings, buttons
   - Bold (700+): Strong emphasis

2. **Size Variations**:
   - Use relative units (rem, em)
   - Responsive sizing (smaller on mobile)
   - Maintain hierarchy

3. **Style Variations**:
   - Italic: For emphasis (sparingly)
   - Uppercase: For labels, badges (sparingly)
   - Capitalize: For titles (when appropriate)

#### Mobile Responsiveness

**Desktop**:
- H1: 3xl-4xl (1.875rem - 2.25rem)
- Body: lg (1.125rem)

**Mobile**:
- H1: 2xl-3xl (1.5rem - 1.875rem)
- Body: base (1rem)

**Compliance Checklist**:
- [x] One primary font family (Inter)
- [x] Limited secondary font (Playfair Display for headings only)
- [x] Consistent font sizes
- [x] Mobile-responsive typography
- [x] Proper line height (1.5-1.75)

---

## 📏 SPACING SYSTEM (4-Point Grid)

### Principle: 4-Point Spacing System

**Guideline**: Use multiples of 4px (0.25rem) for all spacing.

#### Current Implementation

**Base Unit**: 4px = 0.25rem = `--space-1`

**Spacing Scale**:
```css
--space-1: 0.25rem;   /* 4px - Tight spacing */
--space-2: 0.5rem;     /* 8px - Compact spacing */
--space-3: 0.75rem;    /* 12px - Small spacing */
--space-4: 1rem;       /* 16px - Base spacing */
--space-5: 1.25rem;    /* 20px - Medium spacing */
--space-6: 1.5rem;     /* 24px - Standard spacing */
--space-8: 2rem;       /* 32px - Large spacing */
--space-10: 2.5rem;    /* 40px - Extra large */
--space-12: 3rem;      /* 48px - Section spacing */
--space-16: 4rem;      /* 64px - Major spacing */
--space-20: 5rem;      /* 80px - Hero spacing */
--space-24: 6rem;      /* 96px - Page spacing */
```

#### Spacing Usage Rules

1. **Component Internal Spacing**:
   - Padding: `space-2` to `space-4` (8px-16px)
   - Gap between elements: `space-2` to `space-4`

2. **Component External Spacing**:
   - Margin between components: `space-6` to `space-8` (24px-32px)
   - Section spacing: `space-12` to `space-16` (48px-64px)

3. **Page Layout Spacing**:
   - Container padding: `space-4` to `space-6` (16px-24px)
   - Section margins: `space-12` to `space-16` (48px-64px)

#### Spacing Examples

**Button Padding**:
```css
padding: var(--space-3) var(--space-6);  /* 12px 24px */
```

**Card Spacing**:
```css
padding: var(--space-6);                 /* 24px */
margin-bottom: var(--space-8);          /* 32px */
```

**Section Spacing**:
```css
padding-top: var(--space-16);           /* 64px */
padding-bottom: var(--space-16);         /* 64px */
```

**Grid Gap**:
```css
gap: var(--space-6);                     /* 24px */
```

#### Consistency Rules

1. **Same Elements, Same Spacing**:
   - All buttons: Same padding
   - All cards: Same padding
   - All sections: Consistent margins

2. **Visual Rhythm**:
   - Related elements: Smaller spacing
   - Unrelated elements: Larger spacing
   - Maintain consistent rhythm

3. **White Space**:
   - Don't be afraid of white space
   - Use spacing to create hierarchy
   - Group related elements

**Compliance Checklist**:
- [x] All spacing uses 4px multiples
- [x] Consistent spacing for same elements
- [x] Proper visual hierarchy
- [x] Adequate white space
- [x] Responsive spacing adjustments

---

## 🎯 BRANDING & LOGOS

### Logo Guidelines

1. **Size**:
   - ✅ Large enough to read/recognize
   - ❌ Not larger than other page elements
   - ✅ Consistent across pages

2. **Background**:
   - ✅ Transparent background (PNG)
   - ❌ No white/colored background blocks
   - ✅ Adapts to page background

3. **Placement**:
   - ✅ Top of page (header)
   - ✅ Footer (smaller)
   - ✅ Consistent position

---

## ✅ CONSISTENCY CHECKLIST

### Colors
- [x] Limited to 1-3 colors per page
- [x] One primary CTA color
- [x] Consistent color usage
- [x] High contrast for accessibility

### Typography
- [x] One primary font family
- [x] Limited secondary font (headings only)
- [x] Consistent font sizes
- [x] Mobile-responsive
- [x] Proper hierarchy

### Spacing
- [x] 4-point grid system
- [x] Consistent spacing for same elements
- [x] Proper visual rhythm
- [x] Adequate white space
- [x] Responsive adjustments

### Branding
- [x] Appropriate logo size
- [x] Transparent background
- [x] Consistent placement
- [x] Brand colors used correctly

---

## 🔍 VALIDATION TOOLS

### Automated Checks

1. **Color Contrast**:
   - Tool: WebAIM Contrast Checker
   - Target: WCAG AA minimum
   - Check: All text/background combinations

2. **Spacing Validation**:
   - Tool: Browser DevTools
   - Check: All spacing uses CSS variables
   - Verify: 4px multiples

3. **Typography**:
   - Tool: Browser DevTools
   - Check: Font family usage
   - Verify: Responsive sizing

### Manual Review

1. **Visual Consistency**:
   - Review all pages
   - Check color usage
   - Verify spacing rhythm

2. **Accessibility**:
   - Screen reader testing
   - Keyboard navigation
   - Color blindness testing

---

## 📚 References

### Design Principles
- [Landing Page Design: Fonts and Colors](https://kickofflabs.com/blog/landing-page-fonts-colors/)
- [4-Point Spacing System](https://uxplanet.org/principles-of-spacing-in-ui-design-a-beginners-guide-to-the-4-point-spacing-system-6e88233b527a)

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Tools
- [Coolors](https://coolors.co/) - Color palette generator
- [Adobe Color](https://color.adobe.com/) - Color theme extraction
- [Google Fonts](https://fonts.google.com/) - Typography

---

## 🔄 Maintenance

This document should be updated when:
- Design system changes
- New components added
- Spacing/color guidelines updated
- Brand guidelines change

**Last Updated**: 2025-01-XX  
**Next Review**: 2025-04-XX  
**Owner**: UI/UX Design Team

---

**Related Documents**:
- [100. Documentation Plan](./100-DOCUMENTATION-PLAN-CONTINUOUS-DEVELOPMENT.md)
- [102. XML Structure Files](./102-XML-STRUCTURE-FILES/)
- [Frontend Design](./design/05-frontend-design.md)

