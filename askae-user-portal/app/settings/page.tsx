import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { User, CreditCard, Bot } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-400">Manage your account and workspace settings.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" /> Profile
            </CardTitle>
            <CardDescription>Update your personal information and password.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm">Profile settings form will go here.</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Billing
            </CardTitle>
            <CardDescription>Manage your subscription and view invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm">Billing management components will go here.</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" /> Agent Defaults
            </CardTitle>
            <CardDescription>Set default behaviors for new agents.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm">Default agent settings form will go here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
