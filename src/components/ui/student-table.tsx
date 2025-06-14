import {useMemo, useState} from "react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Check, Eye, Loader2, Trash2, Undo, X} from "lucide-react"
import {Skeleton} from "@/components/ui/skeleton"
import type {Student, StudentAssignment} from "@/types/types.ts";

type Status = 0 | 1 | 2

const getStatusBadge = (status: Status) => {
    switch (status) {
        case 0:
            return <Badge variant="secondary">Pending</Badge>
        case 1:
            return <Badge variant="default">Accepted</Badge>
        case 2:
            return <Badge variant="destructive">Rejected</Badge>
        default:
            return <Badge variant="outline">Unknown</Badge>
    }
}

interface AssignmentActionsProps {
    assignment: StudentAssignment
    onUpdate: (stopId: number, newStatus: Status) => void
    onDelete: (stopId: number) => void
}

const AssignmentActions = ({ assignment, onUpdate, onDelete }: AssignmentActionsProps) => {
    const [loading, setLoading] = useState<string | null>(null)

    const handleAction = async (action: string, newStatus?: Status) => {
        setLoading(action)
        try {
            if (action === "delete") {
                onDelete(assignment.stopId)
            } else if (newStatus !== undefined) {
                onUpdate(assignment.stopId, newStatus)
            }
        } catch (error) {
            console.error("Action failed:", error)
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="flex items-center flex-wrap gap-4">
            {assignment.status === 0 && (
                <>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction("accept", 1)}
                        disabled={loading !== null}
                        className="text-green-600 hover:text-green-700"
                    >
                        {loading === "accept" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                        Accept
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction("reject", 2)}
                        disabled={loading !== null}
                        className="text-red-600 hover:text-red-700"
                    >
                        {loading === "reject" ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                        Reject
                    </Button>
                </>
            )}
            {assignment.status === 1 && (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction("undo-accept", 0)}
                    disabled={loading !== null}
                    className="text-orange-600 hover:text-orange-700"
                >
                    {loading === "undo-accept" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Undo className="h-3 w-3" />}
                    Undo Accept
                </Button>
            )}
            {assignment.status === 2 && (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction("undo-reject", 0)}
                    disabled={loading !== null}
                    className="text-blue-600 hover:text-blue-700"
                >
                    {loading === "undo-reject" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Undo className="h-3 w-3" />}
                    Undo Reject
                </Button>
            )}
            <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction("delete")}
                disabled={loading !== null}
                className="text-red-600 hover:text-red-700"
            >
                {loading === "delete" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                Delete
            </Button>
        </div>
    )
}

interface MultipleAssignmentsDialogProps {
    student: Student
    onUpdate: (studentId: string, stopId: number, newStatus: Status) => void
    onDelete: (studentId: string, stopId: number) => void
}

