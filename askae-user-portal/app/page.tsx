"use client"

import { Phone, CalendarCheck, Star, Clock, Bell, CircleDot, PhoneForwarded, CalendarPlus, Wrench, Lightbulb, Server, Plug, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useState } from "react"
import { CallLogModal } from "@/components/call-log-modal"
import { AppointmentsModal } from "@/components/appointments-modal"
import { CsatModal } from "@/components/csat-modal"
import { AvgResponseTimeModal } from "@/components/avg-response-time-modal"

const statCards = [
  { id: "calls-handled", title: "Calls Handled", value: "124", trend: "+4.7% vs last week", icon: Phone },
  {
    id: "appointments-booked",
    title: "Appointments Booked",
    value: "38",
    trend: "+2.1% vs last week",
    icon: CalendarCheck,
  },
  {
    id: "customer-satisfaction",
    title: "Customer Satisfaction",
    value: "4.8/5",
    trend: "+0.2 vs last week",
    icon: Star,
  },
  { id: "avg-response-time", title: "Avg. Response Time", value: "350ms", trend: "-50ms vs last week", icon: Clock },
]

const weeklySummaryData = [
  { day: "Mon", calls: 65 },
  { day: "Tue", calls: 72 },
  { day: "Wed", calls: 88 },
  { day: "Thu", calls: 81 },
  { day: "Fri", calls: 95 },
  { day: "Sat", calls: 112 },
  { day: "Sun", calls: 105 },
]

const activityFeed = [
  { type: "booking", name: "Jessica Miller", service: "Deep Tissue Massage", time: "2m ago" },
  { type: "call", name: "Unknown (+1...4567)", outcome: "Info Request", time: "5m ago" },
  { type: "cancellation", name: "David Chen", service: "Facial", time: "12m ago" },
  { type: "call", name: "Sarah Lee", outcome: "Escalated to Staff", time: "28m ago" },
]

const quickActions = [
  { label: "Review Flagged Calls", icon: Bell },
  { label: "Update Business Hours", icon: Clock },
  { label: "Add New Service", icon: CalendarPlus },
  { label: "Modify Agent Greeting", icon: Wrench },
]

const chartConfig = {
  calls: {
    label: "Calls",
  },
}

export default function DashboardPage() {
  const [isCallLogModalOpen, setCallLogModalOpen] = useState(false)
  const [isAppointmentsModalOpen, setAppointmentsModalOpen] = useState(false)
  const [isCsatModalOpen, setCsatModalOpen] = useState(false)
  const [isAvgResponseTimeModalOpen, setAvgResponseTimeModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-400">Welcome back, Maya! Here's your business overview.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const isCallsClickable = card.id === "calls-handled"
          const isAppointmentsClickable = card.id === "appointments-booked"
          const isCsatClickable = card.id === "customer-satisfaction"
          const isAvgResponseTimeClickable = card.id === "avg-response-time"

          const CardComponent = (
            <Card key={card.id} className="bg-gray-900 border-gray-800 h-full">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-2xl font-bold tabular-nums">{card.value}</div>
                <p className="text-xs text-gray-400">{card.trend}</p>
              </CardContent>
            </Card>
          )

          if (isCallsClickable) {
            return (
              <button
                key={card.id}
                onClick={() => setCallLogModalOpen(true)}
                className="text-left transition-transform transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-950 rounded-lg"
              >
                {CardComponent}
              </button>
            )
          }
          if (isAppointmentsClickable) {
            return (
              <button
                key={card.id}
                onClick={() => setAppointmentsModalOpen(true)}
                className="text-left transition-transform transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-950 rounded-lg"
              >
                {CardComponent}
              </button>
            )
          }
          if (isCsatClickable) {
            return (
              <button
                key={card.id}
                onClick={() => setCsatModalOpen(true)}
                className="text-left transition-transform transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-950 rounded-lg"
              >
                {CardComponent}
              </button>
            )
          }
          if (isAvgResponseTimeClickable) {
            return (
              <button
                key={card.id}
                onClick={() => setAvgResponseTimeModalOpen(true)}
                className="text-left transition-transform transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-950 rounded-lg"
              >
                {CardComponent}
              </button>
            )
          }
          return CardComponent
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-gray-900 border-gray-800 min-w-0 overflow-hidden">
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
            <CardDescription>Call volume and key metrics from the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[300px] w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={weeklySummaryData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#888888" fontSize={12} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      stroke="#888888"
                      fontSize={12}
                      tickFormatter={(value) => `${value}`}
                    />
                    <ChartTooltip
                      cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                      content={<ChartTooltipContent className="bg-gray-800 text-gray-50 border-gray-700" />}
                    />
                    <Bar dataKey="calls" fill="#9ca3af" radius={[4, 4, 0, 0]} activeBar={{ fill: "#d1d5db" }} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-6">
              <div>
                <p className="text-sm text-gray-400">Booking Rate</p>
                <p className="text-xl font-bold">32.4%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Revenue Impact</p>
                <p className="text-xl font-bold">$4,250</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Cost Savings</p>
                <p className="text-xl font-bold">$820</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Resolution Rate</p>
                <p className="text-xl font-bold">92%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Real-Time Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-green-400 animate-pulse" />
                  <span className="font-medium">2 Active Calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneForwarded className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium">1 in Queue</span>
                </div>
              </div>
              <div className="space-y-4">
                {activityFeed.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`/placeholder.svg?height=36&width=36&query=${activity.name.split(" ")[0]}`} />
                      <AvatarFallback>{activity.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.name}</p>
                      <p className="text-xs text-gray-400">
                        {activity.type === "booking" ? `Booked: ${activity.service}` : `Outcome: ${activity.outcome}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="relative justify-start bg-gray-800 border-gray-700 hover:bg-gray-700 h-auto whitespace-normal text-left p-3"
                >
                  <span className="pr-3.5">{action.label}</span>
                  <action.icon className="absolute top-3 right-3 h-4 w-4 text-gray-400" />
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Status of your agents and integrations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4" /> Agent System
              </div>
              <Badge variant="outline" className="border-green-400 text-green-400">
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plug className="h-4 w-4" /> Google Calendar Sync
              </div>
              <Badge variant="outline" className="border-green-400 text-green-400">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plug className="h-4 w-4" /> Square Appointments
              </div>
              <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                Delayed Sync
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Security
              </div>
              <Badge variant="outline" className="border-green-400 text-green-400">
                Secure
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Insights to help you grow your business.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 mt-1 text-teal-400" />
              <div>
                <p className="font-medium">Extend business hours</p>
                <p className="text-sm text-gray-400">
                  You missed 12 calls after 6 PM last week. Consider extending your agent's active hours.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 mt-1 text-teal-400" />
              <div>
                <p className="font-medium">Promote facials</p>
                <p className="text-sm text-gray-400">
                  Your "Facial" service has a 25% higher booking conversion rate. Mention it in your greeting.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <CallLogModal open={isCallLogModalOpen} onOpenChange={setCallLogModalOpen} />
      <AppointmentsModal open={isAppointmentsModalOpen} onOpenChange={setAppointmentsModalOpen} />
      <CsatModal open={isCsatModalOpen} onOpenChange={setCsatModalOpen} />
      <AvgResponseTimeModal open={isAvgResponseTimeModalOpen} onOpenChange={setAvgResponseTimeModalOpen} />
    </div>
  )
}
