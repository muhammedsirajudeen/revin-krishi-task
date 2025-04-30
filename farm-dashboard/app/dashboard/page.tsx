'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker"
import { Overview } from "@/components/dashboard/overview"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import { TasksStatusChart } from "@/components/dashboard/tasks-status-chart"
import { UpcomingHarvests } from "@/components/dashboard/upcoming-harvests"
import { StatsCards } from "@/components/dashboard/stats-cards"
import useSWR from "swr"
import { fetcher } from "@/lib/utils"
import { JoinedTask } from "../types/farm.types"

export interface DashboardResponse {
  "farm": number,
  "field": number,
  "crop": number,
  "recent_task": JoinedTask[],
  "recent_harvest": JoinedTask[],
  "pending": number,
  "progress": number,
  "completed": number,
  "task": number
}

export default function DashboardPage() {
  const { data } = useSWR<DashboardResponse>('/farm/summary', fetcher)
  console.log(data)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <CalendarDateRangePicker />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {/* <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger> */}
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* completed */}
          <StatsCards
            pending={data?.pending ?? 0}
            progress={data?.progress ?? 0}
            completed={data?.completed ?? 0}
            recent_harvest={data?.recent_harvest ?? []}
            recent_task={data?.recent_task ?? []}
            crop={data?.crop ?? 0}
            farm={data?.farm ?? 0}
            field={data?.field ?? 0}
            task={data?.task ?? 0}

          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Farm activity for the current period</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview
                  pending={data?.pending ?? 0}
                  progress={data?.progress ?? 0}
                  completed={data?.completed ?? 0}
                  recent_harvest={data?.recent_harvest ?? []}
                  recent_task={data?.recent_task ?? []}
                  crop={data?.crop ?? 0}
                  farm={data?.farm ?? 0}
                  field={data?.field ?? 0}
                  task={data?.task ?? 0}
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Task Status</CardTitle>
                <CardDescription>Distribution of tasks by status</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksStatusChart
                  pending={data?.pending ?? 0}
                  progress={data?.progress ?? 0}
                  completed={data?.completed ?? 0}
                  recent_harvest={data?.recent_harvest ?? []}
                  recent_task={data?.recent_task ?? []}
                  crop={data?.crop ?? 0}
                  farm={data?.farm ?? 0}
                  field={data?.field ?? 0}
                  task={data?.task ?? 0}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Tasks that need your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTasks
                  pending={data?.pending ?? 0}
                  progress={data?.progress ?? 0}
                  completed={data?.completed ?? 0}
                  recent_harvest={data?.recent_harvest ?? []}
                  recent_task={data?.recent_task ?? []}
                  crop={data?.crop ?? 0}
                  farm={data?.farm ?? 0}
                  field={data?.field ?? 0}
                  task={data?.task ?? 0}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Harvests</CardTitle>
                <CardDescription>Scheduled harvests for the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingHarvests
                  pending={data?.pending ?? 0}
                  progress={data?.progress ?? 0}
                  completed={data?.completed ?? 0}
                  recent_harvest={data?.recent_harvest ?? []}
                  recent_task={data?.recent_task ?? []}
                  crop={data?.crop ?? 0}
                  farm={data?.farm ?? 0}
                  field={data?.field ?? 0}
                  task={data?.task ?? 0}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Crop Performance</CardTitle>
                <CardDescription>Yield comparison by crop type</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview
                  pending={data?.pending ?? 0}
                  progress={data?.progress ?? 0}
                  completed={data?.completed ?? 0}
                  recent_harvest={data?.recent_harvest ?? []}
                  recent_task={data?.recent_task ?? []}
                  crop={data?.crop ?? 0}
                  farm={data?.farm ?? 0}
                  field={data?.field ?? 0}
                  task={data?.task ?? 0}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation</CardTitle>
                <CardDescription>Distribution of resources</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksStatusChart
                  pending={data?.pending ?? 0}
                  progress={data?.progress ?? 0}
                  completed={data?.completed ?? 0}
                  recent_harvest={data?.recent_harvest ?? []}
                  recent_task={data?.recent_task ?? []}
                  crop={data?.crop ?? 0}
                  farm={data?.farm ?? 0}
                  field={data?.field ?? 0}
                  task={data?.task ?? 0}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Monthly Reports</CardTitle>
                <CardDescription>Performance reports for all farms</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Report content will be displayed here. You can download reports in PDF, CSV, or Excel formats.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
