"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type PageProps = {
    params: {
      code: string
    }
  }

export default function ProtectedSubmitPage({ params }: PageProps) {
  const router = useRouter()
  const [isValidInvite, setIsValidInvite] = useState<boolean | null>(null)
  const [inviteId, setInviteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    brandName: '',
    amount: '',
    currency: 'USD',
    platform: '',
    category: '',
    followerCount: '',
    description: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const verifyInvite = async () => {
      try {
        const response = await fetch(`/api/verify-invite/${params.code}`)
        const data = await response.json()
        
        setIsValidInvite(data.valid)
        if (data.valid) {
          setInviteId(data.inviteId)
        }
      } catch (error) {
        setIsValidInvite(false)
      }
    }

    verifyInvite()
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          inviteId
        }),
      })

      if (!response.ok) throw new Error('Submission failed')

      setStatus('success')
      // Mark invite as used
      await fetch(`/api/mark-invite-used/${params.code}`, { method: 'POST' })
    } catch (error) {
      setStatus('error')
    }
  }

  if (isValidInvite === null) {
    return <div>Verifying invite code...</div>
  }

  if (isValidInvite === false) {
    return (
      <div className="container max-w-md mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              This invite link is invalid or has already been used.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Submit Sponsorship Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'success' ? (
            <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg text-center">
              <p className="text-green-700 dark:text-green-100">
                Thanks for your submission!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  required
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  required
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Content Category</Label>
                <Input
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="followerCount">Follower Count</Label>
                <Input
                  id="followerCount"
                  type="number"
                  required
                  value={formData.followerCount}
                  onChange={(e) => setFormData({ ...formData, followerCount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details (optional)</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] p-2 border rounded"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add any additional context about the sponsorship deal..."
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Submitting...' : 'Submit'}
              </Button>

              {status === 'error' && (
                <p className="text-red-500 text-center">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 