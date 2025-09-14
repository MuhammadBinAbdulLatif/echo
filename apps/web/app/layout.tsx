import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@workspace/ui/components/sonner";
import Script from "next/script";
const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Script
          src="https://echo-widget-eight.vercel.app/widget.js"
          data-organization-id="org_31yAmDUSu2LG7EAzEoklc6XxY8Q"
          strategy="afterInteractive"
        />
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#3c82f6",
            },
          }}
        >
          <Providers>
            <Toaster />
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
