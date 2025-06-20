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
    title: "冷启动发动机失火 - P0301故障码",
    description: "客户报告仅在冷启动时出现怠速不稳和发动机失火...",
    vin: "WBAVA31010NM12345",
    brand: "宝马",
    model: "3系",
    system: "发动机",
    status: "answered",
    submittedAt: "2024-01-15T10:30:00Z",
    submittedBy: "tech_zhang_01",
    answeredBy: "宝马工程师刘",
    tags: ["P0301", "冷启动", "失火"],
  },
  {
    id: "2",
    title: "D档位变速箱换挡延迟",
    description: "自动变速箱从P档到D档显示延迟接合...",
    vin: "LSGHE52U0EH123456",
    brand: "雷克萨斯",
    model: "ES 350",
    system: "变速箱",
    status: "ai-assisted",
    submittedAt: "2024-01-14T14:20:00Z",
    submittedBy: "tech_wang_05",
    answeredBy: "AI助手",
    tags: ["变速箱", "换挡延迟", "ATF"],
  },
  {
    id: "3",
    title: "ABS警告灯间歇性亮起",
    description: "ABS警告灯在行驶过程中随机亮起...",
    vin: "JH4KA8260MC123789",
    brand: "讴歌",
    model: "TLX",
    system: "制动",
    status: "pending",
    submittedAt: "2024-01-14T09:15:00Z",
    submittedBy: "tech_li_03",
    tags: ["ABS", "警告灯", "间歇性"],
  },
]

const sortByDateDesc = (a: Question, b: Question) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()

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
    const combined = [...mockQuestions, ...stored].sort(sortByDateDesc)
    setQuestions(combined)
    setFilteredQuestions(combined)
  }, [])

  // NEW_FILTER_EFFECT_START
  // Automatically apply filters whenever search query or any filter changes
  useEffect(() => {
    filterQuestions(searchQuery, brandFilter, systemFilter, statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, brandFilter, systemFilter, statusFilter, questions])
  // NEW_FILTER_EFFECT_END

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

    setFilteredQuestions(filtered.sort(sortByDateDesc))
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
              <h1 className="text-xl font-bold text-gray-900">汽车技术问答</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/ask">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Wrench className="w-4 h-4 mr-2" />
                  提问
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">专业汽车技术支持</h2>
          <p className="text-lg text-gray-600 mb-8">
            连接OEM工程师，获取复杂汽车问题的专家解决方案
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="按关键词、VIN码或问题描述搜索..."
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
            <span className="text-sm font-medium text-gray-700">筛选:</span>
          </div>

          <Select value={brandFilter} onValueChange={(value: string) => setBrandFilter(value === "all" ? "" : value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="品牌" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有品牌</SelectItem>
              <SelectItem value="宝马">宝马</SelectItem>
              <SelectItem value="雷克萨斯">雷克萨斯</SelectItem>
              <SelectItem value="讴歌">讴歌</SelectItem>
              <SelectItem value="奔驰">奔驰</SelectItem>
              <SelectItem value="奥迪">奥迪</SelectItem>
            </SelectContent>
          </Select>

          <Select value={systemFilter} onValueChange={(value: string) => setSystemFilter(value === "all" ? "" : value)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="系统" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有系统</SelectItem>
              <SelectItem value="发动机">发动机</SelectItem>
              <SelectItem value="变速箱">变速箱</SelectItem>
              <SelectItem value="制动">制动</SelectItem>
              <SelectItem value="电气">电气</SelectItem>
              <SelectItem value="悬挂">悬挂</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value === "all" ? "" : value)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有状态</SelectItem>
              <SelectItem value="answered">已回答</SelectItem>
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="ai-assisted">AI协助</SelectItem>
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
              清除筛选
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
                      <span className="capitalize">
                        {question.status === "answered" ? "已回答" : 
                         question.status === "pending" ? "待处理" : 
                         question.status === "ai-assisted" ? "AI协助" : question.status}
                      </span>
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
                      <span>回答者: {question.answeredBy}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {question.system}
                  </Badge>
                  {question.tags.map((tag: string) => (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到问题</h3>
            <p className="text-gray-600">请尝试调整搜索条件或筛选器。</p>
          </div>
        )}
      </main>
    </div>
  )
}
