# Elementary Audio Playground

A blazingly fast Elementary Audio playground inside Ladle for rapid audio synthesis prototyping.

# background

goal is to create a fast to use iterative playground for both audio and ui elements. react and typescript focused.

## Features

- 🎵 **Elementary Audio v4** - Real-time audio synthesis
- ⚡ **Ladle** - Fast React component playground with HMR
- 🎛️ **Leva** - Beautiful controls for real-time parameter tweaking
- 🎨 **Tailwind CSS + Radix UI** - Modern, accessible UI components
- 📝 **TypeScript** - Strict type safety throughout
- 🧠 **Jotai** - Lightweight state management
- 🚀 **CLI Generator** - One-command sketch creation with auto-incrementing names

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

### 🚀 Fast Sketch Creation
- **One command**: `npm run generate` or `npm run g`
- **Auto-prompting**: No name? Get prompted with auto-incrementing suggestions
- **Auto-incrementing**: `sketch001`, `sketch002`, etc.
- **Template-based**: Consistent patterns and boilerplate
- **Leva-first**: All sketches come with real-time controls

### 🎯 Convention Over Configuration
- **Consistent naming**: `ComponentNameWithLeva.tsx` + `ComponentNameWithLeva.stories.tsx`
- **Standard patterns**: All sketches follow the same structure
- **Automatic stories**: Story files are generated automatically
- **Smart defaults**: Sensible parameter ranges and controls

### 🔧 CLI Commands
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