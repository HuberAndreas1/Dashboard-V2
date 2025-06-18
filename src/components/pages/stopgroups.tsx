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

type StopInstance = Stop & { uid: string }
type StopGroupWithStops = StopGroup & { stops: StopInstance[]; isExpanded: boolean }

export default function StopGroupsPage() {
    const isMobile = useIsMobile()
    const [stopGroups, setStopGroups] = useState<StopGroupWithStops[]>([])
    const [unassignedStops, setUnassignedStops] = useState<Stop[]>([])
    const [activeItem, setActiveItem] = useState<null | (StopInstance & { type: "stop" }) | (StopGroupWithStops & { type: "group" })>(null)
    const [showPrivateGroups, setShowPrivateGroups] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // helper to locate container for a stop
    const findContainer = (uid: string): number | "unassigned" | undefined => {
        if (uid.startsWith("un-")) return "unassigned"
        const group = stopGroups.find((g) => g.stops.some((s) => s.uid === uid))
        return group ? group.id : undefined
    }

    const getStopInstance = (uid: string): StopInstance | undefined => {
        for (const g of stopGroups) {
            const item = g.stops.find((s) => s.uid === uid)
            if (item) return item
        }
        return undefined
    }

    const getStopById = (id: number): Stop | undefined => {
        return unassignedStops.find((s) => s.id === id)
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
                stops: fetchedStops
                    .filter((s) => g.stopIds.includes(s.id))
                    .map((s) => ({ ...s, uid: crypto.randomUUID() })),
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
            setActiveItem({ ...(data.stop as StopInstance), type: "stop" })
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
            const uid = String(active.id)
            const source = findContainer(uid)
            if (!source) return

            let destination: number | "unassigned" | undefined
            if (overData?.type === "group") {
                destination = over.id === "unassigned" ? "unassigned" : Number(over.id)
            } else if (overData?.type === "stop") {
                destination = findContainer(String(over.id))
            } else {
                return
            }

            if (!destination) return

            if (destination === source) {
                if (source === "unassigned") {
                    const oldIndex = unassignedStops.findIndex((s) => `un-${s.id}` === uid)
                    const newIndex = unassignedStops.findIndex((s) => `un-${s.id}` === String(over.id))
                    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                        setUnassignedStops(arrayMove(unassignedStops, oldIndex, newIndex))
                    }
                } else {
                    const groupIndex = stopGroups.findIndex((g) => g.id === source)
                    if (groupIndex !== -1) {
                        const stops = stopGroups[groupIndex].stops
                        const oldIndex = stops.findIndex((s) => s.uid === uid)
                        const newIndex = stops.findIndex((s) => s.uid === String(over.id))
                        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                            const newStops = arrayMove(stops, oldIndex, newIndex)
                            setStopGroups((prev) => prev.map((g, idx) => (idx === groupIndex ? { ...g, stops: newStops } : g)))
                        }
                    }
                }
            } else {
                if (destination === "unassigned") {
                    // remove from group
                    const groupIndex = stopGroups.findIndex((g) => g.id === source)
                    if (groupIndex !== -1) {
                        setStopGroups((prev) =>
                            prev.map((g, idx) =>
                                idx === groupIndex ? { ...g, stops: g.stops.filter((s) => s.uid !== uid) } : g
                            )
                        )
                    }
                } else {
                    // add copy to destination group
                    const original = uid.startsWith("un-") ? getStopById(Number(uid.slice(3))) : getStopInstance(uid)
                    if (!original) return
                    const baseStop: Stop = 'uid' in original ? { ...original } as Stop : original
                    const newItem: StopInstance = { ...baseStop, uid: crypto.randomUUID() }
                    setStopGroups((prev) =>
                        prev.map((g) => (g.id === destination ? { ...g, stops: [...g.stops, newItem] } : g))
                    )
                }
            }
        }
    }

    const collapseAll = () => {
        setStopGroups((prev) => prev.map((g) => ({ ...g, isExpanded: false })))
    }

    return (
        <div className="container mx-auto mt-8 space-y-4 pb-8">
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
                                        onRemoveStop={(uid) =>
                                            setStopGroups((prev) =>
                                                prev.map((g) => ({ ...g, stops: g.stops.filter((s) => s.uid !== uid) }))
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

