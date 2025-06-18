import {useState} from 'react';
import {DndContext, closestCenter, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import type {DragEndEvent} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@radix-ui/react-accordion';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Separator} from '@/components/ui/separator';

interface Stop {
    id: number;
    name: string;
}

interface StopGroup {
    id: number;
    name: string;
    description: string;
    stopIds: number[];
    collapsed?: boolean;
}

const initialStops: Stop[] = [
    {id: 1, name: 'Stop 1'},
    {id: 2, name: 'Stop 2'},
    {id: 3, name: 'Stop 3'},
    {id: 4, name: 'Stop 4'},
];

const initialGroups: StopGroup[] = [
    {id: 1, name: 'Group A', description: 'First group', stopIds: [1]},
    {id: 2, name: 'Group B', description: 'Second group', stopIds: [2]},
    {id: 3, name: 'Group C', description: 'Third group', stopIds: []},
];

function SortableItem({id, data, children}: {id: string; data?: Record<string, unknown>; children: React.ReactNode}) {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id, data});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="border rounded-md p-2 bg-background shadow-sm flex justify-between items-center">
            {children}
        </div>
    );
}

export default function StopGroups() {
    const [groups, setGroups] = useState<StopGroup[]>(initialGroups);
    const [unassigned, setUnassigned] = useState<Stop[]>(initialStops.filter(s => !initialGroups.some(g => g.stopIds.includes(s.id))));
    const [filter, setFilter] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over) return;

        const activeData = active.data.current as {type: string; groupId?: number; stopId?: number};
        const overData = over.data.current as {type: string; groupId?: number; stopId?: number};

        if (activeData?.type === 'group' && overData?.type === 'group') {
            if (active.id !== over.id) {
                const oldIndex = groups.findIndex(g => `group-${g.id}` === active.id);
                const newIndex = groups.findIndex(g => `group-${g.id}` === over.id);
                setGroups(g => arrayMove(g, oldIndex, newIndex));
            }
        }

        if (activeData?.type === 'stop') {
            const fromGroupId = activeData.groupId;
            if (overData.type === 'unassigned') {
                if (fromGroupId) {
                    setGroups(gs => gs.map(g => g.id === fromGroupId ? {...g, stopIds: g.stopIds.filter(id => id !== activeData.stopId)} : g));
                }
                const movedStop = (fromGroupId ? groups.find(g => g.id === fromGroupId)?.stopIds.includes(activeData.stopId!) : true)
                    ? {id: activeData.stopId!, name: active.id.toString()}
                    : unassigned.find(s => s.id === activeData.stopId!);
                if (movedStop && !unassigned.some(s => s.id === movedStop.id)) {
                    setUnassigned(u => [...u, movedStop]);
                }
            } else if (overData.type === 'group') {
                const targetGroupId = overData.groupId!;
                if (fromGroupId === targetGroupId) return;
                setGroups(gs => gs.map(g => {
                    if (g.id === fromGroupId) {
                        return {...g, stopIds: g.stopIds.filter(id => id !== activeData.stopId)};
                    }
                    if (g.id === targetGroupId) {
                        return {...g, stopIds: [...g.stopIds, activeData.stopId!]};
                    }
                    return g;
                }));
                if (!fromGroupId) {
                    setUnassigned(u => u.filter(s => s.id !== activeData.stopId));
                }
            }
        }
    };

    const addGroup = () => {
        const id = Math.max(0, ...groups.map(g => g.id)) + 1;
        setGroups([...groups, {id, name: `Group ${id}`, description: 'New group', stopIds: []}]);
    };

    const addStop = () => {
        const id = Math.max(0, ...unassigned.map(s => s.id), ...groups.flatMap(g => g.stopIds)) + 1;
        setUnassigned([...unassigned, {id, name: `Stop ${id}`}]);
    };

    const collapseAll = () => {
        setGroups(gs => gs.map(g => ({...g, collapsed: true})));
    };

    return (
        <div className="container mx-auto py-4 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Stop Groups</h1>
                <div className="flex gap-2">
                    <Button onClick={addGroup}>Add StopGroup</Button>
                    <Button onClick={addStop} variant="secondary">Add Stop</Button>
                </div>
            </div>
            <Separator />
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Stop Groups</h2>
                        <Button variant="ghost" onClick={collapseAll}>Collapse All</Button>
                    </div>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={groups.map(g => `group-${g.id}`)} strategy={verticalListSortingStrategy}>
                            {groups.map(group => (
                                <SortableItem key={`group-${group.id}`} id={`group-${group.id}`} data={{type:'group',groupId:group.id}}>
                                    <div className="w-full">
                                        <Accordion type="single" collapsible value={group.collapsed ? undefined : String(group.id)} onValueChange={val => setGroups(gs => gs.map(g => g.id === group.id ? {...g, collapsed: !val} : g))}>
                                            <AccordionItem value={String(group.id)}>
                                                <AccordionTrigger className="flex justify-between w-full py-2">{group.name}</AccordionTrigger>
                                                <AccordionContent className="pb-4">
                                                    <Card className="bg-secondary/20">
                                                        <CardHeader className="pb-2">
                                                            <CardTitle>{group.name}</CardTitle>
                                                            <CardDescription>{group.description}</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="space-y-2">
                                                            <SortableContext items={group.stopIds.map(id => `stop-${id}`)} strategy={verticalListSortingStrategy}>
                                                                {group.stopIds.map(id => {
                                                                    const stop = [...unassigned, ...initialStops].find(s => s.id === id) || {id, name: `Stop ${id}`};
                                                                    return (
                                                                        <SortableItem key={`stop-${stop.id}`} id={`stop-${stop.id}`}
              data={{type:'stop',stopId:stop.id,groupId:group.id}}>
                                                                            <span>{stop.name}</span>
                                                                            <Button size="sm" variant="ghost" onClick={() => {
                                                                                setGroups(gs => gs.map(g => g.id === group.id ? {...g, stopIds: g.stopIds.filter(sid => sid !== stop.id)} : g));
                                                                                setUnassigned(u => [...u, stop]);
                                                                            }}>Remove</Button>
                                                                        </SortableItem>
                                                                    );
                                                                })}
                                                            </SortableContext>
                                                        </CardContent>
                                                    </Card>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                </SortableItem>
                            ))}
                        </SortableContext>
                        <div data-id="unassigned" data-type="unassigned" className="hidden" />
                    </DndContext>
                </div>
                <div className="md:w-64 space-y-2">
                    <h2 className="text-xl font-semibold">Unassigned Stops</h2>
                    <Input placeholder="Filter" value={filter} onChange={e => setFilter(e.target.value)} />
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={unassigned.filter(s => s.name.toLowerCase().includes(filter.toLowerCase())).map(s => `stop-${s.id}`)} strategy={verticalListSortingStrategy}>
                            {unassigned.filter(s => s.name.toLowerCase().includes(filter.toLowerCase())).map(stop => (
                                <SortableItem key={`stop-${stop.id}`} id={`stop-${stop.id}`} data={{type:'stop',stopId:stop.id}}>
                                    <span>{stop.name}</span>
                                </SortableItem>
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => window.location.reload()}>Cancel</Button>
                <Button onClick={() => console.log(groups, unassigned)}>Save Changes</Button>
            </div>
        </div>
    );
}

