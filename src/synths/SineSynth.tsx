import * as React from 'react'
import { useState, useEffect } from 'react'
import { el } from '@elemaudio/core'
import { useAudioEngine } from '../audio/useAudioEngine'
import { Button } from './ui/Button'

interface SineSynthProps {
    frequency?: number
}

export function SineSynth({ frequency = 440 }: SineSynthProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const { isInitialized, start, stop, render } = useAudioEngine()

    useEffect(() => {
        if (isPlaying && isInitialized) {
            console.log('Rendering sine wave at frequency:', frequency)
            const sineNode = el.cycle(frequency)
            render(sineNode)
        }
    }, [isPlaying, isInitialized, frequency, render])

    const handlePlay = async (): Promise<void> => {
        console.log('Play button clicked')
        if (!isInitialized) {
            console.log('Starting audio engine...')
            await start()
        }
        setIsPlaying(true)
        console.log('Set playing to true')
    }

    const handleStop = (): void => {
        console.log('Stop button clicked')
        setIsPlaying(false)
        stop()
    }

    return (
        <div className="p-6 bg-gray-900 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">Sine Synth</h2>
            <div className="space-y-4">
                <div className="text-gray-300">
                    <span className="font-medium">Frequency:</span> {frequency}Hz
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handlePlay}
                        disabled={isPlaying}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
                    >
                        Play
                    </Button>
                    <Button
                        onClick={handleStop}
                        disabled={!isPlaying}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
                    >
                        Stop
                    </Button>
                </div>
                <div className="text-sm text-gray-400">
                    Status: {isInitialized ? 'Ready' : 'Initializing...'}
                </div>
                <div className="text-xs text-gray-500">
                    Playing: {isPlaying ? 'Yes' : 'No'}
                </div>
            </div>
        </div>
    )
} 