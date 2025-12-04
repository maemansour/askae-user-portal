"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

type TranscriptViewerModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  transcript: string | null
  callInfo: {
    customer: string
    dateTime: string
    rating: number
  } | null
}

export function TranscriptViewerModal({ open, onOpenChange, transcript, callInfo }: TranscriptViewerModalProps) {
  if (!transcript || !callInfo) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-gray-900 border-gray-800 text-gray-50">
        <DialogHeader>
          <DialogTitle>Call Transcript</DialogTitle>
          <DialogDescription>
            {`Reviewing call with ${callInfo.customer} on ${new Date(callInfo.dateTime).toLocaleDateString()}. Rating: ${callInfo.rating}/5 stars.`}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[55vh] pr-4 my-4">
          <div className="font-mono text-sm bg-gray-950 p-4 rounded-md border border-gray-800 space-y-2 whitespace-pre-wrap">
            {transcript}
          </div>
        </ScrollArea>
        <DialogFooter>
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
