import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Phone, Clock, Hash } from "lucide-react"

const billingHistory = [
  { date: "2024-08-01", description: "Pro Plan Subscription", amount: "$99.00" },
  { date: "2024-07-01", description: "Pro Plan Subscription", amount: "$99.00" },
  { date: "2024-06-01", description: "Pro Plan Subscription", amount: "$99.00" },
  { date: "2024-05-01", description: "Pro Plan Subscription", amount: "$99.00" },
]

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-gray-400">Manage your subscription, payment method, and view your invoices.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently on the Pro Plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Monthly Cost</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">$99</span>
                    <span className="text-gray-400">/ month</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Remaining Balance</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-teal-400">$50.00</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 pt-4">Your next billing date is September 1, 2025.</p>
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-4 flex gap-2">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">Upgrade Plan</Button>
              <Button variant="outline" className="bg-transparent border-gray-700 hover:bg-gray-800">
                Cancel Plan
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Your primary payment method.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gray-700 rounded-md flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Visa ending in 1234</p>
                <p className="text-sm text-gray-400">Expires 12 / 2028</p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-4">
              <Button variant="outline" className="bg-transparent border-gray-700 hover:bg-gray-800">
                Update Payment Method
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800 h-full">
            <CardHeader>
              <CardTitle>Usage This Cycle</CardTitle>
              <CardDescription>Resets on September 1, 2025.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="flex items-center gap-2 text-gray-300">
                    <Phone className="h-4 w-4" /> Calls Handled
                  </p>
                  <p className="font-mono text-gray-400">124 / 1,000</p>
                </div>
                <Progress value={12.4} className="h-2 [&>*]:bg-teal-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="flex items-center gap-2 text-gray-300">
                    <Clock className="h-4 w-4" /> Agent Minutes
                  </p>
                  <p className="font-mono text-gray-400">450 / 2,000</p>
                </div>
                <Progress value={22.5} className="h-2 [&>*]:bg-teal-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="flex items-center gap-2 text-gray-300">
                    <Hash className="h-4 w-4" /> Phone Numbers
                  </p>
                  <p className="font-mono text-gray-400">2 / 5</p>
                </div>
                <Progress value={40} className="h-2 [&>*]:bg-teal-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Download your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-800/50">
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Description</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-right text-gray-300">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((item, index) => (
                <TableRow key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" aria-label={`Download invoice for ${item.date}`}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
