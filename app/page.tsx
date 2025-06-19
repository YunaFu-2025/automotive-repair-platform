"use client"

import React, { useState, useEffect } from "react"
import { Search, Filter, Clock, User, Bot, Tag, Car, Wrench, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

import type { Question } from "@/lib/types"

const mockQuestions: Question[] = [
  {
    id: "1",
    title: "Engine misfire on cold start - P0301 code",
    description: "Customer reports rough idle and engine misfire only during cold starts...",
    vin: "WBAVA31010NM12345",
    brand: "BMW",
    model: "3 Series",
    system: "Engine",
    status: "answered",
    submittedAt: "2024-01-15T10:30:00Z",
    submittedBy: "tech_zhang_01",
    answeredBy: "BMW Engineer Liu",
    tags: ["P0301", "Cold Start", "Misfire"],
  },
  {
    id: "2",
    title: "Transmission shift delay in D mode",
    description: "Automatic transmission shows delayed engagement from P to D...",
    vin: "LSGHE52U0EH123456",
    brand: "Lexus",
    model: "ES 350",
    system: "Transmission",
    status: "ai-assisted",
    submittedAt: "2024-01-14T14:20:00Z",
    submittedBy: "tech_wang_05",
    answeredBy: "AI Assistant",
    tags: ["Transmission", "Shift Delay", "ATF"],
  },
  {
    id: "3",
    title: "ABS warning light intermittent",
    description: "ABS warning light comes on randomly during driving...",
    vin: "JH4KA8260MC123789",
    brand: "Acura",
    model: "TLX",
    system: "Braking",
    status: "pending",
    submittedAt: "2024-01-14T09:15:00Z",
    submittedBy: "tech_li_03",
    tags: ["ABS", "Warning Light", "Intermittent"],
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [brandFilter, setBrandFilter] = useState("")
  const [systemFilter, setSystemFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])

  // Load persisted questions from localStorage on initial render
  useEffect(() => {
    const stored: Question[] =
      typeof window !== "undefined" ? (JSON.parse(localStorage.getItem("questions") || "[]") as Question[]) : []
    const combined = [...mockQuestions, ...stored]
    setQuestions(combined)
    setFilteredQuestions(combined)
  }, [])

  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part: string, index: number) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterQuestions(query, brandFilter, systemFilter, statusFilter)
  }

  const filterQuestions = (search: string, brand: string, system: string, status: string) => {
    let filtered = questions

    if (search) {
      filtered = filtered.filter(
        (q: Question) =>
          q.title.toLowerCase().includes(search.toLowerCase()) ||
          q.description.toLowerCase().includes(search.toLowerCase()) ||
          q.vin.toLowerCase().includes(search.toLowerCase()) ||
          q.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase())),
      )
    }

    if (brand) {
      filtered = filtered.filter((q: Question) => q.brand === brand)
    }

    if (system) {
      filtered = filtered.filter((q: Question) => q.system === system)
    }

    if (status) {
      filtered = filtered.filter((q: Question) => q.status === status)
    }

    setFilteredQuestions(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "answered":
        return "bg-green-100 text-green-800"
      case "ai-assisted":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "answered":
        return <User className="w-4 h-4" />
      case "ai-assisted":
        return <Bot className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Car className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">AutoTech Q&A</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/ask">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Wrench className="w-4 h-4 mr-2" />
                  Ask Question
                </Button>
              </Link>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>tech_zhang_01</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Automotive Technical Support</h2>
          <p className="text-lg text-gray-600 mb-8">
            Connect with OEM engineers and get expert solutions for complex automotive issues
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by keywords, VIN, or issue description..."
              className="pl-10 pr-4 py-3 text-lg"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="BMW">BMW</SelectItem>
              <SelectItem value="Lexus">Lexus</SelectItem>
              <SelectItem value="Acura">Acura</SelectItem>
              <SelectItem value="Mercedes">Mercedes</SelectItem>
              <SelectItem value="Audi">Audi</SelectItem>
            </SelectContent>
          </Select>

          <Select value={systemFilter} onValueChange={setSystemFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="System" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Systems</SelectItem>
              <SelectItem value="Engine">Engine</SelectItem>
              <SelectItem value="Transmission">Transmission</SelectItem>
              <SelectItem value="Braking">Braking</SelectItem>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Suspension">Suspension</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="answered">Answered</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="ai-assisted">AI-Assisted</SelectItem>
            </SelectContent>
          </Select>

          {(brandFilter || systemFilter || statusFilter) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBrandFilter("")
                setSystemFilter("")
                setStatusFilter("")
                setFilteredQuestions(questions)
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question: Question) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                    <Link href={`/question/${question.id}`}>
                      {searchQuery ? highlightText(question.title, searchQuery) : question.title}
                    </Link>
                  </CardTitle>
                  <Badge className={getStatusColor(question.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(question.status)}
                      <span className="capitalize">{question.status.replace("-", " ")}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {searchQuery ? highlightText(question.description, searchQuery) : question.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Car className="w-4 h-4" />
                    <span>
                      {question.brand} {question.model}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>
                      VIN: {searchQuery ? highlightText(question.vin.slice(-6), searchQuery) : question.vin.slice(-6)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(question.submittedAt).toLocaleDateString()}</span>
                  </div>
                  {question.answeredBy && (
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Answered by {question.answeredBy}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {question.system}
                  </Badge>
                  {question.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {searchQuery ? highlightText(tag, searchQuery) : tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </main>
    </div>
  )
}
