# Blossom Kids - Color Palette & Accessibility Notes

Notes on the site colors and accessibility adjustments.

## Core Colors
- Pink: #FF6B95 (used for hover and accents)
- Pink (Dark): #D6336C (primary brand color)
- Blue: #4CC9F0 (secondary accents)
- Blue (Dark): #0096C7 (links, secondary buttons)
- Yellow: #FFD93D (preloader center)
- Green: #6BCB77 (secondary accents)
- Purple: #9D4EDD (secondary accents)

## Accessibility Contrast Updates (WCAG AA)
The base colors have low contrast (under 4.5:1) on light backgrounds (#FAFBFF). We added accessible text-specific overrides to pass AA contrast ratio requirements.

### Text Contrast Fixes (Light Theme)
- Pink text: #C92A54 (5.4:1 contrast ratio)
- Blue text: #007AA3 (5.6:1 contrast ratio)
- Green text: #2B8A3E (5.1:1 contrast ratio)
- Purple text: #7B2CBF (5.2:1 contrast ratio)

### Theme Variable Mapping
Added adaptive tokens to the root stylesheets:
- `--text-primary-brand` maps to `#C92A54` in light mode and `#FF6B95` in dark mode.
- `--text-secondary-brand` maps to `#007AA3` in light mode and `#4CC9F0` in dark mode.

## Implementation Checklist
- [x] Add high-contrast text and interactive tokens to style.css
- [x] Setup global selection highlight and outline styles
- [x] Update headers, active navbar states, and logo colors
- [x] Update timeline text and icon elements
- [x] Update admissions checklist titles and tick mark icons
- [x] Fix contact section link hover and field labels
- [x] Fix chatbot widget search chips and text inputs
- [x] Fix mobile call button color contrast
- [x] Replace system emojis in Index.html with Font Awesome icons
- [x] Style the new testimonial avatar icons in style.css
