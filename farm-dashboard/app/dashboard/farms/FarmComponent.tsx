'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Leaf, MapPin, Tractor, Wheat, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

import FarmCreationDialog from "@/components/dashboard/farm-create-dialog"
import { CamelCaseToSnakeCase, fetcher } from '@/lib/utils'
import { Farm } from '@/app/types/farm.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

type PaginatedFarmsResponse = {
    count: number
    next: string | null
    previous: string | null
    results: Farm[]
}

export default function FarmPage() {
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 6
    const router = useRouter()
    const { data, isLoading } = useSWR<PaginatedFarmsResponse>(
        `/farm/list?page=${page}&limit=${PAGE_SIZE}`,
        fetcher
    )

    const handleNextPage = () => {
        if (data?.next) setPage(prev => prev + 1)
    }

    const handlePrevPage = () => {
        if (data?.previous && page > 1) setPage(prev => prev - 1)
    }

    const getFarmIcon = (farmName: string) => {
        const name = farmName.toLowerCase()
        if (name.includes('wheat') || name.includes('grain')) return Wheat
        if (name.includes('tractor') || name.includes('machine')) return Tractor
        return Leaf
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
            <div className="container mx-auto p-6 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-green-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-green-800">Your Farms</h1>
                        <p className="text-green-600 mt-1">Manage and monitor your agricultural spaces</p>
                    </div>
                    <FarmCreationDialog />
                </div>

                {/* Farm Cards Grid */}
                {isLoading && !data ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data?.results.map((farm) => {
                            const FarmIcon = getFarmIcon(farm.name)
                            const customFarm = farm as unknown as CamelCaseToSnakeCase<Farm>
                            return (
                                <Card key={farm.id} className="overflow-hidden border-green-200 hover:shadow-lg transition-all duration-300 bg-white">
                                    <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 pb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-green-600 p-2 rounded-full">
                                                <FarmIcon className="h-5 w-5 text-white" />
                                            </div>
                                            <CardTitle className="text-xl text-green-800">{customFarm.name}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="h-4 w-4 text-green-600" />
                                                <span>{customFarm.location || "Location not specified"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Leaf className="h-4 w-4 text-green-600" />
                                                <span>{customFarm.size_in_acres || "N/A"} acres</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-green-50 border-t border-green-100 flex justify-between">
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                            {customFarm.size_in_acres ? (customFarm.size_in_acres > 50 ? "Large Farm" : "Small Farm") : "Unknown Size"}
                                        </Badge>
                                        <Button onClick={() => {
                                            router.push(`/dashboard/farms/${customFarm.id}`)
                                        }} variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-100">
                                            View Details
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                )}

                {/* Empty State */}
                {data?.results?.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 bg-green-50/50 rounded-xl border border-green-100 p-6">
                        <Wheat className="h-16 w-16 text-green-300 mb-4" />
                        <h3 className="text-xl font-semibold text-green-800">No Farms Yet</h3>
                        <p className="text-green-600 mt-2 text-center max-w-md">
                            Start by creating your first farm to track and manage your agricultural spaces.
                        </p>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-4 pt-6">
                    <Button
                        onClick={handlePrevPage}
                        disabled={!data?.previous || page === 1 || isLoading}
                        className="bg-green-100 text-green-700 hover:bg-green-200"
                    >
                        <ChevronUp className="mr-2 h-4 w-4" />
                        Previous
                    </Button>

                    <Button
                        onClick={handleNextPage}
                        disabled={!data?.next || isLoading}
                        className="bg-green-700 hover:bg-green-800 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                Next
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
