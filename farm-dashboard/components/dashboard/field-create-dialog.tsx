import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { toast } from "sonner";
import { fetcher, ToastStyles } from "@/lib/utils";
import axiosInstance from "@/app/helper/axiosInstance";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { PaginatedFarmsResponse } from "@/app/dashboard/farms/FarmComponent";
import { User } from "./edit-task-dialog";

const fieldSchema = z.object({
    name: z.string().min(1, "Field name is required"),
    managerId: z.string().min(1, "Manager ID is required"),
    sizeInAcres: z.string().min(0.1, "Must be at least 0.1 acre"),
    description: z.string().optional(),
    image: z
        .custom<File>((file) => file instanceof File, "Image is required")
        .refine((file) => file.size < 5 * 1024 * 1024, "Max image size is 5MB"),
});

type FieldFormData = z.infer<typeof fieldSchema>;

export function FieldCreateDialog() {
    const { data, isLoading: managerLoading } = useSWR<PaginatedFarmsResponse<User>>(
        `/user/list?limit=${100}`,
        fetcher
    );
    const managers = data?.results ?? [];
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const { id } = useParams();
    const form = useForm<FieldFormData>({
        resolver: zodResolver(fieldSchema),
        defaultValues: {
            name: "",
            managerId: "",
            sizeInAcres: "1",
            description: "",
            image: undefined as any,
        },
    });

    const onSubmit = async (data: FieldFormData) => {
        try {
            const formData = new FormData();
            formData.append('farm', id as string);
            Object.entries(data).forEach(([key, value]) => {
                if (key === "image" && value instanceof File) {
                    formData.append("image", value);
                } else {
                    formData.append(key, value as string);
                }
            });

            console.log("Form Submitted:", data);
            const response = await axiosInstance.post('/field/create', formData);
            console.log(response);
            window.location.reload()
            toast.success('Created Field', ToastStyles.success);
            setOpen(false);
        } catch (error) {
            toast.error('Failed to create field', ToastStyles.error);
        } finally {
        }
    };

    const handleImageChange = (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Field</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create New Field</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Field Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Field A" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="managerId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Manager</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="border p-2 rounded-md w-full"
                                            >
                                                <option value="">Select Manager</option>
                                                {managers.map((manager) => (
                                                    <option key={manager.id} value={manager.id}>
                                                        {manager.email} ({manager.id})
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="sizeInAcres"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size (acres)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Optional notes..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field: { onChange, ...rest } }) => (
                                <FormItem>
                                    <FormLabel>Field Image</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    onChange(file);
                                                    handleImageChange(file);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    {preview && (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="mt-2 h-40 w-full object-cover rounded-lg border"
                                        />
                                    )}
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
