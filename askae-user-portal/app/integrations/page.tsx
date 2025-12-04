import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, CreditCard, MessageSquare, Zap } from "lucide-react"
import { SiSquare } from "@icons-pack/react-simple-icons"

const integrations = [
  {
    name: "Google Calendar",
    description: "Sync appointments directly with your Google Calendar.",
    icon: Calendar,
    status: "Connected",
  },
  {
    name: "Square",
    description: "Integrate with Square for appointments and payments.",
    icon: SiSquare,
    status: "Connect",
  },
  {
    name: "Stripe",
    description: "Process payments for bookings securely via Stripe.",
    icon: CreditCard,
    status: "Connect",
  },
  {
    name: "Twilio",
    description: "Manage your phone numbers and SMS notifications.",
    icon: MessageSquare,
    status: "Manage",
  },
  {
    name: "Zapier",
    description: "Connect to thousands of other apps with Zapier.",
    icon: Zap,
    status: "Connect",
  },
]

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-gray-400">Connect your favorite tools to supercharge your AI agents.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.name} className="bg-gray-900 border-gray-800 flex flex-col">
            <CardHeader className="flex-row gap-4 items-center">
              <integration.icon className="h-8 w-8" />
              <div>
                <CardTitle>{integration.name}</CardTitle>
                <CardDescription>{integration.description}</CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="mt-auto bg-gray-950/50 border-t border-gray-800 px-6 py-3">
              {integration.status === "Connected" ? (
                <div className="flex items-center text-green-400 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connected
                </div>
              ) : (
                <Button
                  variant={integration.status === "Manage" ? "secondary" : "default"}
                  className={
                    integration.status === "Manage"
                      ? "w-full bg-gray-800 hover:bg-gray-700"
                      : "w-full bg-teal-500 hover:bg-teal-600 text-white"
                  }
                >
                  {integration.status}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
