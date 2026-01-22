"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { GlobalConfirmProvider } from "@/components/GlobalConfirm";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <GlobalConfirmProvider>{children}</GlobalConfirmProvider>
    </Provider>
  );
}
