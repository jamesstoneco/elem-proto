import { useState, useEffect } from 'react'
import { el } from '@elemaudio/core'
import { useControls, button } from 'leva'
import { useAudioEngine } from '../audio/useAudioEngine'

// Import Leva config to ensure it's loaded
import '../index.css'

// Status display using controlled inputs pattern
function StatusDisplay({ isInitialized, isPlaying }: { isInitialized: boolean; isPlaying: boolean }) {
    const [, set] = useControls('Status', () => ({
        'Audio Engine': 'Initializing...',
        'Status': 'Stopped',
    }))

    // Update the status when props change
    useEffect(() => {
        set({
            'Audio Engine': isInitialized ? 'Ready' : 'Initializing...',
            'Status': isPlaying ? 'Playing' : 'Stopped',
        })
    }, [isInitialized, isPlaying, set])

    return null
}

export function SineSynthWithLeva() {
    const [isPlaying, setIsPlaying] = useState(false)
    const { isInitialized, start, stop, render } = useAudioEngine()

    // Transport controls at the top - always enabled
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

    // Audio parameters
    const { frequency, amplitude, waveform } = useControls('Parameters', {
        frequency: {
            value: 440,
            min: 20,
            max: 2000,
            step: 1,
            label: 'Frequency (Hz)',
        },
        amplitude: {
            value: 0.5,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'Amplitude',
        },
        waveform: {
            value: 'sine',
            options: ['sine', 'square', 'sawtooth', 'triangle'],
            label: 'Waveform',
        },
    })

    useEffect(() => {
        if (isPlaying && isInitialized) {
            let oscillator

            switch (waveform) {
                case 'square':
                    oscillator = el.square(frequency)
                    break
                case 'sawtooth':
                    oscillator = el.saw(frequency)
                    break
                case 'triangle':
                    oscillator = el.triangle(frequency)
                    break
                default:
                    oscillator = el.cycle(frequency)
            }

            const output = el.mul(oscillator, amplitude)
            render(output)
        }
    }, [isPlaying, isInitialized, frequency, amplitude, waveform, render])

    return (
        <div className="p-6">
            <StatusDisplay isInitialized={isInitialized} isPlaying={isPlaying} />
            <div className="text-center text-sm text-gray-400 mt-4">
                Elementary Audio v4 + Leva Controls
            </div>
        </div>
    )
}
