"use client"

import type React from "react"

import { useState } from "react"
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
      brand: "BMW",
      model: "3 Series (F30)",
      year: "2020",
      engine: "2.0L Turbo I4",
      transmission: "8-Speed Automatic",
      system: ["Engine", "Transmission", "Electrical", "Braking", "Suspension"],
    },
    LSGHE52U0EH123456: {
      brand: "Lexus",
      model: "ES 350",
      year: "2019",
      engine: "3.5L V6",
      transmission: "8-Speed Automatic",
      system: ["Engine", "Transmission", "Electrical", "Braking", "Suspension"],
    },
    JH4KA8260MC123789: {
      brand: "Acura",
      model: "TLX",
      year: "2021",
      engine: "2.0L Turbo I4",
      transmission: "10-Speed Automatic",
      system: ["Engine", "Transmission", "Electrical", "Braking", "Suspension"],
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
      setVinError("VIN must be 17 characters long")
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
        setVinError("Vehicle not found. Please verify the VIN number.")
        setVehicleInfo(null)
      }
    } catch (error) {
      setVinError("Error looking up vehicle information. Please try again.")
      setVehicleInfo(null)
    } finally {
      setIsLookingUp(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Build a new question object
    const newQuestion = {
      id: Date.now().toString(),
      title,
      description,
      vin,
      brand: vehicleInfo?.brand || "",
      model: vehicleInfo?.model || "",
      system: selectedSystem,
      status: "pending" as const,
      submittedAt: new Date().toISOString(),
      submittedBy: "tech_zhang_01",
      answeredBy: undefined,
      tags: [] as string[],
    }

    try {
      const stored = JSON.parse(localStorage.getItem("questions") || "[]") as any[]
      stored.push(newQuestion)
      localStorage.setItem("questions", JSON.stringify(stored))
    } catch (error) {
      // If parsing fails, overwrite with current question
      localStorage.setItem("questions", JSON.stringify([newQuestion]))
    }

    // Brief delay to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsSubmitting(false)
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
      suggestions.push("Check ignition coils and spark plugs for cylinder 1")
      suggestions.push("Inspect fuel injectors for proper spray pattern")
      suggestions.push("Verify compression levels across all cylinders")
    }

    if (input.includes("transmission") || input.includes("shift")) {
      suggestions.push("Check transmission fluid level and condition")
      suggestions.push("Inspect transmission control module for error codes")
      suggestions.push("Test solenoid valve operation")
    }

    if (input.includes("abs") || input.includes("brake")) {
      suggestions.push("Check ABS wheel speed sensors for proper operation")
      suggestions.push("Inspect brake fluid level and quality")
      suggestions.push("Verify ABS module connections")
    }

    if (input.includes("engine") && input.includes("cold")) {
      suggestions.push("Check engine coolant temperature sensor")
      suggestions.push("Inspect thermostat operation")
      suggestions.push("Verify cold start fuel enrichment system")
    }

    if (suggestions.length === 0) {
      suggestions.push("Perform comprehensive diagnostic scan")
      suggestions.push("Check related service bulletins for this vehicle")
      suggestions.push("Verify all electrical connections in affected system")
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
              <h1 className="text-xl font-bold text-gray-900">AutoTech Q&A</h1>
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>tech_zhang_01</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ask a Technical Question</h2>
          <p className="text-gray-600">
            Provide detailed information about the vehicle issue to get expert assistance from OEM engineers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* VIN Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="w-5 h-5" />
                <span>Vehicle Identification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vin">VIN (Vehicle Identification Number) *</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="vin"
                    value={vin}
                    onChange={(e) => setVin(e.target.value.toUpperCase())}
                    placeholder="Enter 17-character VIN"
                    maxLength={17}
                    className="font-mono"
                    required
                  />
                  <Button type="button" onClick={handleVinLookup} disabled={vin.length !== 17 || isLookingUp}>
                    {isLookingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lookup"}
                  </Button>
                </div>
                {vinError && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{vinError}</AlertDescription>
                  </Alert>
                )}
              </div>

              {vehicleInfo && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    <div className="font-medium mb-2">Vehicle Information Retrieved:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <strong>Brand:</strong> {vehicleInfo.brand}
                      </div>
                      <div>
                        <strong>Model:</strong> {vehicleInfo.model}
                      </div>
                      <div>
                        <strong>Year:</strong> {vehicleInfo.year}
                      </div>
                      <div>
                        <strong>Engine:</strong> {vehicleInfo.engine}
                      </div>
                      <div>
                        <strong>Transmission:</strong> {vehicleInfo.transmission}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Question Details */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Form Fields */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="system">System Category *</Label>
                    <Select
                      value={selectedSystem}
                      onValueChange={(value) => handleInputChange("system", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select affected system" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleInfo?.system.map((sys) => (
                          <SelectItem key={sys} value={sys}>
                            {sys}
                          </SelectItem>
                        )) || (
                          <>
                            <SelectItem value="Engine">Engine</SelectItem>
                            <SelectItem value="Transmission">Transmission</SelectItem>
                            <SelectItem value="Electrical">Electrical</SelectItem>
                            <SelectItem value="Braking">Braking</SelectItem>
                            <SelectItem value="Suspension">Suspension</SelectItem>
                            <SelectItem value="HVAC">HVAC</SelectItem>
                            <SelectItem value="Body">Body & Interior</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Detailed Fault Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Provide detailed information about:
• Symptoms observed
• When the issue occurs
• Diagnostic codes (if any)
• Steps already taken
• Customer complaints"
                      rows={8}
                      required
                    />
                  </div>
                </div>

                {/* Right Column - AI Suggestions */}
                <div className="lg:col-span-1">
                  {showSuggestions && (
                    <div className="sticky top-4">
                      <Card className="border-blue-200 bg-blue-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center space-x-2 text-base">
                            <Bot className="w-5 h-5 text-blue-600" />
                            <span>AI Maintenance Suggestions</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isGeneratingSuggestions ? (
                            <div className="flex items-center space-x-2 text-blue-600">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Analyzing issue...</span>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {aiSuggestions.map((suggestion, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                  <p className="text-sm text-blue-800">{suggestion}</p>
                                </div>
                              ))}
                              {aiSuggestions.length > 0 && (
                                <div className="mt-4 p-2 bg-blue-100 rounded text-xs text-blue-700">
                                  💡 These are AI-generated suggestions. Please verify with official service procedures.
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Supporting Materials</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Upload images, videos, or diagnostic reports</p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button type="button" variant="outline">
                    Choose Files
                  </Button>
                </Label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link href="/">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={!vehicleInfo || !title || !description || !selectedSystem || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Question"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