const MultipleAssignmentsDialog = ({ student, onUpdate, onDelete }: MultipleAssignmentsDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:min-w-3/4 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Assignment Details - {student.firstName} {student.lastName}
                    </DialogTitle>
                    <DialogDescription>Manage all assignments for this student</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    {student.studentAssignments.map((assignment, index) => (
                        <Card key={index} className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium">{assignment.stopName}</h4>
                                        {getStatusBadge(assignment.status)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Stop ID: {assignment.stopId}</p>
                                </div>
                                <div className={ "hidden sm:flex sm:items-center sm:gap-2"}>
                                <AssignmentActions
                                    assignment={assignment}
                                    onUpdate={(stopId, newStatus) => onUpdate(student.edufsUsername, stopId, newStatus)}
                                    onDelete={(stopId) => onDelete(student.edufsUsername, stopId)}
                                />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

const TableSkeleton = () => {
    return (
        <div className="rounded-md border">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[120px]">Username</TableHead>
                            <TableHead className="min-w-[150px]">Name</TableHead>
                            <TableHead className="min-w-[80px]">Class</TableHead>
                            <TableHead className="min-w-[120px]">Department</TableHead>
                            <TableHead className="min-w-[200px]">Assignment Details</TableHead>
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
        </div>
    )
}

interface StudentTableProps {
    students: Student[]
    nameFilter: string
    classFilter: string
    departmentFilter: string
    isLoading?: boolean
    showAssignmentDetails?: boolean
    onUpdateAssignment?: (studentId: string, stopId: number, newStatus: Status) => void
    onDeleteAssignment?: (studentId: string, stopId: number) => void
}

export const StudentTable = ({
                          students,
                          nameFilter,
                          classFilter,
                          departmentFilter,
                          isLoading = false,
                          showAssignmentDetails = false,
                          onUpdateAssignment,
                          onDeleteAssignment,
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
            <div className="hidden xl:block rounded-md border">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[120px]">Username</TableHead>
                                <TableHead className="min-w-[150px]">Name</TableHead>
                                <TableHead className="min-w-[80px]">Class</TableHead>
                                <TableHead className="min-w-[120px]">Department</TableHead>
                                {showAssignmentDetails && <TableHead className="min-w-[300px]">Assignment Details</TableHead>}
                                {!showAssignmentDetails && students.some((s) => s.studentAssignments.length > 1) && (
                                    <TableHead className="min-w-[150px]">Actions</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={showAssignmentDetails ? 5 : 5} className="text-center text-muted-foreground">
                                        No students found matching the filters
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredStudents.map((student) => (
                                    <TableRow key={student.edufsUsername}>
                                        <TableCell className="font-mono text-sm">{student.edufsUsername}</TableCell>
                                        <TableCell className="font-medium">
                                            {student.firstName} {student.lastName}
                                        </TableCell>
                                        <TableCell>{student.studentClass}</TableCell>
                                        <TableCell>{student.department}</TableCell>
                                        {showAssignmentDetails && (
                                            <TableCell>
                                                {student.studentAssignments.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {student.studentAssignments.map((assignment, index) => (
                                                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-medium">{assignment.stopName}</span>
                                                                    {getStatusBadge(assignment.status)}
                                                                </div>
                                                                {onUpdateAssignment && onDeleteAssignment && (
                                                                    <AssignmentActions
                                                                        assignment={assignment}
                                                                        onUpdate={(stopId, newStatus) =>
                                                                            onUpdateAssignment(student.edufsUsername, stopId, newStatus)
                                                                        }
                                                                        onDelete={(stopId) => onDeleteAssignment(student.edufsUsername, stopId)}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">No assignments</span>
                                                )}
                                            </TableCell>
                                        )}
                                        {!showAssignmentDetails &&
                                            student.studentAssignments.length > 1 &&
                                            onUpdateAssignment &&
                                            onDeleteAssignment && (
                                                <TableCell>
                                                    <MultipleAssignmentsDialog
                                                        student={student}
                                                        onUpdate={onUpdateAssignment}
                                                        onDelete={onDeleteAssignment}
                                                    />
                                                </TableCell>
                                            )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="xl:hidden space-y-4">
                {filteredStudents.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                            No students found matching the filters
                        </CardContent>
                    </Card>
                ) : (
                    filteredStudents.map((student) => (
                        <Card key={student.edufsUsername} className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium text-lg">
                                            {student.firstName} {student.lastName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-mono">{student.edufsUsername}</p>
                                    </div>
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

                                {showAssignmentDetails && student.studentAssignments.length > 0 && (
                                    <div>
                                        <span className="font-medium text-muted-foreground text-sm">Assignments:</span>
                                        <div className="mt-2 space-y-3">
                                            {student.studentAssignments.map((assignment, index) => (
                                                <div key={index} className="p-3 bg-muted rounded-md space-y-2">
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium mr-4">{assignment.stopName}</span>
                                                        {getStatusBadge(assignment.status)}
                                                    </div>
                                                    <div className={"flex items-center "}>
                                                    {onUpdateAssignment && onDeleteAssignment && (
                                                        <AssignmentActions
                                                            assignment={assignment}
                                                            onUpdate={(stopId, newStatus) =>
                                                                onUpdateAssignment(student.edufsUsername, stopId, newStatus)
                                                            }
                                                            onDelete={(stopId) => onDeleteAssignment(student.edufsUsername, stopId)}
                                                        />
                                                    )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!showAssignmentDetails &&
                                    student.studentAssignments.length > 1 &&
                                    onUpdateAssignment &&
                                    onDeleteAssignment && (
                                        <div className="pt-2">
                                            <MultipleAssignmentsDialog
                                                student={student}
                                                onUpdate={onUpdateAssignment}
                                                onDelete={onDeleteAssignment}
                                            />
                                        </div>
                                    )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </>
    )
}