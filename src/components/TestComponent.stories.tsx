import type { Story } from '@ladle/react'
import { TestComponent } from './TestComponent'

export const Default: Story = () => <TestComponent text="Hello World" />
export const CustomText: Story = () => <TestComponent text="Custom Message" /> 