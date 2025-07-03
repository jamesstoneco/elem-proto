import { useControls } from 'leva'
import { ReactNode } from 'react'

interface LevaWrapperProps {
    children: ReactNode
    controls: Record<string, any>
    title?: string
}

export function LevaWrapper({ children, controls, title }: LevaWrapperProps) {
    const values = useControls(title || 'Controls', controls)

    return (
        <div className="space-y-4">
            <div className="p-4 bg-gray-800 rounded-lg">
                {children}
            </div>
            <div className="text-sm text-gray-400">
                <strong>Current Values:</strong>
                <pre className="mt-2 p-2 bg-gray-900 rounded text-xs overflow-auto">
                    {JSON.stringify(values, null, 2)}
                </pre>
            </div>
        </div>
    )
} 