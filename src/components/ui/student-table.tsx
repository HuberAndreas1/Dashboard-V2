"use client"

import {useMemo} from "react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Card, CardContent} from "./card";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

type Status = 0 | 1 | 2

export type StudentAssignment = {
    studentId: string
    stopId: number
    stopName: string
    status: Status
}

export type Student = {
    edufsUsername: string
    firstName: string
    lastName: string
    studentClass: string
    department: string
    studentAssignments: StudentAssignment[]
}

const TableSkeleton = () => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Assignments</TableHead>
                        <TableHead>Assignment Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-12" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-6 w-8 rounded-full" />
                            </TableCell>
                            <TableCell>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

const getStatusBadge = (status: Status) => {
    switch (status) {
        case 0:
            return <Badge variant="secondary">Pending</Badge>
        case 1:
            return <Badge variant="default">Accepted</Badge>
        case 2:
            return <Badge variant="destructive">Declined</Badge>
        default:
            return <Badge variant="outline">Unknown</Badge>
    }
}

interface StudentTableProps {
    students: Student[]
    nameFilter: string
    classFilter: string
    departmentFilter: string,
    isLoading?: boolean
}

export const StudentTable = ({
                          students,
                          nameFilter,
                          classFilter,
                          departmentFilter,
                          isLoading = false,
                      }: StudentTableProps) => {
    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
            const matchesName = fullName.includes(nameFilter.toLowerCase())
            const matchesClass = student.studentClass.toLowerCase().includes(classFilter.toLowerCase())
            const matchesDepartment = student.department.toLowerCase().includes(departmentFilter.toLowerCase())

            return matchesName && matchesClass && matchesDepartment
        })
    }, [students, nameFilter, classFilter, departmentFilter])

    if (isLoading) {
        return <TableSkeleton />
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block rounded-md border">
                <div>
                    <ScrollArea className="h-[400px]">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead className="min-w-[120px]">Username</TableHead>
                                <TableHead className="min-w-[150px]">Name</TableHead>
                                <TableHead className="min-w-[80px]">Class</TableHead>
                                <TableHead className="min-w-[120px]">Department</TableHead>
                                <TableHead className="min-w-[100px]">Assignments</TableHead>
                                <TableHead className="min-w-[200px]">Assignment Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No students found matching the filters
                                    </TableCell>
                                </TableRow>
                            ) : (
                                    filteredStudents.map((student) => (
                                    <TableRow key={student.edufsUsername}>
                                        <TableCell colSpan={1} className="font-mono text-sm">{student.edufsUsername}</TableCell>
                                        <TableCell colSpan={1} className="font-medium">
                                            {student.firstName} {student.lastName}
                                        </TableCell>
                                        <TableCell colSpan={1}>{student.studentClass}</TableCell>
                                        <TableCell>{student.department}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{student.studentAssignments.length}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {student.studentAssignments.length > 0 ? (
                                                <div className="space-y-1">
                                                    {student.studentAssignments.map((assignment, index) => (
                                                        <div key={index} className="flex items-center gap-2 text-sm">
                                                            <span className="text-muted-foreground">{assignment.stopName}</span>
                                                            {getStatusBadge(assignment.status)}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">No assignments</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    </ScrollArea>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {filteredStudents.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                            No students found matching the filters
                        </CardContent>
                    </Card>
                ) : (
                    <ScrollArea className="h-[400px]">
                        {filteredStudents.map((student) => (
                        <Card key={student.edufsUsername} className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium text-lg">
                                            {student.firstName} {student.lastName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-mono">{student.edufsUsername}</p>
                                    </div>
                                    <Badge variant="outline" className="ml-2">
                                        {student.studentAssignments.length} assignments
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-muted-foreground">Class:</span>
                                        <p>{student.studentClass}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-muted-foreground">Department:</span>
                                        <p>{student.department}</p>
                                    </div>
                                </div>

                                {student.studentAssignments.length > 0 && (
                                    <div>
                                        <span className="font-medium text-muted-foreground text-sm">Assignments:</span>
                                        <div className="mt-2 space-y-2">
                                            {student.studentAssignments.map((assignment, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                                    <span className="text-sm">{assignment.stopName}</span>
                                                    {getStatusBadge(assignment.status)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                    </ScrollArea>
                )}
            </div>
        </>
    )
}