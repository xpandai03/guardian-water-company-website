"use client";

import { CircleCheck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// "What happens next" modal — opens after a successful /api/leads submission
// (see EstimateForm). Closeable via the Got it button, the X, ESC, or
// backdrop click. The form transitions to a brief inline thank-you state
// once the modal closes so the user can't accidentally re-submit.
export function SuccessModal({ open, onOpenChange }: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center sm:text-center">
          <div
            className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft"
            aria-hidden="true"
          >
            <CircleCheck className="h-7 w-7 text-cta" strokeWidth={1.75} />
          </div>
          <DialogTitle className="text-2xl font-bold text-primary">
            What happens next
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-muted-foreground">
            We&apos;ll contact you within 1 business day to schedule your
            in-home water test. Most appointments take 30-60 minutes.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button
              type="button"
              size="lg"
              className="w-full rounded-full bg-cta font-semibold text-cta-foreground hover:bg-cta/90 sm:w-auto"
            >
              Got it
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
