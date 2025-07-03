import * as React from 'react'

export function TestComponent({ text = 'Hello World' }: { text?: string }) {
    return (
        <div className="p-4 bg-blue-100 rounded-lg">
            <h2 className="text-lg font-bold text-blue-900">{text}</h2>
            <p className="text-blue-700">This is a test component</p>
        </div>
    )
} 