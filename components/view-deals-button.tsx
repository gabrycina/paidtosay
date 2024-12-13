'use client'

import { Button } from "@/components/ui/button"

export default function ViewDealsButton() {
  return (
    <Button 
      size="lg" 
      variant="outline" 
      className="text-lg px-8"
      onClick={() => {
        document.getElementById('deals')?.scrollIntoView({ behavior: 'smooth' })
      }}
    >
      View Deals
    </Button>
  )
} 