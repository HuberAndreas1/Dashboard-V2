"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Package } from "lucide-react"
import type { Stop } from "@/types/types.ts"
import { SortableStopItem } from "./sortable-stop-item"

interface SortableStopListProps {
    stops: (Stop & { uid: string })[]
    onRemoveStop: (stopUid: string) => void
    isMobile?: boolean
}

export function SortableStopList({ stops, onRemoveStop, isMobile = false }: SortableStopListProps) {
    if (stops.length === 0) {
        return (
            <div className="text-center py-8 text-surface-500 border-2 border-dashed border-border rounded-lg bg-muted/10 drop-zone">
                <Package className="w-8 h-8 mx-auto mb-2 text-surface-400" />
                <p className="text-sm font-medium">Drop stops here</p>
                <p className="text-xs text-surface-400 mt-1">Add items to this group</p>
            </div>
        )
    }

    return (
        <SortableContext items={stops.map((stop) => stop.uid)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 custom-scrollbar max-h-96 overflow-y-auto">
                {stops.map((stop) => (
                    <SortableStopItem key={stop.uid} stop={stop} onRemove={() => onRemoveStop(stop.uid)} isMobile={isMobile} />
                ))}
            </div>
        </SortableContext>
    )
}
