"use client"

import {useSortable} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import {GripVertical, Info, Trash2} from "lucide-react"
import {Button} from "@/components/ui/button"
import type {Stop} from "@/types/types.ts";

interface SortableStopItemProps {
    stop: Stop
    onRemove: () => void
    isMobile?: boolean
}

export function SortableStopItem({ stop, onRemove, isMobile = false }: SortableStopItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: stop.id,
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
            className="flex items-center justify-between p-3 bg-surface-50 rounded-lg border border-surface-200 hover:bg-surface-100 hover:border-surface-300 transition-all duration-200 group animate-fade-in"
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                    className={`text-surface-400 hover:text-surface-600 transition-colors group-hover:text-surface-500 ${isMobile ? "mobile-drag-handle" : "drag-handle"}`}
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-surface-900 truncate">{stop.name}</span>
            </div>
            <div className={`flex items-center gap-2 ${isMobile ? "flex-col" : ""}`}>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRemove}
                    className="text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/40 shadow-sm"
                >
                    <Trash2 className="w-3 h-3 mr-1" />
                    {!isMobile && "Remove"}
                </Button>
                <Button size="sm" className="bg-accent-600 hover:bg-accent-700 text-white shadow-sm">
                    <Info className="w-3 h-3 mr-1" />
                    {!isMobile && "Details"}
                </Button>
            </div>
        </div>
    )
}
