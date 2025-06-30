"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Calendar, Shield } from "lucide-react"
import { User } from "@/components/ui/user" // Renamed import to avoid redeclaration

interface ProfileInfoProps {
  user: any // Updated type to any to avoid conflict with imported User component
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name || user.email.split("@")[0]}</h2>
              <Badge variant="secondary" className="mt-1">
                <Shield className="h-3 w-3 mr-1" />
                Basic User
              </Badge>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Member since</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
