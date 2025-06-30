import React from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProfileInfo } from "@/components/profile-info"

export default function ProfilePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Profile
          </h1>
          <p className="text-muted-foreground">This is a public profile page.</p>
        </div>
        <ProfileInfo user={null} />
      </main>
    </div>
  )
}
