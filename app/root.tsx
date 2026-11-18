import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { DemoProvider } from "@/lib/store";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { GuidedTourModal } from "@/components/tour/GuidedTourModal";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Zirium AI — Customer Intelligence Service</title>
        <meta
          name="description"
          content="Zirium AI Customer Intelligence Service: Autonomous guest retention, rhythm prediction, and consent-gated campaign approvals."
        />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-[#EAF6FC] text-[#0F2A3A]">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <div className="flex min-h-screen w-full bg-[#EAF6FC]">
        {/* Desktop Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0 pb-20 lg:pb-8">
          <TopBar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />

        {/* Guided Tour Overlay */}
        <GuidedTourModal />
      </div>
    </DemoProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-6 container mx-auto text-center max-w-md">
      <div className="rounded-3xl bg-white p-8 shadow-xl border border-red-200">
        <h1 className="text-2xl font-bold text-red-600 mb-2">{message}</h1>
        <p className="text-sm text-slate-600 mb-6">{details}</p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-[#0E7C9B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0B647D]"
        >
          Return to Dashboard
        </a>
      </div>
      {stack && (
        <pre className="mt-6 text-left p-4 bg-slate-900 text-slate-200 rounded-xl text-xs overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
