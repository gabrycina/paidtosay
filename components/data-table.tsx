"use client"

import React from 'react'
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { ArrowUpDown, Check, ChevronDown, ChevronRight } from "lucide-react"
import { Submission } from '@/app/models/submission'

type SortConfig = {
  key: keyof Submission
  direction: 'asc' | 'desc'
}

const formatDate = (date: Date) => {
  return new Date(date).toISOString().split('T')[0];
}

export function DataTable({ data: initialData }: { data: Submission[] }) {
  const [data, setData] = useState(initialData)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' })
  const [filters, setFilters] = useState({
    platform: 'all',
    category: 'all',
    minAmount: '',
    maxAmount: ''
  })
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const platforms = [...new Set(initialData.map(item => item.platform))]
  const categories = [...new Set(initialData.map(item => item.category))]

  const handleSort = (key: keyof Submission) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[key]
      const bValue = b[key]
      
      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0
      if (aValue === undefined) return 1
      if (bValue === undefined) return -1

      // Handle null values
      if (aValue === null && bValue === null) return 0
      if (aValue === null) return 1
      if (bValue === null) return -1

      if (aValue < bValue) return direction === 'asc' ? -1 : 1
      if (aValue > bValue) return direction === 'asc' ? 1 : -1
      return 0
    })

    setData(sortedData)
  }

  const handleFilter = () => {
    let filteredData = [...initialData]

    if (filters.platform && filters.platform !== 'all') {
      filteredData = filteredData.filter(item => item.platform === filters.platform)
    }
    if (filters.category && filters.category !== 'all') {
      filteredData = filteredData.filter(item => item.category === filters.category)
    }
    if (filters.minAmount) {
      filteredData = filteredData.filter(item => item.amount >= Number(filters.minAmount))
    }
    if (filters.maxAmount) {
      filteredData = filteredData.filter(item => item.amount <= Number(filters.maxAmount))
    }

    setData(filteredData)
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id)
    } else {
      newExpandedRows.add(id)
    }
    setExpandedRows(newExpandedRows)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <div className="grid grid-rows-4 md:grid-cols-4 md:grid-rows-1 gap-4 flex-1">
          <Select
            value={filters.platform}
            onValueChange={(value) => setFilters({ ...filters, platform: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platforms.map(platform => (
                <SelectItem key={platform} value={platform}>{platform}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({ ...filters, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Min Amount"
            type="number"
            value={filters.minAmount}
            onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
          />

          <Input
            placeholder="Max Amount"
            type="number"
            value={filters.maxAmount}
            onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
          />
        </div>

        <Button onClick={handleFilter} className="flex gap-2">
          Apply Filters
          <Check className="h-4 w-4" />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('brandName')}>
                Brand <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('amount')}>
                Amount <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('followerCount')}>
                Followers <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('createdAt')}>
                Date <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((submission) => (
            <React.Fragment key={submission.id}>
              <TableRow>
                <TableCell>
                  {submission.description && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={() => toggleRow(submission.id)}
                    >
                      {expandedRows.has(submission.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </TableCell>
                <TableCell className="font-medium">{submission.brandName}</TableCell>
                <TableCell>{formatCurrency(submission.amount, submission.currency)}</TableCell>
                <TableCell>{submission.platform}</TableCell>
                <TableCell>{submission.category}</TableCell>
                <TableCell>{new Intl.NumberFormat().format(submission.followerCount)}</TableCell>
                <TableCell>{formatDate(new Date(submission.createdAt))}</TableCell>
              </TableRow>
              {expandedRows.has(submission.id) && submission.description && (
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell colSpan={6} className="bg-muted/50">
                    <div className="py-2">
                      <p className="text-sm text-muted-foreground">{submission.description}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
