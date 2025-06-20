"use client"

import React, { useState, type ChangeEvent, type FormEvent } from "react"
import type { Question } from "@/lib/types"

import { Car, Upload, X, CheckCircle, Loader2, Bot } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface VehicleInfo {
  brand: string
  model: string
  year: string
  engine: string
  transmission: string
  system: string[]
}

// Mock VIN lookup function
const lookupVIN = async (vin: string): Promise<VehicleInfo | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock VIN database
  const vinDatabase: Record<string, VehicleInfo> = {
    WBAVA31010NM12345: {
      brand: "宝马",
      model: "3系 (F30)",
      year: "2020",
      engine: "2.0L 涡轮增压直列四缸",
      transmission: "8速自动变速箱",
      system: ["发动机", "变速箱", "电气", "制动", "悬挂"],
    },
    LSGHE52U0EH123456: {
      brand: "雷克萨斯",
      model: "ES 350",
      year: "2019",
      engine: "3.5L V6",
      transmission: "8速自动变速箱",
      system: ["发动机", "变速箱", "电气", "制动", "悬挂"],
    },
    JH4KA8260MC123789: {
      brand: "讴歌",
      model: "TLX",
      year: "2021",
      engine: "2.0L 涡轮增压直列四缸",
      transmission: "10速自动变速箱",
      system: ["发动机", "变速箱", "电气", "制动", "悬挂"],
    },
  }

  return vinDatabase[vin] || null
}

