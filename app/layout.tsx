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
        <Header />
      {/* MAIN */}
      <main className="mt-0 bg-slate-900  overflow-y-clipped no-scrollbar max-h-50">
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
