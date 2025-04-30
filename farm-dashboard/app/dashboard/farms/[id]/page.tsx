"use client"

import type { Farm } from "@/app/types/farm.types"
import { FieldCreateDialog } from "@/components/dashboard/field-create-dialog"
import { fetcher } from "@/lib/utils"
import { useParams } from "next/navigation"
import useSWR from "swr"
import type { CamelCaseToSnakeCase } from "@/lib/utils"
import { MapPin, Ruler, FileText, Tractor, Wheat, Cloud, Leaf, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Field } from "react-hook-form"
import FieldByFarm from "@/components/dashboard/field-by-farm"
import { useState } from "react"
import CropAddDialog from "@/components/dashboard/crop-add-dialog"
import { PaginatedFarmsResponse } from "../FarmComponent"

export default function IndividualPage() {
    const { id } = useParams()
    const { data, isLoading }: { data?: CamelCaseToSnakeCase<Farm>; isLoading: boolean } = useSWR(
        `/farm/list/${id}`,
        fetcher,
    )
    const { data: fieldData, isLoading: fieldLoading, mutate } = useSWR<PaginatedFarmsResponse<CamelCaseToSnakeCase<Field>>>(
        id ? `/field/farm/${id}` : null,
        fetcher,
    )
    // TODO: implement mutating stuff
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-green-50/50">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 text-green-600 animate-spin mx-auto mb-4" />
                    <p className="text-green-800">Loading farm details...</p>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-64 bg-red-50/50 rounded-xl border border-red-100">
                <div className="text-center p-6">
                    <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
                        <FileText className="h-6 w-6 text-red-500" />
                    </div>
                    <p className="text-red-700 font-medium">Failed to load farm details.</p>
                    <Button variant="outline" className="mt-4" asChild>
                        <Link href="/farms">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return to Farms
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Calculate a season based on current month
    const getSeasonInfo = () => {
        const month = new Date().getMonth()
        if (month >= 2 && month <= 4) return { name: "Spring", icon: Leaf, color: "text-green-500" }
        if (month >= 5 && month <= 7) return { name: "Summer", icon: Wheat, color: "text-amber-500" }
        if (month >= 8 && month <= 10) return { name: "Fall", icon: Cloud, color: "text-orange-500" }
        return { name: "Winter", icon: Cloud, color: "text-blue-500" }
    }

    const season = getSeasonInfo()
    const SeasonIcon = season.icon

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 py-8">
            <div className="container mx-auto px-4">
                {/* Farm Header */}
                <div className="relative rounded-xl overflow-hidden shadow-lg border border-green-200 bg-white mb-8">
                    <div className="h-48 bg-gradient-to-r from-green-600 to-green-700 relative">
                        {data.image ? (
                            <img
                                src={data.image || "/placeholder.svg"}
                                alt={data.name}
                                className="w-full h-full object-cover opacity-80"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                <Tractor className="h-32 w-32 text-white" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                            <div className="p-6 text-white">
                                <h1 className="text-3xl font-bold">{data.name}</h1>
                                <div className="flex items-center mt-2">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span className="text-sm">{data.location || "Location not specified"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex flex-wrap gap-4 mb-6">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                                <Ruler className="h-3 w-3 mr-1" />
                                {data.size_in_acres} acres
                            </Badge>
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                                <SeasonIcon className={`h-3 w-3 mr-1 ${season.color}`} />
                                Current Season: {season.name}
                            </Badge>
                        </div>

                        <Separator className="my-4 bg-green-100" />

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-green-800 flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                                    About this Farm
                                </h3>
                                <p className="mt-2 text-gray-700 leading-relaxed">
                                    {data.description || "No description available for this farm."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fields Section */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 border-green-200">
                        <CardHeader className="bg-green-50 border-b border-green-100">
                            <CardTitle className="text-xl text-green-800 flex items-center">
                                <Wheat className="h-5 w-5 mr-2 text-green-600" />
                                Fields
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 text-amber-800 mb-4">
                                <p className="text-sm flex items-center">
                                    <Leaf className="h-4 w-4 mr-2 text-amber-600" />
                                    Add fields to track different areas of your farm
                                </p>
                            </div>

                            <FieldCreateDialog />

                            {/* Placeholder for fields list - would be populated from API */}
                            {/* <div className="mt-6 grid gap-4">
                                <div className="h-24 rounded-lg border border-dashed border-green-300 flex items-center justify-center bg-green-50/50">
                                    <p className="text-green-600 text-sm">No fields added yet</p>
                                </div>
                            </div> */}
                            <FieldByFarm farmId={id as string} />
                        </CardContent>
                    </Card>

                    {/* Farm Stats */}
                    <Card className="border-green-200 h-fit">
                        <CardHeader className="bg-green-50 border-b border-green-100">
                            <CardTitle className="text-xl text-green-800 flex items-center">
                                <Tractor className="h-5 w-5 mr-2 text-green-600" />
                                Farm Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ul className="space-y-4">
                                <li className="flex justify-between items-center pb-2 border-b border-green-100">
                                    <span className="text-gray-600">Size</span>
                                    <span className="font-medium text-green-800">{data.size_in_acres} acres</span>
                                </li>
                                <li className="flex justify-between items-center pb-2 border-b border-green-100">
                                    <span className="text-gray-600">Fields</span>
                                    <span className="font-medium text-green-800">{fieldData?.count}</span>
                                </li>
                                <li className="flex justify-between items-center pb-2 border-b border-green-100">
                                    <span className="text-gray-600">Created</span>
                                    <span className="font-medium text-green-800">{new Date().toLocaleDateString()}</span>
                                </li>
                            </ul>

                            <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-100">
                                <h4 className="font-medium text-green-800 mb-2 flex items-center">
                                    <Cloud className="h-4 w-4 mr-1" />
                                    Weather Forecast
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Connect a weather service to see forecasts for your farm location.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
