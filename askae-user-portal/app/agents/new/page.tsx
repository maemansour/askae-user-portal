import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AgentCreationWizard } from "@/components/agent-creation-wizard"

export default function NewAgentPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Create New Agent</h1>
        </div>
        <p className="text-gray-400 mt-2 ml-11">Set up a new voice agent for your business in just a few steps.</p>
      </header>

      <AgentCreationWizard />
    </div>
  )
}
