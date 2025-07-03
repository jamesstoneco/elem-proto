import type { Story } from '@ladle/react'
import { SineSynth } from './SineSynth'

export const Default: Story = () => <SineSynth frequency={440} />
export const LowFrequency: Story = () => <SineSynth frequency={100} />
export const HighFrequency: Story = () => <SineSynth frequency={1000} /> 