"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, PlusCircle, FileEdit, Trash2 } from "lucide-react"

// Define the Agent type to match the data structure being saved
type Agent = {
  id: string
  status: "draft" | "deployed"
  agentName: string
  publicName: string
  // Add other properties from agentData if needed for display
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    // Load agents from localStorage on component mount
    const savedAgents = localStorage.getItem("agents")
    if (savedAgents) {
      setAgents(JSON.parse(savedAgents))
    }
  }, [])

  const handleDeleteAgent = (agentId: string) => {
    const updatedAgents = agents.filter((agent) => agent.id !== agentId)
    setAgents(updatedAgents)
    localStorage.setItem("agents", JSON.stringify(updatedAgents))
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-gray-400">Manage your AI voice agents.</p>
        </div>
        <Button asChild className="bg-teal-500 hover:bg-teal-600 text-white">
          <Link href="/agents/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Agent
          </Link>
        </Button>
      </header>

      {agents.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Your Agents</CardTitle>
            <CardDescription>You have no agents configured yet. Create one to get started.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center py-16">
            <Bot className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold">No Agents Found</h3>
            <p className="text-gray-400 mt-2">Get started by creating your first AI voice agent.</p>
            <Button asChild className="mt-4 bg-teal-500 hover:bg-teal-600 text-white">
              <Link href="/agents/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Agent
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="bg-gray-900 border-gray-800 flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="max-w-[80%]">{agent.agentName || "Untitled Agent"}</CardTitle>
                  <Badge
                    variant={agent.status === "draft" ? "secondary" : "default"}
                    className={
                      agent.status === "draft"
                        ? "bg-yellow-900/50 border-yellow-700 text-yellow-300"
                        : "bg-green-900/50 border-green-700 text-green-300"
                    }
                  >
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription>{agent.publicName || "No public name set"}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter className="bg-gray-950/50 border-t border-gray-800 px-4 py-3 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => handleDeleteAgent(agent.id)}
                  aria-label="Delete agent"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Link href={`/agents/edit/${agent.id}`} passHref>
                  <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                    <FileEdit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
