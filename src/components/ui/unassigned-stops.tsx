"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter, Package } from "lucide-react"
import type { Stop } from "@/types/types.ts"
import { UnassignedStopItem } from "./unassigned-stop-item"

interface UnassignedStopsProps {
    stops: Stop[]
    isMobile?: boolean
}

export function UnassignedStops({ stops, isMobile = false }: UnassignedStopsProps) {
    const { setNodeRef } = useDroppable({
        id: "unassigned",
        data: { type: "group", accepts: ["stop"] },
    })

    return (
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in">
            <CardHeader className="pb-3">
                <div className={`flex items-center gap-3 ${isMobile ? "flex-col" : "justify-between"}`}>
                    <CardTitle className="text-lg font-semibold text-surface-900 flex items-center">
                        <Package className="w-5 h-5 mr-2 text-brand-600" />
                        Unassigned Stops
                    </CardTitle>
                    <Button size="sm" variant="outline" className="shadow-sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter by Division
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <SortableContext items={stops.map((stop) => `un-${stop.id}`)} strategy={verticalListSortingStrategy}>
                    <div ref={setNodeRef} className="space-y-3 custom-scrollbar max-h-96 overflow-y-auto">
                        {stops.length === 0 ? (
                            <div className="text-center py-8 text-surface-500">
                                <Package className="w-8 h-8 mx-auto mb-2 text-surface-400" />
                                <p className="text-sm font-medium">No unassigned stops</p>
                                <p className="text-xs text-surface-400 mt-1">All items have been organized</p>
                            </div>
                        ) : (
                            stops.map((stop) => <UnassignedStopItem key={`un-${stop.id}`} stop={stop} isMobile={isMobile} />)
                        )}
                    </div>
                </SortableContext>
            </CardContent>
        </Card>
    )
}
