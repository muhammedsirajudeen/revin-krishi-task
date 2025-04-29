"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Calendar, Edit, MoreHorizontal, Trash, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data
const initialTasks = [
  {
    id: 1,
    title: "Irrigation check for Field A",
    status: "pending",
    priority: "medium",
    dueDate: "2024-05-10",
    assignedTo: "John Doe",
    farm: "North Farm",
    field: "Field A",
  },
  {
    id: 2,
    title: "Apply fertilizer to corn crops",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-05-08",
    assignedTo: "Sarah Smith",
    farm: "South Farm",
    field: "Field B",
  },
  {
    id: 3,
    title: "Harvest wheat in Field C",
    status: "pending",
    priority: "high",
    dueDate: "2024-05-15",
    assignedTo: "Mike Johnson",
    farm: "East Farm",
    field: "Field C",
  },
  {
    id: 4,
    title: "Repair tractor #3",
    status: "completed",
    priority: "urgent",
    dueDate: "2024-05-05",
    assignedTo: "Robert Brown",
    farm: "West Farm",
    field: "Workshop",
  },
  {
    id: 5,
    title: "Pest control in Field D",
    status: "in-progress",
    priority: "medium",
    dueDate: "2024-05-12",
    assignedTo: "Sarah Smith",
    farm: "North Farm",
    field: "Field D",
  },
]

export function TasksKanban() {
  const [tasks, setTasks] = useState(initialTasks)

  const handleStatusChange = (taskId: number, newStatus: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
    toast.success(`Task status updated to ${newStatus}`)
  }

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    toast.success("Task deleted successfully")
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Low
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Medium
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            High
          </Badge>
        )
      case "urgent":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Urgent
          </Badge>
        )
      default:
        return null
    }
  }

  const pendingTasks = tasks.filter((task) => task.status === "pending")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="space-y-4">
        <div className="rounded-lg bg-yellow-50 p-3">
          <h3 className="font-semibold text-yellow-700">Pending</h3>
        </div>
        {pendingTasks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center p-6">
              <p className="text-center text-sm text-muted-foreground">No pending tasks</p>
            </CardContent>
          </Card>
        ) : (
          pendingTasks.map((task) => (
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} />
          ))
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-lg bg-blue-50 p-3">
          <h3 className="font-semibold text-blue-700">In Progress</h3>
        </div>
        {inProgressTasks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center p-6">
              <p className="text-center text-sm text-muted-foreground">No tasks in progress</p>
            </CardContent>
          </Card>
        ) : (
          inProgressTasks.map((task) => (
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} />
          ))
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-lg bg-green-50 p-3">
          <h3 className="font-semibold text-green-700">Completed</h3>
        </div>
        {completedTasks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center p-6">
              <p className="text-center text-sm text-muted-foreground">No completed tasks</p>
            </CardContent>
          </Card>
        ) : (
          completedTasks.map((task) => (
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} />
          ))
        )}
      </div>
    </div>
  )
}

interface TaskCardProps {
  task: {
    id: number
    title: string
    status: string
    priority: string
    dueDate: string
    assignedTo: string
    farm: string
    field: string
  }
  onStatusChange: (taskId: number, newStatus: string) => void
  onDelete: (taskId: number) => void
}

function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Low
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Medium
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            High
          </Badge>
        )
      case "urgent":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Urgent
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{task.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mt-1 h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/tasks/${task.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, "pending")} disabled={task.status === "pending"}>
                Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(task.id, "in-progress")}
                disabled={task.status === "in-progress"}
              >
                Mark as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(task.id, "completed")}
                disabled={task.status === "completed"}
              >
                Mark as Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-2 pt-2">
          {getPriorityBadge(task.priority)}
          <Badge variant="outline" className="bg-muted">
            {task.farm} / {task.field}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Calendar className="mr-1 h-4 w-4" />
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <User className="mr-1 h-4 w-4" />
          {task.assignedTo}
        </div>
      </CardFooter>
    </Card>
  )
}
