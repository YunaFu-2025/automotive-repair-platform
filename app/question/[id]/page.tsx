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
  title: "Engine misfire on cold start - P0301 code",
  description:
    "Customer reports rough idle and engine misfire only during cold starts. The issue occurs primarily in the morning or after the vehicle has been parked for several hours. No issues during warm operation. Diagnostic scan shows P0301 - Cylinder 1 Misfire Detected.",
  vin: "WBAVA31010NM12345",
  brand: "BMW",
  model: "3 Series (F30)",
  year: "2020",
  system: "Engine",
  status: "answered",
  submittedAt: "2024-01-15T10:30:00Z",
  submittedBy: "tech_zhang_01",
  tags: ["P0301", "Cold Start", "Misfire"],
}

const mockMessages: Message[] = [
  {
    id: "1",
    author: "tech_zhang_01",
    role: "technician",
    content:
      "Customer reports rough idle and engine misfire only during cold starts. The issue occurs primarily in the morning or after the vehicle has been parked for several hours. No issues during warm operation. Diagnostic scan shows P0301 - Cylinder 1 Misfire Detected.\n\nSteps already taken:\n- Checked spark plugs (appear normal)\n- Verified fuel pressure (within spec)\n- No obvious vacuum leaks detected",
    timestamp: "2024-01-15T10:30:00Z",
    attachments: ["diagnostic_report.pdf", "engine_bay.jpg"],
  },
  {
    id: "2",
    author: "BMW Engineer Liu",
    role: "engineer",
    content:
      "Thank you for the detailed information. Based on the symptoms and P0301 code specific to cold starts, this is likely related to carbon buildup on the intake valves, which is common in direct injection engines.\n\nRecommended diagnostic steps:\n1. Perform cylinder compression test\n2. Check intake valve carbon deposits using borescope\n3. Verify injector spray pattern for cylinder 1\n4. Test ignition coil resistance and spark plug gap\n\nIf carbon buildup is confirmed, recommend intake valve cleaning service.",
    timestamp: "2024-01-15T14:20:00Z",
  },
  {
    id: "3",
    author: "tech_zhang_01",
    role: "technician",
    content:
      "Thank you for the guidance. Performed borescope inspection and confirmed significant carbon buildup on intake valves. Compression test shows cylinder 1 at 145 psi vs 165 psi on other cylinders.\n\nWill proceed with intake valve cleaning service. Should I also recommend preventive maintenance schedule to customer?",
    timestamp: "2024-01-15T16:45:00Z",
  },
  {
    id: "4",
    author: "BMW Engineer Liu",
    role: "engineer",
    content:
      "Excellent diagnosis! Yes, definitely recommend:\n- Use of Top Tier gasoline\n- Periodic intake cleaning every 30,000 miles\n- Consider adding fuel system cleaner every 5,000 miles\n\nThis should resolve the current issue and prevent future occurrences. Please update with results after the cleaning service.",
    timestamp: "2024-01-15T17:30:00Z",
  },
]

const mockAISuggestions: AIsuggestion[] = [
  {
    id: "1",
    type: "diagnostic",
    title: "Common P0301 Diagnostic Steps",
    content:
      "For P0301 codes on BMW F30 engines, check: 1) Ignition coil resistance, 2) Carbon deposits on intake valves, 3) Fuel injector flow rate, 4) Compression test results",
  },
  {
    id: "2",
    type: "reference",
    title: "BMW Service Bulletin",
    content:
      "BMW SIB B13 02 19: Carbon deposits on intake valves in N20/N26 engines. Recommends walnut shell blasting for cleaning.",
  },
  {
    id: "3",
    type: "similar",
    title: "Similar Cases",
    content:
      "15 similar cases resolved in the past 6 months. 80% were carbon-related, 15% ignition coil failure, 5% fuel injector issues.",
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
      author: "BMW Engineer Liu",
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
              <h1 className="text-xl font-bold text-gray-900">AutoTech Q&A</h1>
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>BMW Engineer Liu</span>
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
                    Answered
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Car className="w-4 h-4" />
                    <span>
                      {mockQuestion.brand} {mockQuestion.model} ({mockQuestion.year})
                    </span>
                  </div>
                  <div>VIN: {mockQuestion.vin}</div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(mockQuestion.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <div>By: {mockQuestion.submittedBy}</div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline">{mockQuestion.system}</Badge>
                  {mockQuestion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{mockQuestion.description}</p>
              </CardContent>
            </Card>

            {/* Conversation Thread */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Technical Discussion</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className="flex space-x-4">
                    <Avatar>
                      <AvatarFallback className={getRoleColor(message.role)}>
                        {getRoleIcon(message.role)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{message.author}</span>
                        <Badge variant="outline" className="text-xs">
                          {message.role}
                        </Badge>
                        <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</span>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-line">{message.content}</p>

                        {message.attachments && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
                              >
                                {attachment.endsWith(".pdf") ? (
                                  <FileText className="w-3 h-3" />
                                ) : (
                                  <ImageIcon className="w-3 h-3" />
                                )}
                                <span>{attachment}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 mt-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Reply Form */}
                <form onSubmit={handleSubmitMessage} className="border-t pt-6">
                  <div className="flex space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Provide additional technical guidance or ask follow-up questions..."
                        rows={4}
                      />

                      {/* File Upload */}
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*,.pdf,.txt,.doc,.docx"
                          onChange={handleReplyFileUpload}
                          className="hidden"
                          id="reply-file-upload"
                        />
                        <Label htmlFor="reply-file-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Attach Files
                          </Button>
                        </Label>
                      </div>

                      {/* Uploaded Files Display */}
                      {replyAttachments.length > 0 && (
                        <div className="space-y-2">
                          {replyAttachments.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                            >
                              <div className="flex items-center space-x-2">
                                {file.type.startsWith("image/") ? (
                                  <ImageIcon className="w-4 h-4 text-blue-500" />
                                ) : file.type.startsWith("video/") ? (
                                  <FileText className="w-4 h-4 text-green-500" />
                                ) : (
                                  <FileText className="w-4 h-4 text-gray-500" />
                                )}
                                <span className="text-gray-700">{file.name}</span>
                                <span className="text-gray-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                              </div>
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeReplyFile(index)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button type="submit" disabled={!newMessage.trim()}>
                          Post Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistance Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <span>AI Assistance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAISuggestions.map((suggestion) => (
                  <Alert key={suggestion.id} className="border-blue-200 bg-blue-50">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <AlertDescription>
                      <div className="font-medium text-blue-800 mb-1">{suggestion.title}</div>
                      <p className="text-blue-700 text-sm">{suggestion.content}</p>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>

            {/* Vehicle Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Car className="w-5 h-5" />
                  <span>Vehicle Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Brand:</strong> {mockQuestion.brand}
                </div>
                <div>
                  <strong>Model:</strong> {mockQuestion.model}
                </div>
                <div>
                  <strong>Year:</strong> {mockQuestion.year}
                </div>
                <div>
                  <strong>VIN:</strong> {mockQuestion.vin}
                </div>
                <div>
                  <strong>System:</strong> {mockQuestion.system}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
