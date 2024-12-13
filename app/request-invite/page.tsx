"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RequestInvite() {
  const [formData, setFormData] = useState({
    email: '',
    platform: '',
    username: '',
    followers: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/invite-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Request failed');

      setStatus('success');
      setFormData({ email: '', platform: '', username: '', followers: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="container max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Request an Invite
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'success' ? (
            <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg text-center">
              <p className="text-green-700 dark:text-green-100">
                Thanks for your request! We'll review it and get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platform">Platform (YouTube, Instagram, etc.)</Label>
                <Input
                  id="platform"
                  type="text"
                  required
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username/Channel Name</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="followers">Follower Count</Label>
                <Input
                  id="followers"
                  type="number"
                  required
                  value={formData.followers}
                  onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Submitting...' : 'Request Invite'}
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