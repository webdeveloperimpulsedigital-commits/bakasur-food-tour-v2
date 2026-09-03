import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bakasur Ka Food Tour – Interactive Food Campaign & Contest",
  description: "Travel across iconic Indian restaurants with Bakasur! Feed his legendary appetite, fill the food meter, experience the Gastrium moment, and participate in the grand campaign.",
  keywords: ["Bakasur", "Food Tour", "Gastrium", "Indian Food", "Pune", "Mumbai", "Delhi", "Food Campaign"],
  openGraph: {
    title: "Bakasur Ka Food Tour – Interactive Food Campaign",
    description: "Feed Bakasur legendary dishes, fill the food meter, and win grand contest rewards!",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
