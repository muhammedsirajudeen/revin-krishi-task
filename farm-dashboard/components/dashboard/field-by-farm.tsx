import { PaginatedFarmsResponse } from "@/app/dashboard/farms/FarmComponent"
import { CamelCaseToSnakeCase, fetcher } from "@/lib/utils"
import useSWR from "swr"
import Image from "next/image"
import { Field } from "@/app/types/farm.types"
import { Button } from "../ui/button"

export default function FieldByFarm({ farmId }: { farmId: string }) {
    const { data: fieldData, isLoading: fieldLoading } = useSWR<PaginatedFarmsResponse<CamelCaseToSnakeCase<Field>>>(
        `/field/farm/${farmId}`,
        fetcher
    )

    if (fieldLoading) return <p>Loading fields...</p>
    if (!farmId) {
        return
    }
    if (!fieldData || fieldData.results.length === 0) {
        return <p className="text-gray-500">No fields added yet</p>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldData.results.map((field) => (
                <div
                    key={field.id}
                    className="rounded-xl border p-4 shadow hover:shadow-md transition-all bg-white"
                >
                    <Image
                        src={field.image}
                        alt={field.name}
                        width={400}
                        height={200}
                        className="rounded-lg object-cover w-full h-48 mb-4"
                    />
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-green-800">{field.name}</h2>
                        <p className="text-sm text-gray-600">
                            Size: <span className="font-medium">{field.size_in_acres} acres</span>
                        </p>
                        <p>Manager: {field.manager}</p>
                        <Button>Add Crop</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
