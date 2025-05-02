"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Flag, Mail, MapPin, Plus, User } from "lucide-react"
import { format, startOfToday } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn, fetcher } from "@/lib/utils"
import useSWR from "swr"
import { PaginatedFarmsResponse } from "../farms/FarmComponent"
import { JoinedTask } from "@/app/types/farm.types"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import axiosInstance from "@/app/helper/axiosInstance"
import { useRouter } from "next/navigation"

export default function CalendarPage() {
  const { data: events } = useSWR<PaginatedFarmsResponse<JoinedTask>>(
    `/task/list?limit=${100}`,
    fetcher
  )
  const [currentMonth, setCurrentMonth] = useState(startOfToday())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEventDetails, setSelectedEventDetails] = useState<JoinedTask | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
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



  const handleDateClick = (date: Date) => {
    const eventsForDate = getEventsForDate(date) ?? []
    if (eventsForDate.length > 0) {
      // If there are events, you can set the first one as the default event to show
      setSelectedEventDetails(eventsForDate[0])
      setIsDialogOpen(true)
    }
  }

  const handleAddEventButtonClick = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the cell click event
    console.log("Add event for date:", format(date, "yyyy-MM-dd"));
    window.localStorage.setItem('current-date', format(date, "yyyy-MM-dd"))
    window.location.href = '/dashboard/tasks/new'
  }

  const getEventsForDate = (date: Date) => {
    return events?.results.filter((event) => {
      const eventDate = new Date(event.deadline)
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
  useEffect(() => {
    async function userVerifier() {
      try {
        const response = await axiosInstance.post('/user/token/verify',
          {
            token: window.localStorage.getItem('token')
          }
        )
        console.log(response)
        setLoading(false)
      } catch (error) {
        console.log(error)
        router.push('/auth/login')
      }
    }
    userVerifier()

  }, [])
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }



  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
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
              const dateEvents = getEventsForDate(date) ?? []

              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-24 rounded-lg border p-1 relative cursor-pointer",
                    isCurrentMonth ? "bg-card" : "bg-muted/50 text-muted-foreground",
                    isToday && "border-primary",
                  )}
                  onClick={() => isCurrentMonth && handleDateClick(date)}
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
                  {isCurrentMonth && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-primary/10 hover:bg-primary/20"
                      onClick={(e) => handleAddEventButtonClick(date, e)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          {selectedEventDetails && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedEventDetails.title}</DialogTitle>
                <DialogDescription className="pt-2">{selectedEventDetails.description}</DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="flex items-center gap-1">
                    <Flag className="h-3 w-3" />
                    {selectedEventDetails.priority} Priority
                  </Badge>
                  <Badge className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {selectedEventDetails.status}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {selectedEventDetails.type}
                  </Badge>
                </div>

                <Separator />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <div>
                      <p className="text-sm font-medium">Farm</p>
                      <p className="text-sm text-muted-foreground">{selectedEventDetails.farm.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Field</p>
                      <p className="text-sm text-muted-foreground">{selectedEventDetails.field.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Assigned to</p>
                      <p className="text-xs text-muted-foreground">{selectedEventDetails.assigned_to.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Created by</p>
                      <p className="text-xs text-muted-foreground">{selectedEventDetails.created_by.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// // Calendar component for date selection
// function Calendar({
//   mode,
//   selected,
//   onSelect,
//   initialFocus,
// }: {
//   mode: "single"
//   selected?: Date
//   onSelect: (date: Date | undefined) => void
//   initialFocus?: boolean
// }) {
//   const [currentMonth, setCurrentMonth] = useState(startOfToday())

//   const daysInMonth = Array.from({ length: 35 }, (_, i) => {
//     const date = new Date(currentMonth)
//     date.setDate(1)
//     const firstDayOfMonth = date.getDay()
//     date.setDate(i - firstDayOfMonth + 1)
//     return date
//   })

//   const handlePreviousMonth = () => {
//     const date = new Date(currentMonth)
//     date.setMonth(date.getMonth() - 1)
//     setCurrentMonth(date)
//   }

//   const handleNextMonth = () => {
//     const date = new Date(currentMonth)
//     date.setMonth(date.getMonth() + 1)
//     setCurrentMonth(date)
//   }

//   const handleAddButtonClick = (date: Date, e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent triggering the cell click event
//     console.log("Add event for date:", format(date, "yyyy-MM-dd"));
//   }

//   return (
//     <div className="p-3">
//       <div className="flex items-center justify-between">
//         <h2 className="text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</h2>
//         <div className="flex items-center gap-1">
//           <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePreviousMonth}>
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//       <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
//         <div className="p-1">S</div>
//         <div className="p-1">M</div>
//         <div className="p-1">T</div>
//         <div className="p-1">W</div>
//         <div className="p-1">T</div>
//         <div className="p-1">F</div>
//         <div className="p-1">S</div>
//       </div>
//       <div className="mt-1 grid grid-cols-7 gap-1">
//         {daysInMonth.map((date, i) => {
//           const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
//           const isToday = date.toDateString() === new Date().toDateString()
//           const isSelected = selected?.toDateString() === date.toDateString()

//           return (
//             <div key={i} className="relative">
//               <button
//                 type="button"
//                 className={cn(
//                   "inline-flex h-8 w-8 items-center justify-center rounded p-0 text-sm font-normal",
//                   isCurrentMonth ? "text-foreground" : "text-muted-foreground",
//                   isToday && "bg-accent text-accent-foreground",
//                   isSelected && "bg-primary text-primary-foreground",
//                   !isSelected && !isToday && "hover:bg-accent hover:text-accent-foreground",
//                 )}
//                 onClick={() => onSelect(date)}
//                 disabled={!isCurrentMonth}
//               >
//                 {date.getDate()}
//               </button>
//               {isCurrentMonth && (
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary/10 hover:bg-primary/20"
//                   onClick={(e) => handleAddButtonClick(date, e)}
//                 >
//                   <Plus className="h-2 w-2" />
//                 </Button>
//               )}
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }