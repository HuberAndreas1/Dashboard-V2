"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Stop } from "@/types/types.ts"

interface UnassignedStopItemProps {
    stop: Stop
    isMobile?: boolean
}

export function UnassignedStopItem({ stop, isMobile = false }: UnassignedStopItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: `un-${stop.id}`,
        data: {
            type: "stop",
            stop,
        },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
    style={style}
    className={`flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border hover:bg-muted/40 transition-all duration-200 group animate-fade-in ${isMobile ? "mobile-drag-handle" : "drag-handle"}`}
    {...attributes}
    {...listeners}
>
    <div className="flex items-center gap-3 flex-1 min-w-0">
    <GripVertical className="h-4 w-4 text-surface-400 group-hover:text-surface-500 transition-colors" />
    <span className="text-sm font-medium text-surface-900 truncate">{stop.name}</span>
        </div>
        <Button size="sm" className="bg-accent-600 hover:bg-accent-700 text-white shadow-sm">
    <Info className="w-3 h-3 mr-1" />
        {!isMobile && "Details"}
    </Button>
    </div>
)
}
