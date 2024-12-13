import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PrismaClient } from '@prisma/client'
import { DataTable } from '@/components/data-table'

const prisma = new PrismaClient()

export default async function Home() {
  const submissions = await prisma.submission.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Calculate detailed statistics
  const stats = {
    totalDeals: submissions.length,
    totalValue: submissions.reduce((acc, sub) => acc + sub.amount, 0),
    averageAmount: submissions.reduce((acc, sub) => acc + sub.amount, 0) / submissions.length,
    platforms: [...new Set(submissions.map(s => s.platform))].length,
    categories: [...new Set(submissions.map(s => s.category))].length,
    averageFollowers: Math.round(submissions.reduce((acc, sub) => acc + sub.followerCount, 0) / submissions.length),
    recentTrend: submissions.slice(0, 10).reduce((acc, sub) => acc + sub.amount, 0) / 10,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
    }).format(amount)
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Deal Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.averageAmount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.recentTrend)}</div>
            <p className="text-xs text-muted-foreground">Avg. last 10 deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.platforms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(stats.averageFollowers)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Recent Brand Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={submissions} />
        </CardContent>
      </Card>
    </div>
  )
}