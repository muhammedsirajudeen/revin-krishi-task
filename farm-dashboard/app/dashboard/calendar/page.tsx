"use client"

import { useState } from "react"
import { toast } from "sonner"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { addDays, format, startOfToday } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Sample data
const events = [
  {
    id: 1,
    title: "Irrigation check for Field A",
    date: addDays(startOfToday(), 1).toISOString(),
    type: "task",
    status: "pending",
  },
  {
    id: 2,
    title: "Apply fertilizer to corn crops",
    date: addDays(startOfToday(), 2).toISOString(),
    type: "task",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Harvest wheat in Field C",
    date: addDays(startOfToday(), 5).toISOString(),
    type: "harvest",
    status: "pending",
  },
  {
    id: 4,
    title: "Repair tractor #3",
    date: addDays(startOfToday(), -1).toISOString(),
    type: "maintenance",
    status: "completed",
  },
  {
    id: 5,
    title: "Pest control in Field D",
    date: addDays(startOfToday(), 3).toISOString(),
    type: "task",
    status: "in-progress",
  },
  {
    id: 6,
    title: "Team meeting",
    date: startOfToday().toISOString(),
    type: "meeting",
    status: "pending",
  },
]

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startOfToday())
  const [currentMonth, setCurrentMonth] = useState(startOfToday())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const daysInMonth = Array.from({ length: 35 }, (_, i) => {
    const date = new Date(currentMonth)
    date.setDate(1)
    const firstDayOfMonth = date.getDay()
    date.setDate(i - firstDayOfMonth + 1)
    return date
  })

  const handlePreviousMonth = () => {
    const date = new Date(currentMonth)
    date.setMonth(date.getMonth() - 1)
    setCurrentMonth(date)
  }

  const handleNextMonth = () => {
    const date = new Date(currentMonth)
    date.setMonth(date.getMonth() + 1)
    setCurrentMonth(date)
  }

  const handleAddEvent = () => {
    toast.success("Event added successfully")
    setIsDialogOpen(false)
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "task":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "harvest":
        return "bg-green-100 text-green-800 border-green-200"
      case "maintenance":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "meeting":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>Create a new event or task on the calendar</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter event title" />
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>Event Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="harvest">Harvest</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>View and manage all scheduled tasks and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center font-medium">
            <div className="p-2">Sun</div>
            <div className="p-2">Mon</div>
            <div className="p-2">Tue</div>
            <div className="p-2">Wed</div>
            <div className="p-2">Thu</div>
            <div className="p-2">Fri</div>
            <div className="p-2">Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((date, i) => {
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
              const isToday = date.toDateString() === new Date().toDateString()
              const dateEvents = getEventsForDate(date)

              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-24 rounded-lg border p-1",
                    isCurrentMonth ? "bg-card" : "bg-muted/50 text-muted-foreground",
                    isToday && "border-primary",
                  )}
                >
                  <div className="flex justify-between p-1">
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
                        isToday && "bg-primary text-primary-foreground font-medium",
                      )}
                    >
                      {date.getDate()}
                    </span>
                    {dateEvents.length > 0 && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1 text-xs font-medium">
                        {dateEvents.length}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 p-1">
                    {dateEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "truncate rounded border px-1.5 py-0.5 text-xs font-medium",
                          getEventTypeColor(event.type),
                        )}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dateEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground">+{dateEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Calendar component for date selection
function Calendar({
  mode,
  selected,
  onSelect,
  initialFocus,
}: {
  mode: "single"
  selected?: Date
  onSelect: (date: Date | undefined) => void
  initialFocus?: boolean
}) {
  const [currentMonth, setCurrentMonth] = useState(startOfToday())

  const daysInMonth = Array.from({ length: 35 }, (_, i) => {
    const date = new Date(currentMonth)
    date.setDate(1)
    const firstDayOfMonth = date.getDay()
    date.setDate(i - firstDayOfMonth + 1)
    return date
  })

  const handlePreviousMonth = () => {
    const date = new Date(currentMonth)
    date.setMonth(date.getMonth() - 1)
    setCurrentMonth(date)
  }

  const handleNextMonth = () => {
    const date = new Date(currentMonth)
    date.setMonth(date.getMonth() + 1)
    setCurrentMonth(date)
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
        <div className="p-1">S</div>
        <div className="p-1">M</div>
        <div className="p-1">T</div>
        <div className="p-1">W</div>
        <div className="p-1">T</div>
        <div className="p-1">F</div>
        <div className="p-1">S</div>
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {daysInMonth.map((date, i) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
          const isToday = date.toDateString() === new Date().toDateString()
          const isSelected = selected?.toDateString() === date.toDateString()

          return (
            <button
              key={i}
              type="button"
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded p-0 text-sm font-normal",
                isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                isToday && "bg-accent text-accent-foreground",
                isSelected && "bg-primary text-primary-foreground",
                !isSelected && !isToday && "hover:bg-accent hover:text-accent-foreground",
              )}
              onClick={() => onSelect(date)}
              disabled={!isCurrentMonth}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
