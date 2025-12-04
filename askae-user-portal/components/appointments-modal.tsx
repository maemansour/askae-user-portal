"use client"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, Calendar, Clock, Edit, XCircle, List, BarChart2 } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mockAppointments = [
  {
    id: "1",
    customer: "Jessica Miller",
    service: "Deep Tissue Massage",
    dateTime: "2025-08-05T14:00:00",
    agent: "Appointment Scheduler",
    status: "Booked",
  },
  {
    id: "2",
    customer: "David Chen",
    service: "Facial",
    dateTime: "2025-08-05T15:30:00",
    agent: "Appointment Scheduler",
    status: "Booked",
  },
  {
    id: "3",
    customer: "Sarah Lee",
    service: "Swedish Massage",
    dateTime: "2025-08-06T10:00:00",
    agent: "Appointment Scheduler",
    status: "Canceled",
  },
  {
    id: "4",
    customer: "Michael Brown",
    service: "Hot Stone Massage",
    dateTime: "2025-08-06T11:00:00",
    agent: "Appointment Scheduler",
    status: "Booked",
  },
  {
    id: "5",
    customer: "Emily White",
    service: "Facial",
    dateTime: "2025-08-07T13:00:00",
    agent: "Appointment Scheduler",
    status: "No-Show",
  },
  {
    id: "6",
    customer: "Chris Green",
    service: "Deep Tissue Massage",
    dateTime: "2025-08-08T16:00:00",
    agent: "Appointment Scheduler",
    status: "Booked",
  },
  {
    id: "7",
    customer: "Amanda Black",
    service: "Aromatherapy Massage",
    dateTime: "2025-08-08T17:00:00",
    agent: "Appointment Scheduler",
    status: "Booked",
  },
]

const serviceBreakdownData = [
  { service: "Deep Tissue", count: 2 },
  { service: "Facial", count: 2 },
  { service: "Swedish", count: 1 },
  { service: "Hot Stone", count: 1 },
  { service: "Aromatherapy", count: 1 },
]

const peakTimesData = [
  { hour: "9 AM", bookings: 3 },
  { hour: "10 AM", bookings: 5 },
  { hour: "11 AM", bookings: 8 },
  { hour: "12 PM", bookings: 6 },
  { hour: "1 PM", bookings: 9 },
  { hour: "2 PM", bookings: 11 },
  { hour: "3 PM", bookings: 7 },
  { hour: "4 PM", bookings: 4 },
  { hour: "5 PM", bookings: 2 },
]

