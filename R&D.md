# What is JSXGraph?

JSXGraph is an open‑source JavaScript library for interactive geometry, function plotting, and general math visualizations. It’s pure JS (no deps) and can render via SVG or Canvas; it’s designed for high performance and multi‑touch, and ships with lots of geometry primitives and plotting helpers. ￼

⸻

## Pros & Cons

## Pros

• All‑in‑one math library: geometry + function graphs + charts in one package. ￼
• No dependencies; small footprint (≈200KB embed mentioned by project). ￼
• Multiple renderers (SVG/Canvas/VML) so you can pick speed vs. fidelity. ￼ ￼
• Actively maintained OSS (GitHub activity, frequent releases). ￼

## Cons

• SVG can slow down with many moving elements; Canvas is usually faster for large, dynamic scenes. (General web‑viz guidance; JSXGraph lets you force Canvas.) ￼ ￼
• React/SPA lifecycle quirks: you must clean up boards and listeners on unmount; otherwise leaks/zombie handlers. ￼
• Auto‑resize pitfalls: missing fixed height can cause resize loops; consider setting a height or disabling auto‑resize. ￼
• SSR: direct use on the server fails (needs document/window); use dynamic import or a “no renderer” mode cautiously. ￼
• MathJax can be heavy (when enabling LaTeX in labels). Consider KaTeX or careful MathJax config if you need performance. ￼ ￼

### Common technical issues (seen in the wild)

• Global updates: JSXGraph may update all boards on a page; cross‑board dependencies are supported but surprising. ￼
• Event/listener cleanup: prefer JXG.JSXGraph.freeBoard(board) to remove listeners and board state when a component unmounts. ￼
• Resize glitches in frameworks: infinite height/resize loops if the container lacks a set height; disable resize or set CSS height. ￼

#### Free alternatives (when they make more sense)

# GeoGebra (embed) :

Powerful and polished; less low‑level control than coding with JSXGraph; licensing caveat.

# Desmos API :

Super easy embeds and great UX, but not open‑source and less extensible than a code library.

# CindyJS :

Closer to JSXGraph in spirit for geometry; different programming model.

# MathBox :

High‑end 3D; overkill for simple plane geometry, great for advanced visuals.

# Plotly.js / ECharts / Chart.js. :

Fantastic for data viz; not geometry/constraint‑based construction. Useful for function plots & dashboards.

# Mafs (React) :

Developer‑friendly React API for math; narrower surface than JSXGraph geometry engine.

# Advice : If you need constructions/constraints (perpendiculars, loci, draggable dependencies), JSXGraph / GeoGebra / CindyJS are the right class. For data charts, use Plotly/ECharts/Chart.js. For simple embeddable calculators, Desmos is great.

## Performance: what to watch for

# JSXGraph is already optimized, but you can hit limits when:

    •	Rendering many moving points/curves in SVG (DOM churn).  ￼
    •	Doing frequent updates (animations, drag handlers) across lots of elements.  ￼
    •	Using MathJax labels heavily.  ￼

# Optimization checklist (practical)

1. Pick the faster renderer for your case
   • SVG is great for small/medium scenes with crisp text; Canvas is better for thousands of dynamic objects. Force Canvas before initBoard:

JXG.Options.renderer = 'canvas'; // or 'svg'
const brd = JXG.JSXGraph.initBoard('box', { /_ ... _/ });

2. Batch changes
   • Wrap bulk creates/updates/removes in an update batch:

brd.suspendUpdate();
// create/remove lots of elements...
brd.unsuspendUpdate();

3. Lower curve sampling
   • Curves/functions allow controlling point counts; reduce sampling density to cut draw cost (e.g., numberPoints, and related low/high variants on curves). ￼

4. Avoid heavy text rendering where possible
   • Turn off MathJax on labels unless needed, or switch to KaTeX for speed:
   JXG.Options.text.useMathJax = false;

5. Clean up on unmount (React/Vue/Svelte etc.)

  useEffect(() => {
  const brd = JXG.JSXGraph.initBoard('box', {...});
  return () => JXG.JSXGraph.freeBoard(brd);
  }, []);

6. Fix container sizing / auto‑resize
   • Give the container a height or disable resize: { enabled: false } to avoid resize loops in SPAs. ￼

7. Prefer requestAnimationFrame for animations
   • Community guidance shows smoother animations when coordinating updates with rAF instead of timers. ￼

## Bottom line :

# If you need interactive geometry with full programmatic control, JSXGraph is one of the best free options. Start in Canvas for heavy dynamics; batch updates; tune curve sampling; and clean up boards in SPA frameworks.

￼

# If you mostly need charting, reach for Plotly/ECharts/Chart.js. If you want fast setup for a calculator/worksheet, Desmos or GeoGebra embeds are great (mind licensing for commercial use). ￼ ￼ ￼ ￼
