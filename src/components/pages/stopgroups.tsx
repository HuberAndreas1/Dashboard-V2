"use client"

import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    KeyboardSensor,
    closestCenter,
} from "@dnd-kit/core"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { useEffect, useState } from "react"
import { StopGroupHeader } from "@/components/ui/stopgroups-header"
import { CollapsibleSection } from "@/components/ui/collapsible-section"
import { UnassignedStops } from "@/components/ui/unassigned-stops"
import { DragItem } from "@/components/ui/drag-item"
import type { Stop, StopGroup } from "@/types/types.ts"
import { useIsMobile } from "@/hooks/use-mobile.ts"

type StopGroupWithStops = StopGroup & { stops: Stop[]; isExpanded: boolean }

export default function StopGroupsPage() {
    const isMobile = useIsMobile()
    const [stopGroups, setStopGroups] = useState<StopGroupWithStops[]>([])
    const [unassignedStops, setUnassignedStops] = useState<Stop[]>([])
    const [activeItem, setActiveItem] = useState<null | (Stop & { type: "stop" }) | (StopGroupWithStops & { type: "group" })>(null)
    const [showPrivateGroups, setShowPrivateGroups] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // helper to locate container for a stop
    const findContainer = (stopId: number): number | "unassigned" | undefined => {
        if (unassignedStops.find((s) => s.id === stopId)) return "unassigned"
        const group = stopGroups.find((g) => g.stops.some((s) => s.id === stopId))
        return group ? group.id : undefined
    }

    const getStopById = (id: number): Stop | undefined => {
        return (
            unassignedStops.find((s) => s.id === id) ||
            stopGroups.flatMap((g) => g.stops).find((s) => s.id === id)
        )
    }

    useEffect(() => {
        // simulate API call
        const timeout = setTimeout(() => {
            const fetchedStops: Stop[] = [
                { id: 1, name: "Welcome", roomNr: "A1", description: "Welcome desk", divisionIds: [], stopGroupIds: [1], orders: [] },
                { id: 2, name: "Library", roomNr: "B1", description: "Library tour", divisionIds: [], stopGroupIds: [1], orders: [] },
                { id: 3, name: "Workshop", roomNr: "C1", description: "Hands on", divisionIds: [], stopGroupIds: [], orders: [] },
                { id: 4, name: "Cafeteria", roomNr: "D1", description: "Snacks", divisionIds: [], stopGroupIds: [], orders: [] },
            ]

            const fetchedGroups: StopGroup[] = [
                { id: 1, name: "Information", description: "General information", isPublic: true, stopIds: [1, 2] },
                { id: 2, name: "Tours", description: "Guided tours", isPublic: false, stopIds: [] },
            ]

            const groupsWithStops: StopGroupWithStops[] = fetchedGroups.map((g) => ({
                ...g,
                stops: fetchedStops.filter((s) => g.stopIds.includes(s.id)),
                isExpanded: true,
            }))

            const assignedIds = new Set(fetchedGroups.flatMap((g) => g.stopIds))
            const unassigned = fetchedStops.filter((s) => !assignedIds.has(s.id))

            setStopGroups(groupsWithStops)
            setUnassignedStops(unassigned)
        }, 500)

        return () => clearTimeout(timeout)
    }, [])

    const handleDragStart = (event: DragStartEvent) => {
        const data = event.active.data.current
        if (!data) return
        if (data.type === "group") {
            setActiveItem({ ...(data.group as StopGroupWithStops), type: "group" })
        }
        if (data.type === "stop") {
            setActiveItem({ ...(data.stop as Stop), type: "stop" })
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveItem(null)
        if (!over) return

        const activeData = active.data.current
        const overData = over.data.current
        if (!activeData) return

        // reorder groups
        if (activeData.type === "group" && overData?.type === "group") {
            const oldIndex = stopGroups.findIndex((g) => g.id === active.id)
            const newIndex = stopGroups.findIndex((g) => g.id === over.id)
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                setStopGroups(arrayMove(stopGroups, oldIndex, newIndex))
            }
            return
        }

        // moving stops
        if (activeData.type === "stop") {
            const stopId = active.id as number
            const source = findContainer(stopId)
            if (!source) return

            let destination: number | "unassigned" | undefined
            if (overData?.type === "group") {
                destination = over.id === "unassigned" ? "unassigned" : Number(over.id)
            } else if (overData?.type === "stop") {
                destination = findContainer(over.id as number)
            } else {
                return
            }

            if (!destination) return

            if (destination === source) {
                // reorder within same container
                if (source === "unassigned") {
                    const oldIndex = unassignedStops.findIndex((s) => s.id === stopId)
                    const newIndex = unassignedStops.findIndex((s) => s.id === (over.id as number))
                    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                        setUnassignedStops(arrayMove(unassignedStops, oldIndex, newIndex))
                    }
                } else {
                    const groupIndex = stopGroups.findIndex((g) => g.id === source)
                    if (groupIndex !== -1) {
                        const stops = stopGroups[groupIndex].stops
                        const oldIndex = stops.findIndex((s) => s.id === stopId)
                        const newIndex = stops.findIndex((s) => s.id === (over.id as number))
                        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                            const newStops = arrayMove(stops, oldIndex, newIndex)
                            setStopGroups((prev) => prev.map((g, idx) => (idx === groupIndex ? { ...g, stops: newStops } : g)))
                        }
                    }
                }
            } else {
                const moved = getStopById(stopId)
                if (!moved) return

                if (source === "unassigned") {
                    setUnassignedStops((prev) => prev.filter((s) => s.id !== stopId))
                } else {
                    setStopGroups((prev) =>
                        prev.map((g) =>
                            g.id === source ? { ...g, stops: g.stops.filter((s) => s.id !== stopId) } : g
                        )
                    )
                }

                if (destination === "unassigned") {
                    setUnassignedStops((prev) => [...prev, moved])
                } else {
                    setStopGroups((prev) =>
                        prev.map((g) => (g.id === destination ? { ...g, stops: [...g.stops, moved] } : g))
                    )
                }
            }
        }
    }

    const collapseAll = () => {
        setStopGroups((prev) => prev.map((g) => ({ ...g, isExpanded: false })))
    }

    return (
        <div className="container mx-auto mt-8 space-y-4">
            <StopGroupHeader
                onCollapseAll={collapseAll}
                showPrivateGroups={showPrivateGroups}
                onTogglePrivateGroups={(checked) => setShowPrivateGroups(!!checked)}
            />

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-3">
                        <SortableContext items={stopGroups.map((g) => g.id)} strategy={verticalListSortingStrategy}>
                            {stopGroups
                                .filter((g) => showPrivateGroups || g.isPublic)
                                .map((group) => (
                                    <CollapsibleSection
                                        key={group.id}
                                        group={group}
                                        onToggleExpansion={(id) =>
                                            setStopGroups((prev) =>
                                                prev.map((g) => (g.id === id ? { ...g, isExpanded: !g.isExpanded } : g))
                                            )
                                        }
                                        onRemoveStop={(id) =>
                                            setStopGroups((prev) =>
                                                prev.map((g) => ({ ...g, stops: g.stops.filter((s) => s.id !== id) }))
                                            )
                                        }
                                        isMobile={isMobile}
                                    />
                                ))}
                        </SortableContext>
                    </div>
                    <div>
                        <UnassignedStops stops={unassignedStops} isMobile={isMobile} />
                    </div>
                </div>

                <DragOverlay>{activeItem ? <DragItem item={activeItem} /> : null}</DragOverlay>
            </DndContext>
        </div>
    )
}

