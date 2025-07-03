import { useEffect, useRef, useState } from 'react'
import WebRenderer from '@elemaudio/web-renderer'

export interface AudioEngine {
    renderer: WebRenderer | null
    isInitialized: boolean
    start: () => Promise<void>
    stop: () => void
    render: (node: unknown) => void
}

export function useAudioEngine(): AudioEngine {
    const rendererRef = useRef<WebRenderer | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)

    const start = async (): Promise<void> => {
        if (rendererRef.current) return

        try {
            const ctx = new window.AudioContext()
            audioContextRef.current = ctx
            const renderer = new WebRenderer()

            // Initialize the renderer
            const node = await renderer.initialize(ctx, {
                numberOfInputs: 0,
                numberOfOutputs: 1,
                outputChannelCount: [2],
            })

            // Connect the output to speakers
            node.connect(ctx.destination)

            // Resume the audio context (required after user gesture)
            await ctx.resume()

            rendererRef.current = renderer
            setIsInitialized(true)
            console.log('Audio engine initialized successfully')
        } catch (error) {
            console.error('Failed to initialize audio engine:', error)
        }
    }

    const stop = (): void => {
        if (audioContextRef.current) {
            audioContextRef.current.close()
            audioContextRef.current = null
        }
        rendererRef.current = null
        setIsInitialized(false)
    }

    const render = (node: unknown): void => {
        if (rendererRef.current) {
            rendererRef.current.render(node, node)
        }
    }

    useEffect(() => {
        return () => {
            stop()
        }
    }, [])

    return {
        renderer: rendererRef.current,
        isInitialized,
        start,
        stop,
        render,
    }
} 