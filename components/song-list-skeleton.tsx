import { Card, CardContent } from "@/components/ui/card"

export function SongListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-muted rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>

            <div className="mb-4">
              <div className="h-12 bg-muted rounded-lg mb-3" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 h-2 bg-muted rounded" />
                <div className="w-16 h-3 bg-muted rounded" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="w-16 h-5 bg-muted rounded" />
              <div className="w-20 h-3 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
