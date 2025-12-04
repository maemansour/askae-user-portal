"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { useState, useRef, useEffect } from "react"
import {
  Users,
  MessageSquare,
  Clock,
  Phone,
  Calendar,
  Play,
  ChevronLeft,
  ChevronRight,
  Check,
  Save,
  CheckCircle,
  ArrowRight,
  ClipboardList,
  X,
  PlusCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { presets, presetOptions } from "@/lib/agent-presets"

type Agent = {
  id: string
  status: "draft" | "deployed"
  agentName: string
  publicName: string
  gender: string
  language: string
  voice: string
  personality: string
  activeHours: { enabled: boolean }
  greetings: {
    main: string
    afterHours: string
    holiday: string
  }
  bookingRules: {
    minAdvanceNotice: string
    maxBookingWindow: string
    allowCancellation: boolean
    cancellationNotice: string
    additionalRules: string
  }
  faqEnabled: boolean
  instructions: string[]
  personalityTraits: string[]
}

const steps = [
  { id: 1, title: "Agent Identity", icon: Users },
  { id: 2, title: "Instructions", icon: ClipboardList },
  { id: 3, title: "Voice & Personality", icon: MessageSquare },
  { id: 4, title: "Operating Hours", icon: Clock },
  { id: 5, title: "Greetings", icon: Phone },
  { id: 6, title: "Business Rules", icon: Calendar },
  { id: 7, title: "Test & Deploy", icon: Play },
]

const voiceOptions = [
  { id: "sarah-professional", name: "Sarah", nationality: "American", gender: "Female", tone: "Professional" },
  { id: "emma-warm", name: "Emma", nationality: "American", gender: "Female", tone: "Warm" },
  { id: "michael-friendly", name: "Michael", nationality: "American", gender: "Male", tone: "Friendly" },
  { id: "carlos-energetic", name: "Carlos", nationality: "American", gender: "Male", tone: "Energetic" },
  { id: "alloy", name: "Alloy", nationality: "American", gender: "Female", tone: "Neutral" },
  { id: "echo", name: "Echo", nationality: "American", gender: "Male", tone: "Neutral" },
  { id: "fable", name: "Fable", nationality: "British", gender: "Male", tone: "Storyteller" },
  { id: "nova", name: "Nova", nationality: "American", gender: "Female", tone: "Clear" },
  { id: "shimmer", name: "Shimmer", nationality: "American", gender: "Female", tone: "Gentle" },
]

const initialAgentData = {
  agentName: "",
  publicName: "",
  gender: "female",
  language: "english",
  voice: "",
  personality: "professional",
  activeHours: { enabled: true },
  greetings: {
    main: "",
    afterHours: "",
    holiday: "",
  },
  bookingRules: {
    minAdvanceNotice: "1",
    maxBookingWindow: "30",
    allowCancellation: true,
    cancellationNotice: "24",
    additionalRules: "",
  },
  faqEnabled: true,
  instructions: [] as string[],
  personalityTraits: [] as string[],
}

export function AgentCreationWizard({ initialDraftData }: { initialDraftData?: Agent }) {
  const router = useRouter()
  const [wizardStarted, setWizardStarted] = useState(!!initialDraftData)
  const [selectedPresetIds, setSelectedPresetIds] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [agentData, setAgentData] = useState(initialDraftData || initialAgentData)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const isTemplateMode = selectedPresetIds.length > 0
  const visibleSteps = isTemplateMode ? steps.filter((step) => step.id !== 3) : steps

  const traitInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // When a new trait is added, focus the last input field.
    if (
      agentData.personalityTraits.length > 0 &&
      agentData.personalityTraits[agentData.personalityTraits.length - 1] === ""
    ) {
      const lastInputIndex = agentData.personalityTraits.length - 1
      traitInputRefs.current[lastInputIndex]?.focus()
    }
  }, [agentData.personalityTraits])

  const updateAgentData = (field: string, value: any) => {
    setAgentData((prev) => ({ ...prev, [field]: value }))
  }

  const updateGreeting = (field: keyof typeof agentData.greetings, value: string) => {
    setAgentData((prev) => ({
      ...prev,
      greetings: { ...prev.greetings, [field]: value },
    }))
  }

  const updateBookingRule = (field: string, value: any) => {
    setAgentData((prev) => ({
      ...prev,
      bookingRules: { ...prev.bookingRules, [field]: value },
    }))
  }

  const updateInstructions = (value: string) => {
    setAgentData((prev) => ({
      ...prev,
      instructions: value.split("\n"),
    }))
  }

  const handleTraitChange = (index: number, value: string) => {
    const newTraits = [...agentData.personalityTraits]
    newTraits[index] = value
    updateAgentData("personalityTraits", newTraits)
  }

  const addTrait = () => {
    updateAgentData("personalityTraits", [...agentData.personalityTraits, ""])
  }

  const removeTrait = (index: number) => {
    const newTraits = agentData.personalityTraits.filter((_, i) => i !== index)
    updateAgentData("personalityTraits", newTraits)
  }

  const handleTogglePreset = (presetId: string) => {
    setSelectedPresetIds((prev) =>
      prev.includes(presetId) ? prev.filter((id) => id !== presetId) : [...prev, presetId],
    )
  }

  const handleCombineAndContinue = () => {
    if (selectedPresetIds.length === 0) return

    let mergedData = JSON.parse(JSON.stringify(initialAgentData)) // Deep copy

    const instructionsSet = new Set<string>()
    const traitsSet = new Set<string>()

    for (const id of selectedPresetIds) {
      const preset = presets[id as keyof typeof presets]
      if (preset) {
        // Merge simple properties, last one wins
        mergedData = { ...mergedData, ...preset }

        // Merge nested objects
        mergedData.greetings = { ...mergedData.greetings, ...(preset.greetings || {}) }
        mergedData.bookingRules = { ...mergedData.bookingRules, ...(preset.bookingRules || {}) }

        // Add instructions and traits to sets to avoid duplicates
        preset.instructions.forEach((inst) => instructionsSet.add(inst))
        preset.personalityTraits.forEach((trait) => traitsSet.add(trait))
      }
    }

    mergedData.instructions = Array.from(instructionsSet)
    mergedData.personalityTraits = Array.from(traitsSet)

    // Start with blank name fields regardless of presets selected
    mergedData.agentName = ""
    mergedData.publicName = ""

    setAgentData(mergedData)
    setWizardStarted(true)
  }

  const handleStartFromScratch = () => {
    setAgentData(initialAgentData)
    setSelectedPresetIds([])
    setWizardStarted(true)
  }

  const goBackToTemplates = () => {
    setWizardStarted(false)
    setCurrentStep(1)
  }

  const nextStep = () => {
    const currentVisibleIndex = visibleSteps.findIndex((step) => step.id === currentStep)
    if (currentVisibleIndex < visibleSteps.length - 1) {
      setCurrentStep(visibleSteps[currentVisibleIndex + 1].id)
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    setIsSaved(false)
    console.log("Saving draft:", agentData)

    const savedAgents = JSON.parse(localStorage.getItem("agents") || "[]")
    let updatedAgents

    if (initialDraftData?.id) {
      // Update existing draft
      updatedAgents = savedAgents.map((agent) =>
        agent.id === initialDraftData.id ? { ...agentData, id: initialDraftData.id, status: "draft" } : agent,
      )
    } else {
      // Create new draft
      const newDraft = { ...agentData, id: Date.now().toString(), status: "draft" }
      updatedAgents = [...savedAgents, newDraft]
    }

    localStorage.setItem("agents", JSON.stringify(updatedAgents))

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSaving(false)
    setIsSaved(true)

    // Redirect to the agents page
    setTimeout(() => {
      router.push("/agents")
    }, 1000)
  }

  const prevStep = () => {
    if (currentStep === 1) {
      if (initialDraftData) {
        router.push("/agents")
      } else {
        goBackToTemplates()
      }
      return
    }
    const currentVisibleIndex = visibleSteps.findIndex((step) => step.id === currentStep)
    if (currentVisibleIndex > 0) {
      setCurrentStep(visibleSteps[currentVisibleIndex - 1].id)
    }
  }

  if (!wizardStarted) {
    return (
      <div className="flex flex-col gap-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Choose Your Templates</CardTitle>
            <CardDescription>
              Select one or more pre-configured templates to combine their features, or start from scratch.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presetOptions.map((preset) => {
              const isSelected = selectedPresetIds.includes(preset.id)
              return (
                <Label
                  key={preset.id}
                  htmlFor={preset.id}
                  className={cn(
                    "relative text-left p-4 border-2 rounded-lg transition-all flex flex-col cursor-pointer",
                    isSelected ? "border-teal-400 bg-teal-950/30" : "border-gray-800 hover:border-gray-600",
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <preset.icon className="h-6 w-6 text-teal-400" />
                    <h3 className="font-semibold text-gray-50">{preset.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 flex-grow pr-6">{preset.description}</p>
                  <Checkbox
                    id={preset.id}
                    checked={isSelected}
                    onCheckedChange={() => handleTogglePreset(preset.id)}
                    className="absolute top-4 right-4"
                  />
                </Label>
              )
            })}
          </CardContent>
        </Card>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
          <Button
            onClick={handleCombineAndContinue}
            disabled={selectedPresetIds.length === 0}
            className="bg-teal-500 hover:bg-teal-600 text-white w-full sm:w-auto"
          >
            Combine {selectedPresetIds.length > 0 ? selectedPresetIds.length : ""} Template
            {selectedPresetIds.length === 1 ? "" : "s"} & Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="link" onClick={handleStartFromScratch} className="text-teal-400">
            Or Start From Scratch
          </Button>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Agent Identity
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Agent Identity</CardTitle>
              <CardDescription>Set up the basic identity and name for your voice agent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="agent-name">Internal Agent Name *</Label>
                  <Input
                    id="agent-name"
                    value={agentData.agentName}
                    onChange={(e) => updateAgentData("agentName", e.target.value)}
                    placeholder="e.g., Main Booking Agent"
                    className="bg-gray-800 border-gray-700"
                  />
                  <p className="text-xs text-gray-500">For your internal reference only.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="public-name">Public Name *</Label>
                  <Input
                    id="public-name"
                    value={agentData.publicName}
                    onChange={(e) => updateAgentData("publicName", e.target.value)}
                    placeholder="e.g., Maya's Spa Assistant"
                    className="bg-gray-800 border-gray-700"
                  />
                  <p className="text-xs text-gray-500">How the agent introduces itself to customers.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label>Agent Gender</Label>
                  <RadioGroup
                    value={agentData.gender}
                    onValueChange={(value) => updateAgentData("gender", value)}
                    className="flex gap-4"
                  >
                    <Label
                      htmlFor="gender-female"
                      className={cn(
                        "flex-1 py-2 px-3 text-sm border-2 rounded-lg transition-all text-center cursor-pointer",
                        agentData.gender === "female"
                          ? "border-teal-400 bg-teal-950/50 text-gray-50"
                          : "border-gray-700 text-gray-300 hover:border-gray-600",
                      )}
                    >
                      Female
                      <RadioGroupItem value="female" id="gender-female" className="sr-only" />
                    </Label>
                    <Label
                      htmlFor="gender-male"
                      className={cn(
                        "flex-1 py-2 px-3 text-sm border-2 rounded-lg transition-all text-center cursor-pointer",
                        agentData.gender === "male"
                          ? "border-teal-400 bg-teal-950/50 text-gray-50"
                          : "border-gray-700 text-gray-300 hover:border-gray-600",
                      )}
                    >
                      Male
                      <RadioGroupItem value="male" id="gender-male" className="sr-only" />
                    </Label>
                  </RadioGroup>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="language">Primary Language</Label>
                  <Select value={agentData.language} onValueChange={(value) => updateAgentData("language", value)}>
                    <SelectTrigger id="language" className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="bilingual">Bilingual (English/Spanish)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 2: // Instructions
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Agent Instructions & Traits</CardTitle>
              <CardDescription>
                Define the core logic and personality of your agent. Add, edit, or remove items as needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid gap-2">
                <Label htmlFor="agent-instructions" className="text-base">
                  Instructions
                </Label>
                <Textarea
                  id="agent-instructions"
                  value={agentData.instructions.join("\n")}
                  onChange={(e) => updateInstructions(e.target.value)}
                  rows={8}
                  className="bg-gray-800 border-gray-700 font-mono text-sm"
                  placeholder="e.g., Always introduce yourself as Maya's AI assistant."
                />
                <p className="text-xs text-gray-500">
                  One instruction per line. These define the core logic of your agent.
                </p>
              </div>

              <div className="grid gap-3">
                <Label className="text-base">Personality Traits</Label>
                <div className="flex flex-wrap gap-4 items-center">
                  {agentData.personalityTraits.map((trait, index) => (
                    <div key={index} className="relative">
                      <Input
                        ref={(el) => (traitInputRefs.current[index] = el)}
                        value={trait}
                        onChange={(e) => handleTraitChange(index, e.target.value)}
                        placeholder="e.g., Friendly & patient"
                        className="bg-gray-800 border-gray-700 pr-10"
                        size={Math.max(trait.length + 4, 20)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTrait(index)}
                        aria-label="Remove trait"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={addTrait}
                  className="mt-2 justify-start w-fit bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Trait
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      case 3: // Voice & Personality
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Voice & Personality</CardTitle>
              <CardDescription>Select the voice and personality that best represents your brand.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              <div className="grid gap-3">
                <Label>Voice Selection</Label>
                <RadioGroup
                  value={agentData.voice}
                  onValueChange={(value) => updateAgentData("voice", value)}
                  className="grid grid-cols-1 gap-4"
                >
                  {voiceOptions.map((voice) => (
                    <Label
                      key={voice.id}
                      htmlFor={voice.id}
                      className={cn(
                        "flex flex-col justify-between p-4 border-2 rounded-lg cursor-pointer transition-all",
                        agentData.voice === voice.id
                          ? "border-teal-400 bg-teal-950/50"
                          : "border-gray-700 hover:border-gray-600",
                      )}
                    >
                      <div>
                        <h4 className="font-medium text-gray-50">
                          {voice.name} ({voice.tone})
                        </h4>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">
                            {voice.nationality} • {voice.gender}
                          </p>
                          <Button size="icon" variant="ghost" className="text-gray-400 hover:text-gray-50">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <RadioGroupItem value={voice.id} id={voice.id} className="sr-only" />
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <div className="grid gap-3">
                <Label>Personality Style</Label>
                <RadioGroup
                  value={agentData.personality}
                  onValueChange={(value) => updateAgentData("personality", value)}
                  className="grid grid-cols-2 gap-3"
                >
                  {["Professional", "Friendly", "Energetic", "Calm"].map((style) => (
                    <Label
                      key={style}
                      htmlFor={style.toLowerCase()}
                      className={cn(
                        "p-3 text-sm border-2 rounded-lg transition-all text-center cursor-pointer",
                        agentData.personality === style.toLowerCase()
                          ? "border-teal-400 bg-teal-950/50 text-gray-50"
                          : "border-gray-700 text-gray-300 hover:border-gray-600",
                      )}
                    >
                      {style}
                      <RadioGroupItem value={style.toLowerCase()} id={style.toLowerCase()} className="sr-only" />
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )
      case 4: // Operating Hours
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
              <CardDescription>Define when your agent should handle calls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg border border-gray-800 bg-gray-950/50">
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="active-hours" className="text-base font-medium">
                    Follow Business Hours
                  </Label>
                  <Switch
                    id="active-hours"
                    checked={agentData.activeHours.enabled}
                    onCheckedChange={(checked) =>
                      updateAgentData("activeHours", { ...agentData.activeHours, enabled: checked })
                    }
                  />
                </div>
                {agentData.activeHours.enabled && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Agent will only handle calls during your configured business hours. Outside these hours, callers
                      will hear your after-hours greeting.
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm p-3 bg-gray-900 rounded-md">
                      <div>
                        <span className="font-medium text-gray-300">Monday - Friday:</span> 9:00 AM - 6:00 PM
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">Saturday:</span> 10:00 AM - 4:00 PM
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">Sunday:</span> Closed
                      </div>
                    </div>
                    <Button variant="link" className="p-0 h-auto text-teal-400">
                      Modify Business Hours →
                    </Button>
                  </div>
                )}
              </div>
              <div className="p-4 rounded-lg border border-yellow-900/50 bg-yellow-950/20 text-yellow-200">
                <h4 className="font-semibold text-yellow-300 mb-2">24/7 Operation</h4>
                <p className="text-sm text-yellow-300/80">
                  To enable 24/7 operation, turn off "Follow Business Hours". The agent will use the main greeting at
                  all times.
                </p>
              </div>
            </CardContent>
          </Card>
        )
      case 5: // Agent Greetings
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Agent Greetings</CardTitle>
              <CardDescription>Customize how your agent greets customers in different situations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="main-greeting">Main Greeting *</Label>
                <Textarea
                  id="main-greeting"
                  value={agentData.greetings.main}
                  onChange={(e) => updateGreeting("main", e.target.value)}
                  rows={3}
                  className="bg-gray-800 border-gray-700"
                  placeholder="e.g., Thank you for calling! How can I help you?"
                />
                <p className="text-xs text-gray-500">Used during regular business hours.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="after-hours-greeting">After-Hours Greeting</Label>
                <Textarea
                  id="after-hours-greeting"
                  value={agentData.greetings.afterHours}
                  onChange={(e) => updateGreeting("afterHours", e.target.value)}
                  rows={3}
                  className="bg-gray-800 border-gray-700"
                  placeholder="e.g., Thank you for calling! We're currently closed, but..."
                />
                <p className="text-xs text-gray-500">Used outside business hours.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="holiday-greeting">Holiday Greeting</Label>
                <Textarea
                  id="holiday-greeting"
                  value={agentData.greetings.holiday}
                  onChange={(e) => updateGreeting("holiday", e.target.value)}
                  rows={3}
                  className="bg-gray-800 border-gray-700"
                  placeholder="e.g., Thank you for calling! We're closed for the holiday..."
                />
                <p className="text-xs text-gray-500">Used during holidays.</p>
              </div>
            </CardContent>
          </Card>
        )
      case 6: // Business Rules
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Business Rules</CardTitle>
              <CardDescription>Configure booking policies and operational rules for your agent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-3">
                <Switch
                  id="faq-enabled"
                  checked={agentData.faqEnabled}
                  onCheckedChange={(checked) => updateAgentData("faqEnabled", checked)}
                />
                <Label htmlFor="faq-enabled">Enable FAQ & General Q&A</Label>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="min-advance">Minimum Advance Notice</Label>
                  <Select
                    value={agentData.bookingRules.minAdvanceNotice}
                    onValueChange={(value) => updateBookingRule("minAdvanceNotice", value)}
                  >
                    <SelectTrigger id="min-advance" className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Same day</SelectItem>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max-window">Maximum Booking Window</Label>
                  <Select
                    value={agentData.bookingRules.maxBookingWindow}
                    onValueChange={(value) => updateBookingRule("maxBookingWindow", value)}
                  >
                    <SelectTrigger id="max-window" className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">2 weeks</SelectItem>
                      <SelectItem value="30">1 month</SelectItem>
                      <SelectItem value="90">3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Switch
                  id="allow-cancellation"
                  checked={agentData.bookingRules.allowCancellation}
                  onCheckedChange={(checked) => updateBookingRule("allowCancellation", checked)}
                />
                <Label htmlFor="allow-cancellation">Allow agent to handle cancellations</Label>
              </div>
              {agentData.bookingRules.allowCancellation && (
                <div className="grid gap-2 pl-10">
                  <Label htmlFor="cancellation-notice">Cancellation Notice Required</Label>
                  <Select
                    value={agentData.bookingRules.cancellationNotice}
                    onValueChange={(value) => updateBookingRule("cancellationNotice", value)}
                  >
                    <SelectTrigger id="cancellation-notice" className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="48">48 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-2 pt-2">
                <Label htmlFor="additional-rules">Additional Rules & Notes</Label>
                <Textarea
                  id="additional-rules"
                  value={agentData.bookingRules.additionalRules || ""}
                  onChange={(e) => updateBookingRule("additionalRules", e.target.value)}
                  rows={4}
                  className="bg-gray-800 border-gray-700"
                  placeholder="e.g., We require a credit card to hold all appointments. No-shows will be charged 50% of the service price."
                />
                <p className="text-xs text-gray-500">
                  Any other specific rules or information the agent should be aware of.
                </p>
              </div>
            </CardContent>
          </Card>
        )
      case 7: // Test & Deploy
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Test & Deploy</CardTitle>
              <CardDescription>Test your agent configuration before going live.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg border border-gray-800 bg-gray-950/50">
                <div className="flex items-center space-x-3 mb-4">
                  <Play className="h-6 w-6 text-teal-400" />
                  <h4 className="font-medium text-gray-50">Test Your Agent</h4>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Make test calls to validate your agent's configuration. Test different scenarios to ensure everything
                  works as expected.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                    Test Booking Flow
                  </Button>
                  <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                    Test FAQ Responses
                  </Button>
                  <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                    Test After-Hours
                  </Button>
                  <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                    General Test Call
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-50">Agent Summary</h4>
                <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800 space-y-3">
                  <div className="grid md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-400">Name:</span> {agentData.agentName || "Not set"}
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Public Name:</span>{" "}
                      {agentData.publicName || "Not set"}
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Voice:</span> {agentData.voice || "Not selected"}
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Personality:</span> {agentData.personality}
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">FAQ Enabled:</span>{" "}
                      {agentData.faqEnabled ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-gray-700 hover:bg-gray-800"
                  onClick={handleSaveDraft}
                  disabled={isSaving || isSaved}
                >
                  {isSaving ? (
                    <>
                      <Save className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isSaved ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Draft Saved!
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save as Draft
                    </>
                  )}
                </Button>
                <Button size="lg" className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Deploy Agent
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Stepper */}
      <div className="flex items-center justify-between">
        {visibleSteps.map((step, index) => (
          <div key={step.id} className="flex items-center w-full">
            <div
              className={cn(
                "flex flex-col items-center gap-2 cursor-pointer w-20",
                currentStep >= step.id ? "text-teal-400" : "text-gray-500",
              )}
              onClick={() => setCurrentStep(step.id)}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                  currentStep === step.id ? "border-teal-400 bg-teal-950/50" : "border-gray-700",
                  currentStep > step.id && "border-teal-400 bg-teal-950/50",
                )}
              >
                {currentStep > step.id ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              <span className="text-xs font-medium text-center hidden sm:block">{step.title}</span>
            </div>
            {index < visibleSteps.length - 1 && (
              <div className={cn("flex-1 h-0.5 mx-2", currentStep > step.id ? "bg-teal-400" : "bg-gray-700")} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div>{renderStepContent()}</div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-800">
        <Button onClick={prevStep} variant="outline" className="bg-transparent border-gray-700 hover:bg-gray-800">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentStep !== visibleSteps[visibleSteps.length - 1].id ? (
          <Button onClick={nextStep} className="bg-teal-500 hover:bg-teal-600 text-white">
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button asChild className="bg-gray-600 hover:bg-gray-500 text-white">
            <Link href="/agents">Finish</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
