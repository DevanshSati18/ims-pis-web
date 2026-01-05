"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAuthInit } from "@/hooks/useAuthInit";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInit();
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthInitializer>{children}</AuthInitializer>
        </Provider>
      </body>
    </html>
  );
}