export function AppointmentsModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [appointments, setAppointments] = useState(mockAppointments)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    status: "all",
    service: "all",
    agent: "all",
  })

  const updateAppointmentStatus = (appointmentId: string, newStatus: "Booked" | "Canceled" | "No-Show") => {
    setAppointments((currentAppointments) =>
      currentAppointments.map((appt) => (appt.id === appointmentId ? { ...appt, status: newStatus } : appt)),
    )
  }

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const searchMatch =
        appt.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.service.toLowerCase().includes(searchQuery.toLowerCase())
      const statusMatch = filters.status === "all" || appt.status.toLowerCase() === filters.status
      const serviceMatch = filters.service === "all" || appt.service === filters.service
      const agentMatch = filters.agent === "all" || appt.agent === filters.agent
      return searchMatch && statusMatch && serviceMatch && agentMatch
    })
  }, [searchQuery, filters, appointments])

  const handleExport = () => {
    const headers = ["Customer", "Service", "Date & Time", "Status", "Agent"]
    const rows = filteredAppointments.map((appt) => [
      appt.customer,
      appt.service,
      new Date(appt.dateTime).toLocaleString(),
      appt.status,
      appt.agent,
    ])
    const csvContent = [headers.join(","), ...rows.map((e) => e.join("\n"))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "appointments.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-gray-900 border-gray-800 text-gray-50">
        <DialogHeader>
          <DialogTitle className="text-2xl">Appointments Booked</DialogTitle>
          <DialogDescription>Analyze appointment data, filter by criteria, and export reports.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="list" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="list">
              <List className="mr-2 h-4 w-4" />
              Appointments List
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search name or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 focus:ring-teal-400"
                  />
                </div>
                <Select value={filters.status} onValueChange={(value) => setFilters((f) => ({ ...f, status: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                    <SelectItem value="no-show">No-Show</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="bg-gray-800 hover:bg-gray-700 border-gray-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
              <ScrollArea className="h-[35vh] pr-4">
                <TooltipProvider>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800 hover:bg-gray-800/50">
                        <TableHead className="text-gray-300">Customer</TableHead>
                        <TableHead className="text-gray-300">Service</TableHead>
                        <TableHead className="hidden md:table-cell text-gray-300">Date & Time</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-right text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appt) => (
                        <Tooltip key={appt.id} delayDuration={100}>
                          <TooltipTrigger asChild>
                            <TableRow className="border-b border-gray-800 hover:bg-gray-800/50">
                              <TableCell className="font-medium">{appt.customer}</TableCell>
                              <TableCell>{appt.service}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {new Date(appt.dateTime).toLocaleString()}
                              </TableCell>
                              <TableCell>{appt.status}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end items-center gap-2">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" aria-label="Edit Status">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem onClick={() => updateAppointmentStatus(appt.id, "Booked")}>
                                        Mark as Booked
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => updateAppointmentStatus(appt.id, "No-Show")}>
                                        Mark as No-Show
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>

                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Cancel"
                                        disabled={appt.status === "Canceled"}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-gray-900 border-gray-800">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will mark the appointment for {appt.customer} as Canceled.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 border-gray-700">
                                          Go back
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => updateAppointmentStatus(appt.id, "Canceled")}
                                          className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                          Confirm Cancellation
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            align="center"
                            className="bg-gray-950 border-gray-800 text-gray-50 p-3 rounded-lg shadow-xl"
                          >
                            <div className="grid gap-1.5">
                              <p className="font-semibold">{appt.customer}</p>
                              <div className="text-sm text-gray-400 grid grid-cols-[auto_1fr] gap-x-2">
                                <span className="font-medium text-gray-300">Service:</span>
                                <span>{appt.service}</span>
                                <span className="font-medium text-gray-300">Date:</span>
                                <span>{new Date(appt.dateTime).toLocaleDateString()}</span>
                                <span className="font-medium text-gray-300">Time:</span>
                                <span>
                                  {new Date(appt.dateTime).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                <span className="font-medium text-gray-300">Status:</span>
                                <span>{appt.status}</span>
                                <span className="font-medium text-gray-300">Agent:</span>
                                <span>{appt.agent}</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TableBody>
                  </Table>
                </TooltipProvider>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-950/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-4 w-4" /> Service Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <ChartContainer config={{ count: { label: "Count" } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={serviceBreakdownData} layout="vertical" margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="service"
                          type="category"
                          tickLine={false}
                          axisLine={false}
                          stroke="#888"
                          fontSize={12}
                          width={80}
                          interval={0}
                        />
                        <ChartTooltip
                          cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                          content={<ChartTooltipContent className="bg-gray-800 text-gray-50 border-gray-700" />}
                        />
                        <Bar dataKey="count" fill="#9ca3af" radius={[0, 4, 4, 0]} activeBar={{ fill: "#d1d5db" }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="bg-gray-950/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4" /> Peak Booking Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <ChartContainer config={{ bookings: { label: "Bookings" } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={peakTimesData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="hour" tickLine={false} axisLine={false} stroke="#888" fontSize={12} />
                        <YAxis tickLine={false} axisLine={false} stroke="#888" fontSize={12} />
                        <ChartTooltip
                          cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                          content={<ChartTooltipContent className="bg-gray-800 text-gray-50 border-gray-700" />}
                        />
                        <Bar dataKey="bookings" fill="#9ca3af" radius={[4, 4, 0, 0]} activeBar={{ fill: "#d1d5db" }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t border-gray-800 pt-4 sm:justify-end mt-px">
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
