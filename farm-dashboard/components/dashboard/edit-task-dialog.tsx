"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import useSWR from "swr"
import { CalendarIcon, Loader2 } from "lucide-react"

import { fetcher, ToastStyles, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import axiosInstance from "@/app/helper/axiosInstance"
import { JoinedTask } from "@/app/types/farm.types"

// Define the interfaces
export interface Farm {
    id: string
    name: string
    // Add other farm properties as needed
}

export interface Field {
    id: string
    name: string
    farm_id: string
    // Add other field properties as needed
}

export interface User {
    id: string
    email: string
    // Add other user properties as needed
}


export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

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

interface EditTaskDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    task?: JoinedTask
    onSuccess?: () => void
    mutate: () => void
}

export function EditTaskDialog({ open, setOpen, task, onSuccess, mutate }: EditTaskDialogProps) {
    const [fields, setFields] = useState<Field[]>([])
    const [isHarvest, setIsHarvest] = useState(task?.type === "harvest")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFarm, setSelectedFarm] = useState<string | null>(task?.farm?.id || null)

    const { data: users } = useSWR<PaginatedResponse<User>>(`/user/list?limit=100`, fetcher)
    const { data: farms } = useSWR<PaginatedResponse<Farm>>(`/farm/list/owner?limit=100`, fetcher)

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task?.title || "",
            description: task?.description || "",
            deadline: task?.deadline ? new Date(task.deadline) : new Date(),
            priority: task?.priority || "medium",
            farm: task?.farm?.id || "",
            field: task?.field?.id || "",
            assigned_to: task?.assigned_to?.id || "",
        },
    })

    // Load fields when farm changes
    useEffect(() => {
        const fetchFields = async () => {
            if (selectedFarm) {
                try {
                    const response = await axiosInstance.get(`/field/farm/${selectedFarm}`);
                    setFields(response.data.results);
                } catch (error) {
                    toast.error("Failed to load fields");
                }
            } else {
                setFields([]);
            }
        };

        fetchFields();
    }, [selectedFarm]);

    // Update fields when farm changes in the form
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === "farm") {
                setSelectedFarm(value.farm || null);
                form.setValue("field", ""); // Reset field when farm changes
            }
        });

        return () => subscription.unsubscribe();
    }, [form]);

    // Initialize with task data when task changes
    useEffect(() => {
        if (task) {
            form.reset({
                title: task.title || "",
                description: task.description || "",
                deadline: task.deadline ? new Date(task.deadline) : new Date(),
                priority: task.priority || "medium",
                farm: task.farm?.id || "",
                field: task.field?.id || "",
                assigned_to: task.assigned_to?.id || "",
            });

            setIsHarvest(task.type === "harvest");
            setSelectedFarm(task.farm?.id || null);
        }
    }, [task, form]);

    const onSubmit = async (values: TaskFormValues) => {
        if (!task?.id) {
            toast.error("Task ID is missing");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...values,
                deadline: format(values.deadline, "yyyy-MM-dd"), // Ensure it's formatted as YYYY-MM-DD
                type: isHarvest ? "harvest" : "maintenance",
            };

            await axiosInstance.patch(`/task/update/${task.id}`, payload);
            toast.success("Task updated!", ToastStyles.success);
            mutate();
            if (onSuccess) onSuccess();
            setOpen(false);
        } catch (error) {
            toast.error("Failed to update task");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Task title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
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

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Task description"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="deadline"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Deadline</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
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

                            <div className="flex items-center space-x-2 pt-8">
                                <Switch
                                    checked={isHarvest}
                                    onCheckedChange={setIsHarvest}
                                    id="task-type"
                                />
                                <label
                                    htmlFor="task-type"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Harvest Task
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="farm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Farm</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select farm" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {farms?.results.map((farm) => (
                                                    <SelectItem key={farm.id} value={farm.id}>
                                                        {farm.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="field"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Field</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={!selectedFarm || fields.length === 0}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select field" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {fields.map((fieldItem) => (
                                                    <SelectItem key={fieldItem.id} value={fieldItem.id}>
                                                        {fieldItem.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="assigned_to"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assign To</FormLabel>
                                    <Select
                                        value={field.value} // Use value instead of defaultValue
                                        onValueChange={field.onChange} // Ensure onChange is handled by react-hook-form
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select user" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {users?.results.map((user) => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {user.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}