"use client"

import { CheckCircle2, Clock, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { DashboardResponse } from "@/app/dashboard/page"

const tasks = [
  {
    id: 1,
    title: "Irrigation check for Field A",
    status: "pending",
    dueDate: "2024-05-10",
    assignedTo: "John Doe",
  },
  {
    id: 2,
    title: "Apply fertilizer to corn crops",
    status: "in-progress",
    dueDate: "2024-05-08",
    assignedTo: "Sarah Smith",
  },
  {
    id: 3,
    title: "Harvest wheat in Field C",
    status: "pending",
    dueDate: "2024-05-15",
    assignedTo: "Mike Johnson",
  },
  {
    id: 4,
    title: "Repair tractor #3",
    status: "completed",
    dueDate: "2024-05-05",
    assignedTo: "Robert Brown",
  },
]

export function RecentTasks({ recent_task }: DashboardResponse) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="mr-1 h-3 w-3 animate-spin" />
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      default:
        return null
    }
  }

  const handleComplete = (id: number) => {
    toast.success(`Task #${id} marked as completed`)
  }

  const handleCancel = (id: number) => {
    toast.error(`Task #${id} cancelled`)
  }

  return (
    <div className="space-y-4">
      {recent_task.map((task) => (
        <Card key={task.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  {/* <p className="text-sm text-muted-foreground">Assigned to: {task.assigned_to.email}</p> */}
                </div>
                {getStatusBadge(task.status)}
              </div>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
              </div>
              {/* {task.status !== "completed" && ( */}
              {/* <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="w-full" onClick={() => handleComplete(task.id)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Complete
                  </Button>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => handleCancel(task.id)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )} */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
