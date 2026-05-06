# LingBot-Map v2 — Edge-Native Spatial Intelligence

LingBot-Map is a real-time spatial intelligence platform designed for edge devices. It converts multimodal sensor streams into temporally coherent, drift-corrected 3D semantic maps.

## Technical Stack

- **Framework:** React 19 + Vite 6
- **Styling:** Tailwind CSS 4
- **3D Engine:** Three.js (@react-three/fiber)
- **State:** Zustand
- **Animations:** Motion (Framer Motion)
- **Charts:** Recharts

## Getting Started

### Prerequisites

- **Node.js**: 18.x or 20.x (LTS recommended)
- **Environment Variable**: `GEMINI_API_KEY` must be set in your `.env` file for AI features.

### Installation

1. Clone the repository.
2. Install dependencies:
```bash
npm install
```
3. Set up your environment:
```bash
cp .env.example .env
# Edit .env with your GEMINI_API_KEY
```

### Development

Run the development server:
```bash
npm run dev
```

### Build & Production

1. Build the production assets:
```bash
npm run build
```
2. Preview the production build locally:
```bash
npm run preview
```

## Security & Access

Authentication is governed by the Spatial Identity Provider v2.0. default credentials for internal testing:
- **Email**: `admin@lingbot.io`
- **Password**: `P@ssword1` (Requires uppercase, number, and special character).

## Configuration Guards

All UI/UX interactions are locked via `UX-CONFIG.md`. Modification of these surfaces requires a kernel-level configuration update to maintain spatial coherence across the stack.

## License

Internal-Use Only - LingBot Intelligence Systems.
