# ascii-portfolio

Landing page for [ianalloway.xyz](https://ianalloway.xyz): a rotating 3D "IA" monogram rendered live as shape-aware ASCII, with work, lab, about and contact sections in terminal style.

Vite, Three.js, GSAP, plain CSS.

```bash
npm ci
npm run dev
npm run build
npm run preview
```

- Copy and links: `index.html`, `src/terminal.ts`
- Colours: `src/style.css` (`:root`) and `COLOURS` in `src/scene.ts`
- 3D models: `buildModels` in `src/scene.ts`
- ASCII shader: `src/ascii/AsciiPass.ts`

## Rendering and accessibility

The Three.js scene loads separately from the page controls. If graphics loading or
WebGL initialization fails, the page keeps its static background and the work
links, contact terminal, and navigation still work. The about paragraph has a
complete screen-reader copy while its visual typing animation runs.

Before publishing, check the page at desktop and phone widths, tab through the
work links, try the contact commands, and enable reduced motion in your browser.
`npm run build` produces the static site in `dist/`.
