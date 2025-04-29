import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation Schema
const farmSchema = z.object({
    name: z.string().min(1, 'Farm name is required'),
    location: z.string().min(1, 'Location is required'),
    sizeInAcres: z.number().min(1, 'Size in acres must be greater than 0').optional(),
    description: z.string().min(1, 'Description is required'),
});

type FarmFormData = z.infer<typeof farmSchema>;

const FarmCreationDialog = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Provide initial default values to ensure controlled input behavior
    const { control, handleSubmit, formState: { errors }, reset } = useForm<FarmFormData>({
        resolver: zodResolver(farmSchema),
        defaultValues: {
            name: '',
            location: '',
            sizeInAcres: undefined,
            description: '',
        },
    });

    const onSubmit = (data: FarmFormData) => {
        console.log('Farm Created: ', data);
        reset(); // Clear form after submission
        setIsOpen(false); // Close the dialog
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-500 text-white hover:bg-blue-600">Create Farm</Button>
                </DialogTrigger>
                <DialogContent className="w-[400px] p-6">
                    <DialogHeader>
                        <h2 className="text-lg font-semibold">Create a New Farm</h2>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Farm Name</label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        id="name"
                                        {...field}
                                        placeholder="Farm Name"
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            />
                            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <Controller
                                name="location"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        id="location"
                                        {...field}
                                        placeholder="Location"
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            />
                            {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="sizeInAcres" className="block text-sm font-medium text-gray-700">Size in Acres</label>
                            <Controller
                                name="sizeInAcres"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        id="sizeInAcres"
                                        {...field}
                                        type="number"
                                        placeholder="Size in Acres"
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            />
                            {errors.sizeInAcres && <p className="text-sm text-red-600 mt-1">{errors.sizeInAcres.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        id="description"
                                        {...field}
                                        placeholder="Farm Description"
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            />
                            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
                        </div>

                        <DialogFooter className="flex justify-between">
                            <Button
                                variant="secondary"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                            >
                                Create Farm
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FarmCreationDialog;
