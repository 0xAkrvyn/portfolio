"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ConfirmFn = (message: string, opts?: { title?: string; confirmLabel?: string }) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/** shadcn Dialog replacement for window.confirm() */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ message: string; title: string; confirmLabel: string } | null>(null);
  const resolver = useRef<(v: boolean) => void>(() => {});

  const confirm = useCallback<ConfirmFn>((message, opts) => {
    setState({ message, title: opts?.title ?? "Are you sure?", confirmLabel: opts?.confirmLabel ?? "Delete" });
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (v: boolean) => {
    resolver.current(v);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={!!state} onOpenChange={(o) => !o && close(false)}>
        <DialogContent showCloseButton={false} className="ring-primary/30">
          <DialogHeader>
            <DialogTitle className="text-primary">{state?.title}</DialogTitle>
            <DialogDescription className="text-primary/60">{state?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-primary/10 bg-secondary">
            <Button variant="ghost" onClick={() => close(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => close(true)}>{state?.confirmLabel}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside <ConfirmProvider>");
  return ctx;
}
