"use client"

import { Calendar, Tractor } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const harvests = [
  {
    id: 1,
    crop: "Wheat",
    field: "Field A",
    date: "2024-05-20",
    progress: 85,
  },
  {
    id: 2,
    crop: "Corn",
    field: "Field B",
    date: "2024-05-25",
    progress: 70,
  },
  {
    id: 3,
    crop: "Soybeans",
    field: "Field C",
    date: "2024-06-05",
    progress: 60,
  },
  {
    id: 4,
    crop: "Rice",
    field: "Field D",
    date: "2024-06-10",
    progress: 40,
  },
]

export function UpcomingHarvests() {
  return (
    <div className="space-y-4">
      {harvests.map((harvest) => (
        <Card key={harvest.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{harvest.crop}</h3>
                  <p className="text-sm text-muted-foreground">{harvest.field}</p>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-1 h-4 w-4" />
                  {new Date(harvest.date).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Growth Progress</span>
                  <span>{harvest.progress}%</span>
                </div>
                <Progress value={harvest.progress} className="h-2" />
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <Tractor className="mr-1 h-4 w-4" />
                <span>
                  {harvest.progress >= 80
                    ? "Ready for harvest"
                    : `Estimated ${Math.ceil((100 - harvest.progress) / 5)} days until harvest`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
