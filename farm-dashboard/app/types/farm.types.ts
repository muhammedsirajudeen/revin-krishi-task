export interface Farm {
    id: string; // UUID or database ID
    name: string;
    location: string;
    ownerId: string; // User ID of the farm owner
    sizeInAcres: number; // optional
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    description: string;
    image: string
}