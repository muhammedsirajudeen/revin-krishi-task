'use client'

import { useRouter, useSearchParams } from "next/navigation"
import useSWR from "swr"
import { AddMemberDialog } from "@/components/dashboard/add-team-member"
import { PaginatedFarmsResponse } from "../farms/FarmComponent"
import { User } from "@/app/types/farm.types"
import { fetcher } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'

export default function TeamComponent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get("page") || "1")

    const { data, isLoading, mutate } = useSWR<PaginatedFarmsResponse<User>>(
        `/user/list?page=${currentPage}`,
        fetcher
    )

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        router.push(`?${params.toString()}`)
    }

    const getInitials = (email: string) => {
        return email.split('@')[0].substring(0, 2).toUpperCase()
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'FarmWorker':
                return 'bg-green-100 text-green-800 hover:bg-green-100'
            case 'FarmManager':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
            case 'Admin':
                return 'bg-purple-100 text-purple-800 hover:bg-purple-100'
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                        Manage your team members and their roles
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => mutate()}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span className="sr-only">Refresh</span>
                    </Button>
                    <AddMemberDialog />
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <TeamMembersLoading />
                ) : (
                    <>
                        <div className="rounded-md border">
                            <div className="grid grid-cols-12 border-b px-4 py-3 font-medium">
                                <div className="col-span-5 md:col-span-6">User</div>
                                <div className="col-span-4 md:col-span-4">Role</div>
                                <div className="col-span-3 md:col-span-2 text-right">Actions</div>
                            </div>
                            <div className="divide-y">
                                {data?.results.map((user) => (
                                    <div key={user.email} className="grid grid-cols-12 items-center px-4 py-3">
                                        <div className="col-span-5 md:col-span-6 flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                                            </Avatar>
                                            <span className="truncate font-medium">{user.email}</span>
                                        </div>
                                        <div className="col-span-4 md:col-span-4">
                                            <Badge variant="outline" className={getRoleColor(user.role)}>
                                                {user.role}
                                            </Badge>
                                        </div>
                                        <div className="col-span-3 md:col-span-2 flex justify-end">
                                            <Button variant="ghost" size="sm">
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {data?.results.length === 0 && (
                                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                        No team members found. Add your first team member to get started.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pagination */}
                        {data && data.count > 0 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {((currentPage - 1) * 10) + 1}-
                                    {Math.min(currentPage * 10, data.count)} of {data.count}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={!data.previous}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="sr-only">Previous Page</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={!data.next}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                        <span className="sr-only">Next Page</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

function TeamMembersLoading() {
    return (
        <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b px-4 py-3 font-medium">
                <div className="col-span-5 md:col-span-6">User</div>
                <div className="col-span-4 md:col-span-4">Role</div>
                <div className="col-span-3 md:col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="grid grid-cols-12 items-center px-4 py-3">
                        <div className="col-span-5 md:col-span-6 flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="col-span-4 md:col-span-4">
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <div className="col-span-3 md:col-span-2 flex justify-end">
                            <Skeleton className="h-8 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
