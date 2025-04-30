"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DashboardResponse } from "@/app/dashboard/page"


export function Overview({ crop, task }: DashboardResponse) {
  const data = [
    {
      name: "May",
      crops: crop,
      tasks: task,
    },
  ]
  return (
    <ChartContainer
      config={{
        crops: {
          label: "Crops",
          color: "hsl(var(--chart-1))",
        },
        tasks: {
          label: "Tasks",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="crops"
            strokeWidth={2}
            activeDot={{
              r: 6,
              style: { fill: "var(--color-crops)", opacity: 0.8 },
            }}
            style={{
              stroke: "var(--color-crops)",
            }}
          />
          <Line
            type="monotone"
            dataKey="tasks"
            strokeWidth={2}
            activeDot={{
              r: 6,
              style: { fill: "var(--color-tasks)", opacity: 0.8 },
            }}
            style={{
              stroke: "var(--color-tasks)",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
