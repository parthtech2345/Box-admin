import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aavrit Packaging - Admin Control Center",
  description: "Enterprise management and dynamic homepage controller for Aavrit Packaging",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8F6F0] text-[#202A2E] antialiased">
        {children}
      </body>
    </html>
  );
}
