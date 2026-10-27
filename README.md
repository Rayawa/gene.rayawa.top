# gene.rayawa.top

English | [简体中文](README_zh.md)

An interactive browser demonstration of Agrobacterium-mediated plant transformation.

Archived project retained for reference.

## Overview

The interface illustrates stages of a plant genetic transformation experiment using interactive controls and animations. It is a teaching demonstration rather than an experimental protocol or biological simulation.

## Technology and Dependencies

HTML, CSS and JavaScript. The page loads DragDropTouch from a CDN for touch interactions; network access is needed for that external script. Python 3 is optional for local serving.

## Repository Structure

- `index.html` — interface
- `script.js` — interaction and experiment flow
- `style.css` — layout and animation
- `favicon.ico` — site icon

## Quick Start

Serve the repository root so absolute asset paths resolve correctly:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Edit the HTML and assets directly; no frontend build is required.
