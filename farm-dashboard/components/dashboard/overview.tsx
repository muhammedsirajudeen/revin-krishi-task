"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    crops: 2400,
    tasks: 1400,
  },
  {
    name: "Feb",
    crops: 1398,
    tasks: 1210,
  },
  {
    name: "Mar",
    crops: 9800,
    tasks: 2290,
  },
  {
    name: "Apr",
    crops: 3908,
    tasks: 2000,
  },
  {
    name: "May",
    crops: 4800,
    tasks: 2181,
  },
  {
    name: "Jun",
    crops: 3800,
    tasks: 2500,
  },
  {
    name: "Jul",
    crops: 4300,
    tasks: 2100,
  },
]

export function Overview() {
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
