"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Calendar, Download, FileText, MessageSquareWarning, Settings, Star, ToggleRight, BarChart2 } from 'lucide-react'
import { TranscriptViewerModal } from "@/components/transcript-viewer-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock Data
const csatTrendData = [
  { date: "07-29", score: 4.6 },
  { date: "07-30", score: 4.7 },
  { date: "07-31", score: 4.5 },
  { date: "08-01", score: 4.8 },
  { date: "08-02", score: 4.9 },
  { date: "08-03", score: 4.7 },
  { date: "08-04", score: 4.8 },
]

const scoreDistributionData = [
  { stars: "1", count: 3 },
  { stars: "2", count: 5 },
  { stars: "3", count: 12 },
  { stars: "4", count: 45 },
  { stars: "5", count: 88 },
]

const lowRatedCalls = [
  {
    id: "call-1",
    customer: "John Doe",
    dateTime: "2025-08-04T11:20:00",
    rating: 2,
    comment: "The agent didn't understand my request to reschedule.",
    transcript:
      "AI: How can I help you?\nJohn: I need to reschedule my appointment.\nAI: I can help with booking a new appointment. What service would you like?\nJohn: No, I want to RESCHEDULE my existing one.\nAI: I'm sorry, I can only book new appointments. Would you like to book one?",
  },
  {
    id: "call-2",
    customer: "Jane Smith",
    dateTime: "2025-08-03T16:05:00",
    rating: 1,
    comment: "It just kept repeating the same thing over and over.",
    transcript:
      "AI: We are open from 9 AM to 7 PM.\nJane: What about on weekends?\nAI: We are open from 9 AM to 7 PM.\nJane: Are you open on SATURDAY?\nAI: We are open from 9 AM to 7 PM.",
  },
]

const sentimentHighlights = [
  "Agent struggles with 'reschedule' vs 'book new'.",
  "Difficulty understanding nuanced date questions (e.g., 'weekends').",
]

type LowRatedCall = (typeof lowRatedCalls)[0]

export function CsatModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [isTranscriptModalOpen, setTranscriptModalOpen] = useState(false)
  const [selectedCall, setSelectedCall] = useState<LowRatedCall | null>(null)

  const handleViewTranscript = (call: LowRatedCall) => {
    setSelectedCall(call)
    setTranscriptModalOpen(true)
  }

  const handleExport = () => {
    const headers = ["Customer", "Date & Time", "Rating", "Comment", "Transcript"]
    const rows = lowRatedCalls.map((call) => [
      `"${call.customer}"`,
      `"${new Date(call.dateTime).toLocaleString()}"`,
      call.rating,
      `"${call.comment}"`,
      `"${call.transcript.replace(/"/g, '""')}"`,
    ])
    const csvContent = [headers.join(","), ...rows.map((e) => e.join("\n"))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "csat_feedback_export.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl bg-gray-900 border-gray-800 text-gray-50">
          <DialogHeader>
            <DialogTitle className="text-2xl">Customer Satisfaction Details</DialogTitle>
            <DialogDescription>A deep dive into your CSAT scores, feedback, and survey settings.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="overview">
                <BarChart2 className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="feedback">
                <FileText className="mr-2 h-4 w-4" />
                Feedback & Transcripts
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <ScrollArea className="max-h-[65vh] pr-4">
                <div className="grid gap-6 lg:grid-cols-2 py-4">
                  <Card className="bg-gray-950/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400" /> CSAT Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] w-full">
                      <ChartContainer config={{ score: { label: "Score", color: "hsl(var(--chart-2))" } }}>
                        <ResponsiveContainer>
                          <LineChart data={csatTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#888" fontSize={12} />
                            <YAxis domain={[4, 5]} tickLine={false} axisLine={false} stroke="#888" fontSize={12} />
                            <ChartTooltip
                              cursor={{ stroke: "rgba(255, 255, 255, 0.2)", strokeWidth: 1 }}
                              content={<ChartTooltipContent className="bg-gray-800 text-gray-50 border-gray-700" />}
                            />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="var(--color-chart-2)"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-950/50 border-gray-800">
                    <CardHeader>
                      <CardTitle>Score Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] w-full">
                      <ChartContainer config={{ count: { label: "Count" } }}>
                        <ResponsiveContainer>
                          <BarChart data={scoreDistributionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis
                              dataKey="stars"
                              tickFormatter={(value) => `${value} ★`}
                              tickLine={false}
                              axisLine={false}
                              stroke="#888"
                              fontSize={12}
                            />
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
              </ScrollArea>
            </TabsContent>

            <TabsContent value="feedback" className="mt-4">
              <ScrollArea className="h-[50vh] pr-4">
                <div className="flex flex-col gap-6 py-4">
                  <Card className="bg-gray-950/50 border-gray-800">
                    <CardHeader>
                      <CardTitle>Low-Rated Call Transcripts</CardTitle>
                      <CardDescription>Review calls with a rating of 3 stars or less.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-800 hover:bg-gray-800/50">
                            <TableHead className="text-gray-300">Customer</TableHead>
                            <TableHead className="text-gray-300">Rating</TableHead>
                            <TableHead className="hidden md:table-cell text-gray-300">Comment</TableHead>
                            <TableHead className="text-right text-gray-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {lowRatedCalls.map((call) => (
                            <TableRow key={call.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                              <TableCell className="font-medium">{call.customer}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < call.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-gray-400 italic">
                                "{call.comment}"
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                                  onClick={() => handleViewTranscript(call)}
                                >
                                  <FileText className="mr-2 h-3 w-3" />
                                  Transcript
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="border-t border-gray-800 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleExport}
                        className="bg-gray-800 hover:bg-gray-700 border-gray-700"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Feedback
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-gray-950/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquareWarning className="h-5 w-5 text-orange-400" /> AI Sentiment Highlights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 list-disc list-inside text-gray-300">
                        {sentimentHighlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <div className="py-4">
                <Card className="bg-gray-950/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" /> Survey Settings
                    </CardTitle>
                    <CardDescription>Configure the post-call customer satisfaction survey.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="survey-toggle-modal" className="flex items-center gap-2">
                        <ToggleRight className="h-4 w-4" /> Enable Post-Call Survey
                      </Label>
                      <Switch id="survey-toggle-modal" defaultChecked />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="survey-prompt-modal">Survey Prompt</Label>
                      <Input
                        id="survey-prompt-modal"
                        defaultValue="On a scale of 1 to 5, how would you rate this interaction?"
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-800 pt-4">
                    <Button>Save Settings</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

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

      <TranscriptViewerModal
        open={isTranscriptModalOpen}
        onOpenChange={setTranscriptModalOpen}
        transcript={selectedCall?.transcript ?? null}
        callInfo={
          selectedCall
            ? {
                customer: selectedCall.customer,
                dateTime: selectedCall.dateTime,
                rating: selectedCall.rating,
              }
            : null
        }
      />
    </>
  )
}
