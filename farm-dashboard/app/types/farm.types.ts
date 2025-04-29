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

export interface Field {
    id: string; // UUID or database ID
    name: string;
    farmId: string; // ID of the associated farm
    managerId: string; // User ID of the field manager
    sizeInAcres: number; // optional
    description: string;
    image: string;
}