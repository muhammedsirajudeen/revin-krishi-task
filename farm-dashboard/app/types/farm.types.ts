import { CamelCaseToSnakeCase } from "@/lib/utils";

export interface User {
    id: string
    email: string
}
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
    manager: string; // User ID of the field manager
    sizeInAcres: number; // optional
    description: string;
    image: string;
    cropId: string
}

export interface Crop {
    id: string;         // Unique identifier for the crop
    name: string;       // Name of the crop (e.g., "Wheat", "Rice")
    image: string;      // URL or path to the crop's image
}

export interface JoinedField extends Omit<CamelCaseToSnakeCase<Field>, "manager" | "farm" | "manager" | "crop_id"> {
    crop: Crop
    manager: User
}
