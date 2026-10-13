# ascii-portfolio

Landing page for [ianalloway.xyz](https://ianalloway.xyz): a rotating 3D "IA" monogram rendered live as shape-aware ASCII, with work, lab, about and contact sections in terminal style.

Vite, Three.js, GSAP, plain CSS.

```bash
npm install
npm run dev
npm run build
```

- Copy and links: `index.html`, `src/terminal.ts`
- Colours: `src/style.css` (`:root`) and `COLOURS` in `src/scene.ts`
- 3D models: `buildModels` in `src/scene.ts`
- ASCII shader: `src/ascii/AsciiPass.ts`
