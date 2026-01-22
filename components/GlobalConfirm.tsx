"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type ConfirmContext = {
  confirm: (opts?: ConfirmOptions) => Promise<boolean>;
};

const GlobalConfirmContext = createContext<ConfirmContext | undefined>(
  undefined
);

export function GlobalConfirmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions>({});
  const resolverRef = useRef<(value: boolean) => void | null>(null);

  const confirm = useCallback((options?: ConfirmOptions) => {
    setOpts(options || {});
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    setOpen(false);
    resolverRef.current?.(true);
    resolverRef.current = null;
  };

  const handleCancel = () => {
    setOpen(false);
    resolverRef.current?.(false);
    resolverRef.current = null;
  };

  return (
    <GlobalConfirmContext.Provider value={{ confirm }}>
      {children}

      <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{opts.title ?? "Confirm"}</DialogTitle>
            <DialogDescription>
              {opts.description ?? "Are you sure?"}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="ghost" onClick={handleCancel}>
              {opts.cancelLabel ?? "Cancel"}
            </Button>
            <Button
              variant={opts.destructive ? "destructive" : undefined}
              onClick={handleConfirm}
            >
              {opts.confirmLabel ?? "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GlobalConfirmContext.Provider>
  );
}

export function useGlobalConfirm() {
  const ctx = useContext(GlobalConfirmContext);
  if (!ctx)
    throw new Error(
      "useGlobalConfirm must be used within GlobalConfirmProvider"
    );
  return ctx.confirm;
}

export default GlobalConfirmProvider;
