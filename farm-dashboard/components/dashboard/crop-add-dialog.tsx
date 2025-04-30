import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "../ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import useSWR, { mutate } from "swr";
import { CamelCaseToSnakeCase, fetcher, ToastStyles } from "@/lib/utils";
import { PaginatedFarmsResponse } from "@/app/dashboard/farms/FarmComponent";
import { Crop, Field } from "@/app/types/farm.types";
import Image from "next/image";
import { toast } from "sonner";
import axiosInstance from "@/app/helper/axiosInstance";

interface CropAddDialgProps {
    open: boolean;
    onOpen: (open: boolean) => void;
    field?: CamelCaseToSnakeCase<Field>;
    mutate: () => void
}

export default function CropAddDialog({ open, onOpen, field, mutate }: CropAddDialgProps) {
    const { data, isLoading } = useSWR<PaginatedFarmsResponse<Crop>>('/farm/crops', fetcher);
    const updateCrop = async (cropId: string) => {
        try {
            const response = await axiosInstance.post(`/field/crop/${field?.id}`, { cropId })
            console.log(response)
            toast.success('Added crop to field', ToastStyles.success)
            mutate()
        } catch (error) {
            console.log(error)
            toast.error('failed to add crop', ToastStyles.error)
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpen}>
            <DialogHeader>
                {/* <DialogTitle className="text-xl font-bold">Add Crops</DialogTitle> */}
            </DialogHeader>
            <DialogContent className="space-y-4">
                {/* Field Image Section */}
                {field?.image && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden shadow">
                        <Image
                            src={field.image}
                            alt={field.name ?? "Field image"}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl"
                        />
                        <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-2 text-center">
                            Adding crops to {field?.name}
                        </div>
                    </div>
                )}

                {/* Crop Selector */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">Select Crop</h2>
                    {isLoading ? (
                        <p className="text-gray-500">Loading crops...</p>
                    ) : (
                        <Select onValueChange={(val) => updateCrop(val)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a crop" />
                            </SelectTrigger>
                            <SelectContent>
                                {data?.results.map((crop) => (
                                    <SelectItem key={crop.id} value={crop.id.toString()}>
                                        <div className="flex justify-center items-center" >
                                            <Image alt="crop" src={crop.image} height={20} width={20} className="rounded-full" />
                                            <p className="font-bold ml-4 text-sm" >{crop.name}</p>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
