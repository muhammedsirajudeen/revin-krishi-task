'use client'

import { useParams } from "next/navigation"

export default function IndividualPage() {
    const { id } = useParams()
    return (
        <p>{id}</p>
    )
}