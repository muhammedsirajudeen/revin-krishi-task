"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DashboardResponse } from "@/app/dashboard/page"


export function TasksStatusChart({ pending, progress, completed }: DashboardResponse) {
  const data = [
    { name: "Pending", value: pending, color: "hsl(var(--warning))" },
    { name: "In Progress", value: progress, color: "hsl(var(--info))" },
    { name: "Completed", value: completed, color: "hsl(var(--success))" },
  ]

  return (
    <ChartContainer
      config={{
        Pending: {
          label: "Pending",
          color: "hsl(var(--warning))",
        },
        "In Progress": {
          label: "In Progress",
          color: "hsl(var(--info))",
        },
        Completed: {
          label: "Completed",
          color: "hsl(var(--success))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
