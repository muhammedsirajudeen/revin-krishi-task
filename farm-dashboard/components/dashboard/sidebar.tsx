"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Calendar, CheckSquare, Home, Leaf, MapPin, Settings, Tractor, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function DashboardSidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex flex-col gap-2 p-4">
        <DashboardNav />
      </div>
    </aside>
  )
}

interface NavProps {
  setOpen?: (open: boolean) => void
}

export function DashboardNav({ setOpen }: NavProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Farms",
      icon: Tractor,
      href: "/dashboard/farms",
      active: pathname === "/dashboard/farms",
    },
    {
      label: "Tasks",
      icon: CheckSquare,
      href: "/dashboard/tasks",
      active: pathname === "/dashboard/tasks",
    },
    {
      label: "Calendar",
      icon: Calendar,
      href: "/dashboard/calendar",
      active: pathname === "/dashboard/calendar",
    },
    {
      label: "Team",
      icon: Users,
      href: "/dashboard/team",
      active: pathname === "/dashboard/team",
    },
  ]

  return (
    <nav className="grid gap-2 px-2">
      {routes.map((route) => (
        <a
          key={route.href}
          href={route.href}
          onClick={() => {
            if (setOpen) setOpen(false)
          }}
        >
          <Button
            variant={route.active ? "secondary" : "ghost"}
            className={cn("w-full justify-start", {
              "bg-muted": route.active,
            })}
          >
            <route.icon className="mr-2 h-5 w-5" />
            {route.label}
          </Button>
        </a>
      ))}
    </nav>
  )
}
