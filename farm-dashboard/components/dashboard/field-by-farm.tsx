"use client"

import type { PaginatedFarmsResponse } from "@/app/dashboard/farms/FarmComponent"
import { type CamelCaseToSnakeCase, fetcher } from "@/lib/utils"
import useSWR from "swr"
import Image from "next/image"
import type { Field, JoinedField } from "@/app/types/farm.types"
import { Button } from "@/components/ui/button"
import CropAddDialog from "./crop-add-dialog"
import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crop, MapPin, Ruler, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function FieldByFarm({ farmId }: { farmId: string }) {
    const [open, setOpen] = useState(false)
    const [field, setField] = useState<CamelCaseToSnakeCase<Field>>()
    const { data: fieldData, isLoading: fieldLoading, mutate } = useSWR<PaginatedFarmsResponse<CamelCaseToSnakeCase<Field>>>(
        farmId ? `/field/farm/${farmId}` : null,
        fetcher,
    )

    const onOpen = (open: boolean) => {
        setOpen(open)
    }

    if (!farmId) {
        return null
    }

    if (fieldLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <CardContent className="p-6">
                            <Skeleton className="h-6 w-3/4 mb-4" />
                            <Skeleton className="h-4 w-1/2 mb-2" />
                            <Skeleton className="h-4 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-1/3" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (!fieldData || fieldData.results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-xl bg-muted/20">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No fields added yet</h3>
                <p className="text-muted-foreground mb-4">Add fields to this farm to get started with crop management</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fieldData.results.map((field) => {
                const populatedField = field as unknown as JoinedField
                return (
                    <Card key={field.id} className="overflow-hidden transition-all hover:shadow-md">
                        <div className="relative h-48">
                            <Image src={field.image || "/placeholder.svg"} alt={field.name} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-4">
                                <Badge variant="secondary" className="bg-white/90 text-black font-medium">
                                    {field.size_in_acres} acres
                                </Badge>
                            </div>
                        </div>

                        <CardHeader className="pb-2">
                            <h2 className="text-xl font-semibold text-green-800">{field.name}</h2>
                        </CardHeader>

                        <CardContent className="space-y-3 pb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Ruler className="h-4 w-4" />
                                <span>
                                    Size: <span className="font-medium text-foreground">{field.size_in_acres} acres</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>
                                    Manager:{" "}
                                    <span className="font-medium text-foreground">{populatedField.manager.email.split("@")[0]}</span>
                                </span>
                            </div>

                            {populatedField.crop && (
                                <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                    {populatedField.crop.image ? (
                                        <div className="relative h-8 w-8 rounded-md overflow-hidden">
                                            <Image
                                                src={populatedField.crop.image || "/placeholder.svg"}
                                                alt={populatedField.crop.name || "Crop"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <Crop className="h-5 w-5 text-green-600" />
                                    )}
                                    <div>
                                        <span className="text-xs text-muted-foreground">Current Crop</span>
                                        <p className="font-medium">{populatedField.crop.name}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="pt-0">
                            <Button
                                onClick={() => {
                                    onOpen(true)
                                    setField(field)
                                }}
                                className="w-full"
                                variant="outline"
                            >
                                <Crop className="mr-2 h-4 w-4" />
                                Change Crop
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
            <CropAddDialog mutate={mutate} field={field} open={open} onOpen={onOpen} />
        </div>
    )
}
