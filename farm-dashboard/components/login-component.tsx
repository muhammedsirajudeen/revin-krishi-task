'use client'
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/helper/axiosInstance";
import Link from "next/link";

export default function LoginComponent() {
    const [loading, setLoading] = useState(true)
    const [loggedIn, setLoggedin] = useState(false)
    const router = useRouter()
    useEffect(() => {
        async function userVerifier() {
            try {
                await axiosInstance.post('/user/token/verify',
                    {
                        token: window.localStorage.getItem('token')
                    }
                )
                setLoggedin(true)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        userVerifier()

    }, [])
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
        );
    } return (
        <div className="flex items-center gap-4 h-full justify-center">
            {
                loggedIn ?
                    <Link href="/dashboard">
                        <Button variant="outline">Dashboard</Button>
                    </Link>
                    :
                    <>
                        <Link href="/auth/login">
                            <Button variant="outline">Login</Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button>Sign Up</Button>
                        </Link>
                    </>
            }
        </div>
    )
}