import {useEffect, useMemo, useState} from "react";
import type {Student} from "@/types/types.ts";
import {getFetchUrl} from "@/utils/getFetchUrl.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Search, User, UserCheck, Users} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {StudentTable} from "@/components/ui/student-table.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
export default function Students() {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [nameFilter, setNameFilter] = useState("")
    const [classFilter, setClassFilter] = useState("")
    const [departmentFilter, setDepartmentFilter] = useState("")

    useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await fetch(getFetchUrl('/api/students'));
                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }
                const data: Student[] = await response.json() as Student[];
                setStudents(data);
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStudents();
    }, [])

    const categorizedStudents = useMemo(() => {
        const noAssignments = students.filter((s) => s.studentAssignments.length === 0)
        const oneAssignment = students.filter((s) => s.studentAssignments.length === 1)
        const multipleAssignments = students.filter((s) => s.studentAssignments.length > 1)

        return { noAssignments, oneAssignment, multipleAssignments }
    }, [students])

    if (isLoading) {
        return <div className="text-center py-6">Loading students...</div>
    }

    return (
        <div className="container mx-auto py-4 px-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold">Student Assignment Management</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Manage and view student assignments organized by assignment count
                </p>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                        Filters
                    </CardTitle>
                    <CardDescription className="text-sm">Filter students by name, class, or department</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                placeholder="Search by first or last name..."
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                className="text-base sm:text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Class</label>
                            <Input
                                placeholder="Filter by class..."
                                value={classFilter}
                                onChange={(e) => setClassFilter(e.target.value)}
                                className="text-base sm:text-sm"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                            <label className="text-sm font-medium">Department</label>
                            <Input
                                placeholder="Filter by department..."
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="text-base sm:text-sm"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabbed Tables */}
            <Tabs defaultValue="no-assignments" className="space-y-4">
                <div className="w-full">
                    <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full gap-2 sm:gap-0 h-auto sm:h-10 p-1">
                        <TabsTrigger
                            value="no-assignments"
                            className="flex items-center justify-start gap-2 text-sm py-3 sm:py-2 w-full"
                        >
                            <Users className="h-4 w-4" />
                            <span>No Assignments</span>
                            {isLoading ? (
                                <Skeleton className="h-4 w-6 rounded ml-auto" />
                            ) : (
                                <span className="ml-auto">({categorizedStudents.noAssignments.length})</span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="one-assignment"
                            className="flex items-center justify-start gap-2 text-sm py-3 sm:py-2 w-full"
                        >
                            <User className="h-4 w-4" />
                            <span>One Assignment</span>
                            {isLoading ? (
                                <Skeleton className="h-4 w-6 rounded ml-auto" />
                            ) : (
                                <span className="ml-auto">({categorizedStudents.oneAssignment.length})</span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="multiple-assignments"
                            className="flex items-center justify-start gap-2 text-sm py-3 sm:py-2 w-full"
                        >
                            <UserCheck className="h-4 w-4" />
                            <span>Multiple Assignments</span>
                            {isLoading ? (
                                <Skeleton className="h-4 w-6 rounded ml-auto" />
                            ) : (
                                <span className="ml-auto">({categorizedStudents.multipleAssignments.length})</span>
                            )}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="no-assignments" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg sm:text-xl">Students with No Assignments</CardTitle>
                            <CardDescription className="text-sm">Students who have not been assigned to any stops</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StudentTable
                                students={categorizedStudents.noAssignments}
                                nameFilter={nameFilter}
                                classFilter={classFilter}
                                departmentFilter={departmentFilter}
                                isLoading={isLoading}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="one-assignment" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg sm:text-xl">Students with One Assignment</CardTitle>
                            <CardDescription className="text-sm">Students who have been assigned to exactly one stop</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StudentTable
                                students={categorizedStudents.oneAssignment}
                                nameFilter={nameFilter}
                                classFilter={classFilter}
                                departmentFilter={departmentFilter}
                                isLoading={isLoading}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="multiple-assignments" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg sm:text-xl">Students with Multiple Assignments</CardTitle>
                            <CardDescription className="text-sm">Students who have been assigned to multiple stops</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StudentTable
                                students={categorizedStudents.multipleAssignments}
                                nameFilter={nameFilter}
                                classFilter={classFilter}
                                departmentFilter={departmentFilter}
                                isLoading={isLoading}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}