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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, ArrowLeft, Search, FileText } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

const callLogs = [
  {
    caller: "Jessica Miller",
    dateTime: "2024-08-02 10:45 AM",
    duration: "3m 12s",
    outcome: "Appointment Booked",
    transcript:
      "AI: Thank you for calling Maya's Spa, this is your AI assistant. How can I help you?\nJessica: Hi, I'd like to book a deep tissue massage.\nAI: I can book that for you. Are you an existing client?\nJessica: Yes, I am. Jessica Miller.\nAI: Thank you, Jessica. I see you here. We have an opening tomorrow at 2 PM or Friday at 11 AM. Which would you prefer?\nJessica: Friday at 11, please.\nAI: You're all set for a deep tissue massage this Friday at 11 AM. You'll receive a confirmation text shortly. Is there anything else?\nJessica: No, that's all. Thank you!\nAI: You're welcome. Have a wonderful day.",
  },
  {
    caller: "+1 (555) 123-4567",
    dateTime: "2024-08-02 10:41 AM",
    duration: "1m 05s",
    outcome: "Info Request",
    transcript:
      "AI: Thank you for calling Maya's Spa, this is your AI assistant. How can I help you?\nCaller: Yeah, what are your hours today?\nAI: We are open from 9 AM to 7 PM today. Would you like to book an appointment?\nCaller: No, just wanted to know the hours. Thanks.\nAI: You're welcome. Have a great day.",
  },
  {
    caller: "David Chen",
    dateTime: "2024-08-02 10:34 AM",
    duration: "2m 45s",
    outcome: "Cancellation",
    transcript:
      "AI: Thank you for calling Maya's Spa, this is your AI assistant. How can I help you?\nDavid: Hi, I need to cancel my appointment for today.\nAI: I can help with that. Can I get your name, please?\nDavid: David Chen.\nAI: Thank you, David. I see your appointment for a facial at 3 PM today. I've gone ahead and cancelled that for you. Would you like to reschedule?\nDavid: Not right now, thank you.\nAI: Understood. We've sent a cancellation confirmation to your number. We hope to see you again soon.",
  },
  {
    caller: "Sarah Lee",
    dateTime: "2024-08-02 10:18 AM",
    duration: "5m 50s",
    outcome: "Escalated to Staff",
    transcript:
      "AI: Thank you for calling Maya's Spa, this is your AI assistant. How can I help you?\nSarah: I have a question about a charge on my credit card from my last visit.\nAI: I can try to help with that. Can you please provide the date of your last visit?\nSarah: It was last Tuesday. I think the charge is wrong.\nAI: I understand your concern. For billing inquiries, I'll need to transfer you to one of our staff members. Please hold.\n[...call transferred...]",
  },
]

type CallLog = (typeof callLogs)[0]

export function CallLogModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCallLogs = callLogs.filter((log) => log.caller.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleDownloadCall = (caller: string, transcript: string) => {
    console.log(`Downloading call for: ${caller}`)
    const fileContent = `Call Transcript:\n\n${transcript}\n\n---\n(This file represents the call download, which would include the audio file.)`
    const blob = new Blob([fileContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `call-${caller.replace(/\s/g, "_").replace(/[^\w-]/g, "")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadAllCalls = () => {
    console.log("Downloading all calls...")
    const allCallData = callLogs
      .map(
        (log) =>
          `--- Call with ${log.caller} on ${log.dateTime} ---\n\nTranscript:\n${log.transcript}\n\n(Audio file would be included for this call.)\n\n`,
      )
      .join("\n")

    const blob = new Blob([allCallData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "all_call_logs.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadTranscript = (caller: string, transcript: string) => {
    console.log(`Downloading transcript for: ${caller}`)
    const blob = new Blob([transcript], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transcript-${caller.replace(/\s/g, "_").replace(/[^\w-]/g, "")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // When closing the main dialog, also reset the selected log view
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedLog(null)
      setSearchQuery("") // Reset search on close
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-gray-900 border-gray-800 text-gray-50">
        {!selectedLog ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Call Logs</DialogTitle>
              <DialogDescription>
                Review recent calls. Use the actions to view a transcript or download the call.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-4 my-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by caller name or number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 focus:ring-teal-400"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleDownloadAllCalls}
                className="bg-gray-800 hover:bg-gray-700 border-gray-700 whitespace-nowrap"
              >
                <Download className="mr-2 h-4 w-4" />
                Download All Calls
              </Button>
            </div>
            <ScrollArea className="h-[calc(60vh-80px)] pr-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-gray-800/50">
                    <TableHead className="text-gray-300">Caller</TableHead>
                    <TableHead className="hidden md:table-cell text-gray-300">Date & Time</TableHead>
                    <TableHead className="hidden sm:table-cell text-gray-300">Duration</TableHead>
                    <TableHead className="text-gray-300">Outcome</TableHead>
                    <TableHead className="text-right text-gray-300">Download / Transcript</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCallLogs.length > 0 ? (
                    filteredCallLogs.map((log, index) => (
                      <TableRow key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <TableCell className="font-medium">{log.caller}</TableCell>
                        <TableCell className="hidden md:table-cell">{log.dateTime}</TableCell>
                        <TableCell className="hidden sm:table-cell">{log.duration}</TableCell>
                        <TableCell>{log.outcome}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                              onClick={() => setSelectedLog(log)}
                            >
                              <FileText className="mr-2 h-3 w-3" />
                              Transcript
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadCall(log.caller, log.transcript)}
                              aria-label={`Download call for ${log.caller}`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                        No results found for "{searchQuery}".
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleOpenChange(false)}
                className="bg-gray-800 hover:bg-gray-700"
              >
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setSelectedLog(null)} aria-label="Back to call logs">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle>Call Transcript</DialogTitle>
              </div>
              <DialogDescription>{`Caller: ${selectedLog.caller} on ${selectedLog.dateTime}`}</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[55vh] pr-4 my-4">
              <div className="font-mono text-sm bg-gray-950 p-4 rounded-md border border-gray-800 space-y-2">
                {selectedLog.transcript.split("\n").map((line, index) => {
                  const parts = line.split(":")
                  const speaker = parts[0]
                  const text = parts.slice(1).join(":").trim()

                  if (speaker === "AI") {
                    return (
                      <div key={index}>
                        <span className="font-semibold text-teal-400">{speaker}:</span>
                        <span className="text-gray-200 ml-2">{text}</span>
                      </div>
                    )
                  } else if (line.includes(":")) {
                    // It's a caller
                    return (
                      <div key={index}>
                        <span className="font-semibold text-blue-400">{speaker}:</span>
                        <span className="text-gray-200 ml-2">{text}</span>
                      </div>
                    )
                  } else {
                    // It's a note like [...call transferred...]
                    return (
                      <div key={index} className="italic text-gray-500 text-center py-1">
                        {line}
                      </div>
                    )
                  }
                })}
              </div>
            </ScrollArea>
            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDownloadTranscript(selectedLog.caller, selectedLog.transcript)}
                className="bg-gray-800 hover:bg-gray-700 border-gray-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Transcript
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSelectedLog(null)}
                className="bg-gray-800 hover:bg-gray-700"
              >
                Back to Logs
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
