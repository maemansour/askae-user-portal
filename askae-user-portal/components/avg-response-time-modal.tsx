"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Clock, Rabbit, Turtle, Percent } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock Data
const responseTimeTrendData = [
  { date: "07-29", ms: 410 },
  { date: "07-30", ms: 390 },
  { date: "07-31", ms: 385 },
  { date: "08-01", ms: 360 },
  { date: "08-02", ms: 350 },
  { date: "08-03", ms: 345 },
  { date: "08-04", ms: 355 },
]

const responseTimeDistributionData = [
  { range: "<200ms", count: 15 },
  { range: "200-400ms", count: 78 },
  { range: "400-600ms", count: 25 },
  { range: ">600ms", count: 6 },
]

const keyMetrics = [
  { title: "Fastest Response", value: "180ms", icon: Rabbit },
  { title: "Slowest Response", value: "890ms", icon: Turtle },
  { title: "P95 Response Time", value: "550ms", icon: Percent },
]

export function AvgResponseTimeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-gray-900 border-gray-800 text-gray-50">
        <DialogHeader>
          <DialogTitle className="text-2xl">Average Response Time Details</DialogTitle>
          <DialogDescription>Analysis of your AI agent's response speed and performance.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh] pr-4">
          <div className="grid gap-6 py-4">
            <div className="grid gap-4 md:grid-cols-3">
              {keyMetrics.map((metric) => (
                <Card key={metric.title} className="bg-gray-950/50 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">{metric.title}</CardTitle>
                    <metric.icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-gray-950/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-teal-400" /> Response Time Trend (7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] w-full">
                  <ChartContainer config={{ ms: { label: "ms", color: "hsl(var(--chart-2))" } }}>
                    <ResponsiveContainer>
                      <LineChart data={responseTimeTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#888" fontSize={12} />
                        <YAxis tickLine={false} axisLine={false} stroke="#888" fontSize={12} unit="ms" />
                        <ChartTooltip
                          cursor={{ stroke: "rgba(255, 255, 255, 0.2)", strokeWidth: 1 }}
                          content={<ChartTooltipContent className="bg-gray-800 text-gray-50 border-gray-700" />}
                        />
                        <Line type="monotone" dataKey="ms" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-950/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Response Time Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] w-full">
                  <ChartContainer config={{ count: { label: "Count" } }}>
                    <ResponsiveContainer>
                      <BarChart data={responseTimeDistributionData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="range" tickLine={false} axisLine={false} stroke="#888" fontSize={12} />
                        <YAxis tickLine={false} axisLine={false} stroke="#888" fontSize={12} />
                        <ChartTooltip
                          cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                          content={<ChartTooltipContent className="bg-gray-800 text-gray-50 border-gray-700" />}
                        />
                        <Bar dataKey="count" fill="#9ca3af" radius={[4, 4, 0, 0]} activeBar={{ fill: "#d1d5db" }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4 border-t border-gray-800 pt-4 sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="bg-gray-800 hover:bg-gray-700"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
