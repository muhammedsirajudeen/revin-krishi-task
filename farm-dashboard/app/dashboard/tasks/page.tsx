'use client'
import Link from "next/link"
import { Plus } from "lucide-react"
import { useState } from "react"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TasksList } from "@/components/dashboard/tasks/tasks-list"
import { TasksKanban } from "@/components/dashboard/tasks/tasks-kanban"
import { PaginatedFarmsResponse } from "../farms/FarmComponent"
import { fetcher } from "@/lib/utils"
import { JoinedTask } from "@/app/types/farm.types"

export default function TasksPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useSWR<PaginatedFarmsResponse<JoinedTask>>(
    `/task/list?page=${page}`,
    fetcher
  )

  const totalPages = data?.count ? Math.ceil(data.count / data.results.length) : 1

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Link href="/dashboard/tasks/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>Create, assign, and track tasks for your farm operations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="kanban">Kanban View</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <TasksList tasks={data?.results ?? []} />
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={!data?.next}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
