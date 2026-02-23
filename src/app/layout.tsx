import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@telegram-apps/telegram-ui/dist/styles.css";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyRafeeq",
  description: "Your Islamic companion",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.onerror=function(m,s,l,c,e){document.body.innerHTML='<pre style="color:red;padding:20px;word-break:break-all">'+m+'\\n'+s+':'+l+':'+c+'\\n'+(e&&e.stack||'')+'</pre>'};`,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
