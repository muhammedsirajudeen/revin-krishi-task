import Link from "next/link"
import { ArrowRight, BarChart3, Calendar, CheckCircle, Leaf, MapPin, Tractor } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">FarmDash</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-1 flex-col items-center justify-center gap-6 py-12 text-center md:py-20">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Manage Your Farm <span className="text-green-600">Smarter</span>
        </h1>
        <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
          Streamline your agricultural operations with our comprehensive farm management dashboard. Track crops,
          schedule tasks, and analyze performance all in one place.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/auth/register">
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-12 md:py-20">
        <div className="mx-auto mb-12 max-w-[58rem] text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Powerful Features for Modern Farming</h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to manage your agricultural business efficiently
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Tractor className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Farm Management</h3>
            <p className="text-muted-foreground">
              Track all your farms, fields, and crops in one centralized dashboard.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Task Scheduling</h3>
            <p className="text-muted-foreground">Create and assign tasks to your team with deadlines and priorities.</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Analytics & Insights</h3>
            <p className="text-muted-foreground">
              Visualize your farms performance with interactive charts and reports.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Status Tracking</h3>
            <p className="text-muted-foreground">
              Monitor the progress of all your agricultural projects in real-time.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Field Mapping</h3>
            <p className="text-muted-foreground">
              Visualize your fields and track crop rotation and planting schedules.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Crop Management</h3>
            <p className="text-muted-foreground">Track growth stages, treatments, and harvests for all your crops.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-50 py-12 md:py-20">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to transform your farm management?
          </h2>
          <p className="mx-auto mb-8 max-w-[42rem] text-muted-foreground">
            Join thousands of farmers who are already using FarmDash to streamline their operations.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="gap-2">
              Get Started Today
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <span className="text-lg font-bold">FarmDash</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">© 2024 FarmDash. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
