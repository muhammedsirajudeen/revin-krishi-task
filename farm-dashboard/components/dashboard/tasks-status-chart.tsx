"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Pending", value: 12, color: "hsl(var(--warning))" },
  { name: "In Progress", value: 8, color: "hsl(var(--info))" },
  { name: "Completed", value: 20, color: "hsl(var(--success))" },
]

export function TasksStatusChart() {
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
