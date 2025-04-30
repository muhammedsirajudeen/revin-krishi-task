"use client"

import { Calendar, Tractor } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DashboardResponse } from "@/app/dashboard/page"

const harvests = [
  {
    id: 1,
    crop: "Wheat",
    field: "Field A",
    date: "2024-05-20",
  },
  {
    id: 2,
    crop: "Corn",
    field: "Field B",
    date: "2024-05-25",
  },
  {
    id: 3,
    crop: "Soybeans",
    field: "Field C",
    date: "2024-06-05",
  },
  {
    id: 4,
    crop: "Rice",
    field: "Field D",
    date: "2024-06-10",
  },
]

export function UpcomingHarvests({ recent_harvest }: DashboardResponse) {
  const calculateProgress = (deadline: string, startDate: string = '2025-01-01'): number => {
    // Validate the deadline format is YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
      throw new Error('Deadline must be in YYYY-MM-DD format');
    }

    // Validate the start date format if provided
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      throw new Error('Start date must be in YYYY-MM-DD format');
    }

    // Get today's date
    const today = new Date();

    // Parse the provided deadline and start date
    const deadlineDate = new Date(deadline + 'T00:00:00');
    const startDateObj = new Date(startDate + 'T00:00:00');

    // Calculate the total number of days from start date to the deadline date
    const totalDays = (deadlineDate.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24);

    // Calculate the difference in milliseconds between today and the deadline
    const differenceInMs = deadlineDate.getTime() - today.getTime();
    const daysRemaining = differenceInMs / (1000 * 60 * 60 * 24);

    // If the difference is negative (deadline passed), return 100% progress
    if (daysRemaining <= 0) {
      return 100;
    }

    // Calculate the percentage of progress
    const progress = ((totalDays - daysRemaining) / totalDays) * 100;

    // Return the progress as a number with two decimal places
    return parseFloat(progress.toFixed(2));
  };


  return (
    <div className="space-y-4">
      {recent_harvest.map((harvest) => {
        const progress = calculateProgress(harvest.deadline);
        return (
          <Card key={harvest.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{harvest.title}</h3>
                    <p className="text-sm text-muted-foreground">{harvest.description}</p>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(harvest.deadline).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Growth Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <Tractor className="mr-1 h-4 w-4" />
                  <span>
                    {progress >= 80
                      ? "Ready for harvest"
                      : `Estimated ${Math.ceil((100 - progress) / 5)} days until harvest`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
