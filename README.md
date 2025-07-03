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
├── audio/              # Shared audio engine hook
│   └── useAudioEngine.ts
├── lib/                # Utility functions
│   ├── utils.ts
│   └── LevaWrapper.tsx
└── synths/             # Audio synthesis components
    ├── ui/             # Reusable UI components
    │   └── Button.tsx
    ├── SineSynth.tsx
    ├── SineSynth.stories.tsx
    ├── SineSynthWithLeva.tsx
    └── SineSynthWithLeva.stories.tsx
```

## Adding New Synths

1. Create a new synth component in `src/synths/`
2. Create a corresponding story file with `.stories.tsx` extension
3. Use the `useAudioEngine` hook for audio initialization
4. Optionally use Leva controls for real-time parameter adjustment

### Example

```tsx
// src/synths/MySynth.tsx
import { useAudioEngine } from '../audio/useAudioEngine'
import { el } from '@elemaudio/core'

export function MySynth() {
  const { isInitialized, start, stop, render } = useAudioEngine()
  
  // Your synth logic here
  return <div>My Synth</div>
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
// src/synths/MySynth.stories.tsx
import type { Meta, StoryObj } from '@ladle/react'
import { MySynth } from './MySynth'

const meta: Meta<typeof MySynth> = {
  title: 'Synths/MySynth',
  component: MySynth,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
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