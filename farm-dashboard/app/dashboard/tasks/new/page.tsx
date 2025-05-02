"use client"

import type React from "react"
import { Fragment, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { cn, fetcher, ToastStyles } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch" // ✅ Import Switch
import axiosInstance from "@/app/helper/axiosInstance"
import useSWR from "swr"
import { PaginatedFarmsResponse } from "../../farms/FarmComponent"
import { Farm, Field, User } from "@/app/types/farm.types"

// ✅ Schema
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  deadline: z.date({ required_error: "Deadline is required" }),
  priority: z.enum(["low", "medium", "high", "urgent"], { required_error: "Select a priority" }),
  farm: z.string().min(1, "Select a farm"),
  field: z.string().min(1, "Select a field"),
  assigned_to: z.string().min(1, "Select a user"),
})

type TaskFormValues = z.infer<typeof taskSchema>

export default function NewTaskPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isHarvest, setIsHarvest] = useState(false) // ✅ Toggle state
  const { data } = useSWR<PaginatedFarmsResponse<User>>(
    `/user/list?limit=${100}`,
    fetcher
  )
  const { data: farmData } = useSWR<PaginatedFarmsResponse<Farm>>(
    `/farm/list/owner?limit=${100}`,
    fetcher
  )
  const [loading, setLoading] = useState(true)
  const [fields, setFields] = useState<Field[]>([])
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: undefined,
      priority: undefined,
      farm: "",
      field: "",
      assigned_to: "",
    },
  })
  useEffect(() => {
    if (window) {
      const date = window.localStorage.getItem('current-date')
      console.log(date)
      if (date) {
        form.setValue("deadline", new Date(date ?? ""))
      }
    }
  }, [form])
  const onSubmit = async (values: TaskFormValues) => {
    setIsLoading(true)
    try {
      const formattedValues = {
        ...values,
        // Ensure the deadline is in YYYY-MM-DD format using toLocaleDateString
        deadline: values.deadline?.toLocaleDateString('en-CA'), // 'en-CA' gives YYYY-MM-DD format
        type: isHarvest ? "harvest" : "maintenance", // ✅ Add type
      }

      await axiosInstance.post('/task/add', formattedValues)
      toast.success("Task created successfully!", ToastStyles.success)
      router.push("/dashboard/tasks")
    } catch {
      toast.error("Failed to create task")
    } finally {
      setIsLoading(false)
      form.reset()
      setIsHarvest(false)
    }
  }


  const handleFarmChange = async () => {
    try {
      const farmId = form.getValues().farm
      const response = await axiosInstance.get(`field/farm/${farmId}?limit=100`)
      setFields(response.data.results)
    } catch (error) {
      console.log(error)
      toast.error('error loading field data')
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
  console.log(data)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Enter the details for the new task</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter task description" className="min-h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                {/* Deadline */}
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Select a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Priority */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Farm */}
                <FormField
                  control={form.control}
                  name="farm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign to Farm</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value)
                        handleFarmChange()
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select farm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            farmData?.results.map((result) => (
                              <SelectItem key={result.id} value={result.id}>{result.name}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Field */}
                <FormField
                  control={form.control}
                  name="field"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign to Field</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            fields.map((field) => (
                              <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* User */}
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to User</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data?.results.map((result, index) => (
                          <SelectItem key={index} value={result.id.toString()}>
                            {result.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ✅ Harvest Toggle */}
              <div className="flex items-center gap-4 pt-4">
                <FormLabel className="text-base">Is Harvest Task?</FormLabel>
                <Switch checked={isHarvest} onCheckedChange={setIsHarvest} />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
