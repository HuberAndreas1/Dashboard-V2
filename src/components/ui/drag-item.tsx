"use client"

import type { Stop, StopGroup } from "@/types/types.ts"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Layers } from "lucide-react"

interface DragItemProps {
    item: (Stop & { type: "stop" }) | (StopGroup & { type: "group" })
}

export function DragItem({ item }: DragItemProps) {
    if (item.type === "group") {
        return (
            <Card className="bg-gradient-to-br from-accent-100 to-accent-200 border-accent-300 shadow-2xl drag-overlay max-w-md">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Layers className="w-5 h-5 text-accent-700 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-surface-900 text-sm">{item.name}</h3>
                            <p className="text-xs text-surface-600 mt-1 line-clamp-2">{item.description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="bg-white border border-surface-300 rounded-lg p-3 shadow-2xl drag-overlay max-w-xs">
            <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-medium text-surface-900 truncate">{item.name}</span>
            </div>
        </div>
    )
}