export default function AskQuestionPage() {
  const [vin, setVin] = useState("")
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [vinError, setVinError] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedSystem, setSelectedSystem] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()

  const handleVinLookup = async () => {
    if (vin.length < 17) {
      setVinError("VIN码必须是17位字符")
      return
    }

    setIsLookingUp(true)
    setVinError("")

    try {
      const info = await lookupVIN(vin)
      if (info) {
        setVehicleInfo(info)
        setVinError("")
      } else {
        setVinError("未找到车辆信息。请验证VIN码。")
        setVehicleInfo(null)
      }
    } catch (error) {
      setVinError("查找车辆信息时出错。请重试。")
      setVehicleInfo(null)
    } finally {
      setIsLookingUp(false)
    }
  }

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(event.target.files || [])
    setUploadedFiles((prev: File[]) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev: File[]) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Build new question record
    const newQuestion: Question = {
      id: Date.now().toString(),
      title,
      description,
      vin,
      brand: vehicleInfo?.brand || "Unknown",
      model: vehicleInfo?.model || "",
      system: selectedSystem,
      status: "pending",
      submittedAt: new Date().toISOString(),
      submittedBy: "tech_zhang_01",
      tags: [],
    }

    // Persist to localStorage so that homepage can retrieve it
    try {
      const stored = JSON.parse(localStorage.getItem("questions") || "[]") as Question[]
      localStorage.setItem("questions", JSON.stringify([...stored, newQuestion]))
    } catch (error) {
      // Fallback: overwrite if parsing fails
      localStorage.setItem("questions", JSON.stringify([newQuestion]))
    }

    // Show success message in Chinese
    alert("问题提交成功！您将被重定向到主页。")

    // Navigate back to homepage, where the new question will appear
    router.push("/")
  }

  const generateAISuggestions = async (title: string, description: string, system: string) => {
    if (!title.trim() && !description.trim()) {
      setAiSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsGeneratingSuggestions(true)
    setShowSuggestions(true)

    // Simulate AI API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock AI suggestions based on input
    const suggestions = []
    const input = `${title} ${description} ${system}`.toLowerCase()

    if (input.includes("misfire") || input.includes("p0301")) {
      suggestions.push("检查1号气缸的点火线圈和火花塞")
      suggestions.push("检查喷油器的喷射模式")
      suggestions.push("验证所有气缸的压缩比")
    }

    if (input.includes("transmission") || input.includes("shift")) {
      suggestions.push("检查变速箱油位和状况")
      suggestions.push("检查变速箱控制模块的错误码")
      suggestions.push("测试电磁阀操作")
    }

    if (input.includes("abs") || input.includes("brake")) {
      suggestions.push("检查ABS轮速传感器的正常工作")
      suggestions.push("检查制动液位和质量")
      suggestions.push("验证ABS模块连接")
    }

    if (input.includes("engine") && input.includes("cold")) {
      suggestions.push("检查发动机冷却液温度传感器")
      suggestions.push("检查节温器操作")
      suggestions.push("验证冷启动燃油加浓系统")
    }

    if (suggestions.length === 0) {
      suggestions.push("执行全面诊断扫描")
      suggestions.push("检查该车辆的相关服务公告")
      suggestions.push("验证受影响系统中的所有电气连接")
    }

    setAiSuggestions(suggestions)
    setIsGeneratingSuggestions(false)
  }

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "title":
        setTitle(value)
        break
      case "description":
        setDescription(value)
        break
      case "system":
        setSelectedSystem(value)
        break
    }

    // Debounce AI suggestions
    setTimeout(() => {
      if (field === "title" || field === "description" || field === "system") {
        const currentTitle = field === "title" ? value : title
        const currentDescription = field === "description" ? value : description
        const currentSystem = field === "system" ? value : selectedSystem
        generateAISuggestions(currentTitle, currentDescription, currentSystem)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Car className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">汽车技术问答</h1>
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>tech_zhang_01</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">提交技术问题</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* VIN Lookup */}
                  <div className="space-y-2">
                    <Label htmlFor="vin">车辆识别号 (VIN)</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="vin"
                        type="text"
                        placeholder="输入17位VIN码"
                        value={vin}
                        onChange={(e) => setVin(e.target.value.toUpperCase())}
                        maxLength={17}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleVinLookup}
                        disabled={isLookingUp || vin.length !== 17}
                        className="px-6"
                      >
                        {isLookingUp ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "查找"
                        )}
                      </Button>
                    </div>
                    {vinError && (
                      <Alert>
                        <AlertDescription className="text-red-600">{vinError}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Vehicle Info Display */}
                  {vehicleInfo && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="font-medium text-green-800">车辆信息已找到</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">品牌:</span> {vehicleInfo.brand}
                        </div>
                        <div>
                          <span className="font-medium">型号:</span> {vehicleInfo.model}
                        </div>
                        <div>
                          <span className="font-medium">年份:</span> {vehicleInfo.year}
                        </div>
                        <div>
                          <span className="font-medium">发动机:</span> {vehicleInfo.engine}
                        </div>
                        <div>
                          <span className="font-medium">变速箱:</span> {vehicleInfo.transmission}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Question Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">问题标题</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="简要描述问题..."
                      value={title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  {/* System Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="system">相关系统</Label>
                    <Select value={selectedSystem} onValueChange={(value) => handleInputChange("system", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择相关系统" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleInfo?.system.map((sys) => (
                          <SelectItem key={sys} value={sys}>
                            {sys}
                          </SelectItem>
                        )) || [
                          "发动机",
                          "变速箱",
                          "电气",
                          "制动",
                          "悬挂",
                          "空调",
                          "其他",
                        ].map((sys) => (
                          <SelectItem key={sys} value={sys}>
                            {sys}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Question Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">详细描述</Label>
                    <Textarea
                      id="description"
                      placeholder="详细描述问题症状、已尝试的解决方案、错误码等..."
                      value={description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label>附件 (可选)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">拖拽文件到此处或点击上传</p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.jpg,.jpeg,.png,.txt"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm">
                          选择文件
                        </Button>
                      </label>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">已上传文件:</p>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        提交中...
                      </>
                    ) : (
                      "提交问题"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* AI Suggestions Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span>AI诊断建议</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGeneratingSuggestions ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>生成建议中...</span>
                  </div>
                ) : showSuggestions && aiSuggestions.length > 0 ? (
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    开始输入问题描述，AI将提供相关诊断建议
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">提交提示</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• 提供详细的症状描述</p>
                  <p>• 包含相关的错误码</p>
                  <p>• 说明已尝试的解决方案</p>
                  <p>• 上传相关的诊断报告或图片</p>
                  <p>• 指定具体的车辆系统和型号</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
