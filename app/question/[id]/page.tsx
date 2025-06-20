"use client"

import type React from "react"

import { useState } from "react"
import { Car, User, Bot, Clock, ThumbsUp, MessageCircle, Lightbulb, FileText, ImageIcon, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { Label } from "@/components/ui/label"

interface Message {
  id: string
  author: string
  role: "technician" | "engineer" | "ai"
  content: string
  timestamp: string
  attachments?: string[]
}

interface AIsuggestion {
  id: string
  type: "diagnostic" | "reference" | "similar"
  title: string
  content: string
}

const mockQuestion = {
  id: "1",
  title: "冷启动发动机失火 - P0301故障码",
  description:
    "客户报告仅在冷启动时出现怠速不稳和发动机失火。问题主要发生在早晨或车辆停放数小时后。热车运行时无问题。诊断扫描显示P0301 - 检测到1号气缸失火。",
  vin: "WBAVA31010NM12345",
  brand: "宝马",
  model: "3系 (F30)",
  year: "2020",
  system: "发动机",
  status: "answered",
  submittedAt: "2024-01-15T10:30:00Z",
  submittedBy: "tech_zhang_01",
  tags: ["P0301", "冷启动", "失火"],
}

const mockMessages: Message[] = [
  {
    id: "1",
    author: "tech_zhang_01",
    role: "technician",
    content:
      "客户报告仅在冷启动时出现怠速不稳和发动机失火。问题主要发生在早晨或车辆停放数小时后。热车运行时无问题。诊断扫描显示P0301 - 检测到1号气缸失火。\n\n已采取的步骤:\n- 检查火花塞（外观正常）\n- 验证燃油压力（在规格范围内）\n- 未检测到明显的真空泄漏",
    timestamp: "2024-01-15T10:30:00Z",
    attachments: ["diagnostic_report.pdf", "engine_bay.jpg"],
  },
  {
    id: "2",
    author: "宝马工程师刘",
    role: "engineer",
    content:
      "感谢您提供的详细信息。根据症状和冷启动特有的P0301故障码，这很可能与直喷发动机进气门积碳有关，这是常见问题。\n\n推荐的诊断步骤:\n1. 执行气缸压缩测试\n2. 使用内窥镜检查进气门积碳情况\n3. 验证1号气缸喷油器喷射模式\n4. 测试点火线圈电阻和火花塞间隙\n\n如果确认积碳，建议进行进气门清洁服务。",
    timestamp: "2024-01-15T14:20:00Z",
  },
  {
    id: "3",
    author: "tech_zhang_01",
    role: "technician",
    content:
      "感谢您的指导。执行了内窥镜检查并确认进气门有显著积碳。压缩测试显示1号气缸145 psi，其他气缸165 psi。\n\n将进行进气门清洁服务。是否也应该向客户推荐预防性维护计划？",
    timestamp: "2024-01-15T16:45:00Z",
  },
  {
    id: "4",
    author: "宝马工程师刘",
    role: "engineer",
    content:
      "出色的诊断！是的，一定要推荐:\n- 使用顶级汽油\n- 每30,000英里定期进气清洁\n- 考虑每5,000英里添加燃油系统清洁剂\n\n这应该能解决当前问题并防止未来发生。清洁服务后请更新结果。",
    timestamp: "2024-01-15T17:30:00Z",
  },
]

const mockAISuggestions: AIsuggestion[] = [
  {
    id: "1",
    type: "diagnostic",
    title: "P0301常见诊断步骤",
    content:
      "对于宝马F30发动机的P0301故障码，检查：1）点火线圈电阻，2）进气门积碳，3）喷油器流量，4）压缩测试结果",
  },
  {
    id: "2",
    type: "reference",
    title: "宝马服务公告",
    content:
      "宝马SIB B13 02 19：N20/N26发动机进气门积碳。建议使用核桃壳喷砂清洁。",
  },
  {
    id: "3",
    type: "similar",
    title: "类似案例",
    content:
      "过去6个月解决了15个类似案例。80%为积碳相关，15%点火线圈故障，5%喷油器问题。",
  },
]

export default function QuestionPage() {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)
  const [replyAttachments, setReplyAttachments] = useState<File[]>([])

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      author: "宝马工程师刘",
      role: "engineer",
      content: newMessage,
      timestamp: new Date().toISOString(),
      attachments: replyAttachments.length > 0 ? replyAttachments.map((f) => f.name) : undefined,
    }

    setMessages([...messages, message])
    setNewMessage("")
    setReplyAttachments([])
  }

  const handleReplyFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setReplyAttachments((prev) => [...prev, ...files])
  }

  const removeReplyFile = (index: number) => {
    setReplyAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "engineer":
        return <User className="w-4 h-4" />
      case "technician":
        return <Car className="w-4 h-4" />
      case "ai":
        return <Bot className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "engineer":
        return "bg-blue-100 text-blue-800"
      case "technician":
        return "bg-green-100 text-green-800"
      case "ai":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Car className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">汽车技术问答</h1>
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>宝马工程师刘</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-xl">{mockQuestion.title}</CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    <User className="w-4 h-4 mr-1" />
                    已回答
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Car className="w-4 h-4" />
                    <span>
                      {mockQuestion.brand} {mockQuestion.model} ({mockQuestion.year})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>VIN: {mockQuestion.vin.slice(-6)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(mockQuestion.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>提交者: {mockQuestion.submittedBy}</span>
                  </div>
                </div>

                <p className="text-gray-700 mt-4">{mockQuestion.description}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline">{mockQuestion.system}</Badge>
                  {mockQuestion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Messages */}
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={getRoleColor(message.role)}>
                          {getRoleIcon(message.role)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{message.author}</span>
                          <Badge className={getRoleColor(message.role)} size="sm">
                            {message.role === "engineer" ? "工程师" : 
                             message.role === "technician" ? "技师" : 
                             message.role === "ai" ? "AI" : message.role}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded text-xs"
                              >
                                <FileText className="w-3 h-3" />
                                <span>{attachment}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Reply Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">回复</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitMessage} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reply">消息</Label>
                    <Textarea
                      id="reply"
                      placeholder="输入您的回复..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* File Upload for Reply */}
                  <div className="space-y-2">
                    <Label>附件 (可选)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">上传图片、视频或诊断报告</p>
                      <input
                        type="file"
                        multiple
                        onChange={handleReplyFileUpload}
                        className="hidden"
                        id="reply-file-upload"
                        accept=".pdf,.jpg,.jpeg,.png,.txt"
                      />
                      <label htmlFor="reply-file-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm">
                          选择文件
                        </Button>
                      </label>
                    </div>
                    {replyAttachments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">已上传文件:</p>
                        {replyAttachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeReplyFile(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="submit" disabled={!newMessage.trim()}>
                      发送回复
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>AI建议</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAISuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge
                        variant={
                          suggestion.type === "diagnostic"
                            ? "default"
                            : suggestion.type === "reference"
                            ? "secondary"
                            : "outline"
                        }
                        size="sm"
                      >
                        {suggestion.type === "diagnostic" ? "诊断" : 
                         suggestion.type === "reference" ? "参考" : 
                         suggestion.type === "similar" ? "类似" : suggestion.type}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                    <p className="text-xs text-gray-600">{suggestion.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  标记为已解决
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  请求更多信息
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  生成服务报告
                </Button>
              </CardContent>
            </Card>

            {/* Related Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">相关问题</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium text-sm mb-1">宝马N20发动机冷启动问题</h4>
                  <p className="text-xs text-gray-600">3个回复 • 2天前</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium text-sm mb-1">P0301故障码诊断流程</h4>
                  <p className="text-xs text-gray-600">8个回复 • 1周前</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium text-sm mb-1">进气门积碳清洁方法</h4>
                  <p className="text-xs text-gray-600">12个回复 • 2周前</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
