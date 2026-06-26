# Tech Spectra Hero Section Enhancement Prompt for Antigravity

Use the existing Tech Spectra website codebase and make only the following modifications. Do not modify any other sections, layouts, routes, registration flow, Supabase integration, schedule page, events page, or footer.

## Hero Section Redesign

The hero section should become a highly immersive futuristic landing experience.

### Event Title

Display the event title:

TECH SPECTRA

The title must appear with a cinematic entrance animation immediately after the website loads.

Animation requirements:

- Letters should appear sequentially.
- Use slight upward motion.
- Opacity transition from 0 to 1.
- Duration around 1.5 seconds.
- Add a subtle blue glow.
- Final state should remain static.
- Do not loop the animation.

## Logo Placement

Use the provided Tech Spectra logo image.

Place it at the center of the hero section.

Desktop: 450–550 px
Tablet: 350 px
Mobile: 250 px

Maintain original aspect ratio.
Do not crop the logo.

## Initial Logo Animation

Step 1
Logo is invisible.

Step 2
Thousands of tiny blue particles emerge from below.

Step 3
Particles travel smoothly toward their target positions.

Step 4
Particles assemble together and form the complete Tech Spectra logo.

Step 5
After assembly completes, the normal logo becomes visible.

Step 6
Small residual particles continue floating around the logo.

Animation duration:
2.5–3 seconds

Particle properties

Size:
1–2 pixels

Colors:
#00BFFF
#0099FF
#3B82F6
#66E3FF

Particle count:
1500–2500

Movement easing:
easeOutExpo

## Interactive Particle Dispersion Effect

When the user moves the mouse over the logo:

Only particles near the cursor position should react.

Radius:
80 px

Particles should:
- move away from cursor
- scatter outward
- slightly rotate
- fade slightly

Particles outside the radius should remain stable.

When mouse leaves:

Dispersed particles should smoothly return to their exact original positions.

Use spring physics:

stiffness: 0.08
damping: 0.92

Do NOT disperse the entire logo.
Only affect the interaction area.

## Background

Keep existing dark theme.

Enhance hero background using:

- radial blue gradient
- subtle noise texture
- faint floating particles
- soft glow behind logo

Colors:
#000000
#020617
#04142A

## Scroll Behaviour

On scroll:

Logo scale:
1.0 → 0.92

Opacity:
1 → 0.7

TranslateY:
0px → -120px

Use smooth interpolation.

## Technical Constraints

Do not replace SPA architecture.

Do not introduce React.
Do not introduce Three.js.

Use only:

Vanilla TypeScript
Canvas API
requestAnimationFrame
IntersectionObserver

Maintain 60 FPS performance.

Use offscreen canvas if necessary.

## Important Requirement

Use the exact uploaded Tech Spectra logo image as the source for particle sampling.

Do not redraw, simplify, or recreate the logo.

Sample particles directly from the logo image pixels so that the assembled particle version is visually identical to the original logo.
