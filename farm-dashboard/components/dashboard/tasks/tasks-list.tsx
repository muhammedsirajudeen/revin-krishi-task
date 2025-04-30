"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PaginatedFarmsResponse } from "@/app/dashboard/farms/FarmComponent"
import { ToastStyles } from "@/lib/utils"
import { JoinedTask } from "@/app/types/farm.types"
import axiosInstance from "@/app/helper/axiosInstance"
import { EditTaskDialog } from "../edit-task-dialog"

interface TaskListProps {
  tasks: PaginatedFarmsResponse<JoinedTask>["results"]
  mutate: () => void
}

export function TasksList({ tasks: initialTasks, mutate }: TaskListProps) {
  const [open, setOpen] = useState(false)
  const [task, setTask] = useState<JoinedTask>()
  const [tasks, setTasks] = useState(initialTasks)
  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === "all" || task.priority === statusFilter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assigned_to.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.field.name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await axiosInstance.patch(`/task/status/${taskId}`, { status: newStatus })
      toast.success(`Task status updated to ${newStatus}`, ToastStyles.success)
      mutate()
    } catch (error) {
      console.log(error)
      toast.error('failed to update status', ToastStyles.error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axiosInstance.delete(`/task/delete/${taskId}`)
      toast.success("Task deleted successfully", ToastStyles.success)
      mutate()
    } catch (error) {
      console.log(error)
      toast.error('failed to delete tasks', ToastStyles.error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
      case "in-progress":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Low</Badge>
      case "medium":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Medium</Badge>
      case "high":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">High</Badge>
      case "urgent":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Urgent</Badge>
      default:
        return null
    }
  }
  const editHandler = (task: JoinedTask) => {
    setOpen(true)
    setTask(task)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Farm/Field</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>{new Date(task.deadline).toLocaleDateString()}</TableCell>
                  <TableCell>{task.assigned_to.email}</TableCell>
                  <TableCell>{`${task.farm.name} / ${task.field.name}`}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Button onClick={() => editHandler(task)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        {["pending", "in-progress", "completed"].map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(task.id, status)}
                            disabled={task.priority === status}
                          >
                            Mark as {status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <EditTaskDialog mutate={mutate} open={open} setOpen={setOpen} task={task} />
    </div>
  )
}
