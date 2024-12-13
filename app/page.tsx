import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PrismaClient } from '@prisma/client'
import { DataTable } from '@/components/data-table'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ViewDealsButton from "@/components/view-deals-button"
import { EmptySubmission } from "./models/submission"

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
    <div className="container mx-auto space-y-8">
      {/* Hero Section */}
      <div className="pt-20 pb-10 text-center space-y-6">
        <h1 className="text-7xl md:text-6xl font-bold">
          Know Your Worth 💸
        </h1>
        <p className="text-md md:text-md text-muted-foreground md:max-w-xl mx-auto">
          Anonymous platform for creators to share and discover real sponsorship rates. No more guessing what to charge.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/request-invite">
            <Button size="lg" className="text-lg px-8">
              Join Waitlist
            </Button>
          </Link>
          <ViewDealsButton />
        </div>
      </div>

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
      <Card id="deals">
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