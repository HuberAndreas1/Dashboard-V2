"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Package } from "lucide-react"
import type { Stop } from "@/types/types.ts"
import { SortableStopItem } from "./sortable-stop-item"

interface SortableStopListProps {
    stops: Stop[]
    groupId: string
    onRemoveStop: (stopId: number) => void
    isMobile?: boolean
}

export function SortableStopList({ stops, groupId, onRemoveStop, isMobile = false }: SortableStopListProps) {
    if (stops.length === 0) {
        return (
            <div className="text-center py-8 text-surface-500 border-2 border-dashed border-surface-200 rounded-lg bg-surface-50/50 drop-zone">
                <Package className="w-8 h-8 mx-auto mb-2 text-surface-400" />
                <p className="text-sm font-medium">Drop stops here</p>
                <p className="text-xs text-surface-400 mt-1">Add items to this group</p>
            </div>
        )
    }

    return (
        <SortableContext items={stops.map((stop) => stop.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 custom-scrollbar max-h-96 overflow-y-auto">
                {stops.map((stop) => (
                    <SortableStopItem key={stop.id} stop={stop} onRemove={() => onRemoveStop(stop.id)} isMobile={isMobile} />
                ))}
            </div>
        </SortableContext>
    )
}
