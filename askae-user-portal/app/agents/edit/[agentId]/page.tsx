"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AgentCreationWizard } from "@/components/agent-creation-wizard"

// Ideally, this would be in a shared types file
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

export default function EditAgentPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.agentId as string

  const [agentData, setAgentData] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (agentId) {
      const savedAgents = localStorage.getItem("agents")
      if (savedAgents) {
        const agents: Agent[] = JSON.parse(savedAgents)
        const agentToEdit = agents.find((agent) => agent.id === agentId)
        if (agentToEdit) {
          setAgentData(agentToEdit)
        } else {
          // Agent not found, redirect to the agents list
          router.push("/agents")
        }
      }
      setLoading(false)
    }
  }, [agentId, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading agent data...</p>
      </div>
    )
  }

  if (!agentData) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p>Agent not found.</p>
        <Button asChild>
          <Link href="/agents">Back to Agents</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 bg-transparent border-gray-700 hover:bg-gray-800"
            asChild
          >
            <Link href="/agents">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Agent</h1>
        </div>
        <p className="text-gray-400 mt-2 ml-11">
          Editing agent: <span className="font-semibold text-gray-200">{agentData.agentName || "Untitled Agent"}</span>
        </p>
      </header>

      <AgentCreationWizard initialDraftData={agentData} />
    </div>
  )
}
