import './globals.css';
import { SessionProvider, useSession } from '../helpers/session';
import OnlineChecker from "../components/OnlineChecker";
import Footer from "../components/Footer"
import Header from "../components/Header"
import {DateProvider, useDate} from "@/contexts/DateContext"
import { ViewProvider } from '@/contexts/ViewContext';


function LayoutContent({ children }) {
  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-13 py-2 pr-5 bg-slate-800 text-white ">
        <Header />
      </header>

      {/* MAIN */}
      <main className="pt-15 mt-0 bg-gray-50  overflow-y-clipped no-scrollbar max-h-50">
        {children}
      </main>

      {/* FOOTER */}
        <footer>
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

      <body className ="no-scrollbar h-screen overflow-y-clipped">
        <SessionProvider>
          <DateProvider>
          <ViewProvider>
           <LayoutContent>
              {children}
            </LayoutContent>
          </ViewProvider>
          </DateProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
