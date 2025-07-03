# Elementary Audio Playground

A blazingly fast [Elementary Audio](https://www.elementary.audio/) playground inside Ladle for rapid audio synthesis prototyping.

## Getting Started

### Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate your first sketch:**
   ```bash
   npm run gen
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

### Recommended Workflow

For the best development experience, use **2 terminal tabs/windows**:

**Terminal 1** - Development server:
```bash
npm start
```

**Terminal 2** - Generate new sketches:
```bash
npm run gen
```

### Development Features

- **Hot Module Replacement (HMR)** - Instant updates as you code
- **Live reloads** - See changes immediately in the browser
- **TypeScript** - Better IDE code completion and type safety
- **TypeScript errors** - Check the web server console for any TS issues

Open [http://localhost:61000](http://localhost:61000) to view the playground.

## Next Steps: Iterative Development

### Generate New Sketches

After getting started, create your first sketch:

```bash
npm run gen
```

The tooling will automatically increment sketch numbers for you (sketch001, sketch002, etc.).

### Iterative Workflow

**Creative coding thrives on iteration.** Here's the recommended workflow:

1. **Generate** a new sketch: `npm run gen`
2. **Experiment** with audio parameters and synthesis techniques
3. **Save** your work (auto-saved with HMR)
4. **Copy/iterate** the last sketch to build upon your ideas
5. **Repeat** - each iteration builds on the previous one

### Why Bottom-Up Design?

This playground embraces **bottom-up design** and **creative coding techniques**:

- **Rapid Prototyping** - Start with simple oscillators, build complexity gradually
- **Exploration-First** - Let the code guide your creative process, not rigid planning
- **Emergent Behavior** - Complex audio systems emerge from simple building blocks
- **Learning Through Doing** - Discover new techniques through experimentation
- **Incremental Complexity** - Each sketch adds one new concept or technique

**Creative coding philosophy**: Start with the smallest working example, then iterate and expand. The best audio synthesis ideas often come from unexpected combinations discovered through rapid experimentation.

## Why This Approach?

### Better Than SRVB

[SRVB](https://www.elementary.audio/srvb) is excellent for structured audio development, but it's too heavy and rigid for rapid iteration:

- **Too structured** - Forces you into predefined workflows
- **Heavy setup** - Requires more configuration for simple experiments
- **Slower iteration** - More steps between idea and execution
- **Overkill for prototyping** - Better suited for production audio applications

### Better Than CodePen

CodePen and similar online playgrounds leave a lot to be desired for audio development:

- **Limited TypeScript support** - No autocomplete or type safety
- **No CLI tools** - Manual file creation and management
- **Poor audio debugging** - Limited console access and debugging tools
- **No local development** - Can't use your preferred editor or tools
- **Version control challenges** - Hard to track iterations and changes

### Why This Playground?

This setup gives you the best of both worlds:

- **Your editor of choice** - Use VS Code, Vim, or any editor you prefer
- **Full TypeScript benefits** - Autocomplete, type safety, and IntelliSense
- **CLI scaffolding** - Generate new sketches instantly with `npm run gen`
- **Rapid iteration** - Hot reload and instant feedback
- **Version control** - Git integration for tracking your creative process
- **Local development** - Full control over your development environment

---

## Background

Goal is to create a fast to use iterative playground for both audio and ui elements. React and TypeScript focused.

## Features

- **Elementary Audio v4** - Real-time audio synthesis
- **Ladle** - Fast React component playground with HMR
- **Leva** - Beautiful controls for real-time parameter tweaking
- **Tailwind CSS + Radix UI** - Modern, accessible UI components
- **TypeScript** - Strict type safety throughout
- **Jotai** - Lightweight state management
- **CLI Generator** - One-command sketch creation with auto-incrementing names

## Quick Start

### Prerequisites

- Node.js 20.18.0 (managed via asdf)
- npm

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:61000](http://localhost:61000) to view the playground.

## Project Structure

```
src/
├── sketches/           # Audio synthesis components
│   ├── audio/          # Shared audio engine hook
│   │   └── useAudioEngine.ts
│   ├── ui/             # Reusable UI components
│   │   └── Button.tsx
│   ├── SineSynthWithLeva.tsx
│   └── SineSynthWithLeva.stories.tsx
├── components/         # UI components
│   ├── TestComponent.tsx
│   └── TestComponent.stories.tsx
└── lib/                # Utility functions
    ├── utils.ts
    └── LevaWrapper.tsx
```

## Developer Experience

This project is optimized for rapid audio prototyping with a focus on developer experience:

### Fast Sketch Creation
- **One command**: `npm run generate` or `npm run g`
- **Auto-prompting**: No name? Get prompted with auto-incrementing suggestions
- **Auto-incrementing**: `sketch001`, `sketch002`, etc.
- **Template-based**: Consistent patterns and boilerplate
- **Leva-first**: All sketches come with real-time controls

### Convention Over Configuration
- **Consistent naming**: `ComponentNameWithLeva.tsx` + `ComponentNameWithLeva.stories.tsx`
- **Standard patterns**: All sketches follow the same structure
- **Automatic stories**: Story files are generated automatically
- **Smart defaults**: Sensible parameter ranges and controls

### CLI Commands
```bash
# Create a new sketch (prompts for name)
npm run generate

# Create with specific name
npm run generate oscillator

# Create UI component
npm run generate component knob

# Short alias
npm run g filter
```

## Adding New Sketches

Use the CLI generator for the fastest workflow:

```bash
# Generate a new sketch (will prompt for name if not provided)
npm run generate

# Or with a specific name
npm run generate oscillator

# Short alias
npm run g filter
```

The generator will:
1. Create a new sketch component in `src/sketches/` with Leva controls
2. Create a corresponding story file automatically
3. Use auto-incrementing filenames (sketch001, sketch002, etc.)
4. Follow established patterns and conventions

### Manual Creation

If you prefer to create files manually:

1. Create a new sketch component in `src/sketches/`
2. Create a corresponding story file with `.stories.tsx` extension
3. Use the `useAudioEngine` hook for audio initialization
4. Include Leva controls for real-time parameter adjustment

### Example

```tsx
// src/sketches/MySketchWithLeva.tsx
import { useAudioEngine } from './audio/useAudioEngine'
import { el } from '@elemaudio/core'

export function MySketchWithLeva() {
  const { isInitialized, start, stop, render } = useAudioEngine()
  
  // Your sketch logic here
  return <div>My Sketch</div>
}
```

## Leva Integration

This project uses Leva for real-time parameter control and status display. The implementation follows Leva's controlled inputs pattern for dynamic updates.

### Status Display Pattern

For displaying dynamic status values that update based on component state:

```tsx
function StatusDisplay({ isInitialized, isPlaying }) {
  const [, set] = useControls('Status', () => ({
    'Audio Engine': 'Initializing...',
    'Status': 'Stopped',
  }))

  useEffect(() => {
    set({
      'Audio Engine': isInitialized ? 'Ready' : 'Initializing...',
      'Status': isPlaying ? 'Playing' : 'Stopped',
    })
  }, [isInitialized, isPlaying, set])

  return null
}
```

### Key Points

- **Controlled Inputs**: Use the function-based `useControls` to get a setter function
- **Dynamic Updates**: Call `set()` in `useEffect` when state changes
- **Real-time Display**: Status values update immediately in the Leva panel
- **Positioning**: Leva is positioned on the left side via CSS to avoid interference with Ladle's UI

### Transport Controls

Simple always-enabled buttons for play/stop functionality:

```tsx
useControls('Transport', {
  play: button(() => {
    if (!isInitialized) {
      start().then(() => setIsPlaying(true))
    } else {
      setIsPlaying(true)
    }
  }),
  stop: button(() => {
    setIsPlaying(false)
    stop()
  }),
})
```

## Leva Integration

This project uses Leva for real-time parameter control and status display. The implementation follows Leva's controlled inputs pattern for dynamic updates.

### Status Display Pattern

For displaying dynamic status values that update based on component state:

```tsx
function StatusDisplay({ isInitialized, isPlaying }) {
  const [, set] = useControls('Status', () => ({
    'Audio Engine': 'Initializing...',
    'Status': 'Stopped',
  }))

  useEffect(() => {
    set({
      'Audio Engine': isInitialized ? 'Ready' : 'Initializing...',
      'Status': isPlaying ? 'Playing' : 'Stopped',
    })
  }, [isInitialized, isPlaying, set])

  return null
}
```

### Key Points

- **Controlled Inputs**: Use the function-based `useControls` to get a setter function
- **Dynamic Updates**: Call `set()` in `useEffect` when state changes
- **Real-time Display**: Status values update immediately in the Leva panel
- **Positioning**: Leva is positioned on the left side via CSS to avoid interference with Ladle's UI

### Transport Controls

Simple always-enabled buttons for play/stop functionality:

```tsx
useControls('Transport', {
  play: button(() => {
    if (!isInitialized) {
      start().then(() => setIsPlaying(true))
    } else {
      setIsPlaying(true)
    }
  }),
  stop: button(() => {
    setIsPlaying(false)
    stop()
  }),
})
```

```tsx
// src/sketches/MySketchWithLeva.stories.tsx
import type { Story } from '@ladle/react'
import { MySketchWithLeva } from './MySketchWithLeva'

export const Default: Story = () => <MySketchWithLeva />
```

## Available Scripts

- `npm run dev` - Start Ladle development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## TODO

- [x] CLI scaffolding for rapid sketch creation
- [x] Auto-incrementing sketch names
- [x] Template-based generation
- [x] Leva-first approach
- [ ] Knob UI kit for better parameter control
- [ ] Multi-voice synthesis examples
- [ ] Effects processing (reverb, delay, etc.)
- [ ] MIDI input support
- [ ] Audio file import/export
- [ ] Deployment guide
- [ ] More waveform types
- [ ] Envelope generators
- [ ] LFO modulation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` and `npm run type-check`
5. Submit a pull request

## License

MIT 