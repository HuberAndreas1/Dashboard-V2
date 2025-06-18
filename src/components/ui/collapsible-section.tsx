"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronDown, ChevronUp, GripVertical, Info, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { StopGroup } from "@/types/types.ts"
import { SortableStopList } from "./sortable-stop-list"
import { useDroppable } from "@dnd-kit/core"
import {useEffect} from "react";

interface CollapsibleSectionProps {
    group: StopGroup
    onToggleExpansion: (groupId: number) => void
    onRemoveStop: (stopId: string) => void
    isMobile?: boolean
}

export function CollapsibleSection({
                                       group,
                                       onToggleExpansion,
                                       onRemoveStop,
                                       isMobile = false,
                                   }: CollapsibleSectionProps) {
    const {
        attributes,
        listeners,
        setNodeRef: setSortableRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: group.id,
        data: {
            type: "group",
            group,
        },
    })

    const { setNodeRef: setDroppableRef } = useDroppable({
        id: group.id,
        data: {
            type: "group",
            accepts: ["stop"],
        },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const setNodeRef = (node: HTMLElement | null) => {
        setSortableRef(node)
        setDroppableRef(node)
    }

    useEffect(() => {
        // fetch stops from the server or perform any side effects

    }, []);

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className="bg-gradient-to-br from-accent-50 to-accent-100/50 border-accent-200 shadow-sm hover:shadow-md transition-all duration-200 drop-zone animate-fade-in"
        >
            <CardHeader className="pb-3">
                <div className={`flex items-start gap-4 ${isMobile ? "flex-col" : "justify-between"}`}>
                    <div className="flex items-start gap-3 flex-1">
                        <button
                            className={`mt-1 text-surface-400 hover:text-surface-600 transition-colors ${isMobile ? "mobile-drag-handle" : "drag-handle"}`}
                            {...attributes}
                            {...listeners}
                        >
                            <GripVertical className="h-5 w-5" />
                        </button>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-surface-900 mb-2 leading-tight">{group.name}</h3>
                            <p className="text-sm text-surface-600 leading-relaxed">{group.description}</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 ${isMobile ? "w-full justify-between" : ""}`}>
                        <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm">
                            <Info className="w-4 h-4 mr-1" />
                            Details
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onToggleExpansion(group.id)}
                            className="p-2 hover:bg-accent-200/50"
                        >
                            {group.isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {group.isExpanded && (
                <CardContent className="pt-0 animate-slide-up">
                    <div className="bg-white rounded-lg p-4 border border-accent-200/50 shadow-inner">
                        <h4 className="text-base font-medium text-surface-900 mb-4 flex items-center">
                            <Layers className="w-4 h-4 mr-2 text-accent-600" />
                            Stops
                        </h4>
                        <SortableStopList stops={} groupId={group.id} onRemoveStop={onRemoveStop} isMobile={isMobile} />
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
