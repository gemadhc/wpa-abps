import './globals.css';
import { SessionProvider, useSession } from '../helpers/session';
import OnlineChecker from "../components/OnlineChecker";
import Footer from "../components/Footer"
import {DateProvider, useDate} from "@/contexts/DateContext"


function LayoutContent({ children }) {
  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-13 py-2 pr-5 bg-slate-800 text-white ">
        <div className="flex flex-row gap-2 justify-end">
          <p className="companyName text-xs">American Backflow &<br/> Plumbing Services, Inc.</p>
          <OnlineChecker />
        </div>
      </header>

      {/* MAIN */}
      <main className="pt-15 mt-0  overflow-y-auto bg-gray-50 no-scrollbar h-screen">
        {children}
      </main>

      {/* FOOTER */}
        <footer >
          <Footer />
        </footer>
      
    </div>
  );
}

/* ROOT LAYOUT ----------------------------------------------------------- */

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/esh7blp.css" />
        <link rel="stylesheet" href="https://use.typekit.net/bgo3voa.css" />
      </head>

      <body className="flex flex-col min-h-screen bg-white text-gray-800 overflow-hidden">
        <SessionProvider>
          <DateProvider>
           <LayoutContent>{children}</LayoutContent>
          </DateProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
