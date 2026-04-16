import './globals.css';
import { SessionProvider, useSession } from '../helpers/session';
import OnlineChecker from "../components/OnlineChecker";
import Footer from "../components/Footer"

function LayoutContent({ children }) {
  return (
    <div className="flex flex-col h-screen">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-10 pb-1 pt-1 pr-5 bg-slate-800 text-white ">
        <div className="flex flex-row gap-2 justify-end">
          <p className="companyName text-xl">AB&PS</p>
          <OnlineChecker />
        </div>
      </header>

      {/* MAIN */}
      <main className="pt-10 mt-0 mb-16 overflow-y-auto bg-gray-50 no-scrollbar">
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
          <LayoutContent>{children}</LayoutContent>
        </SessionProvider>
      </body>
    </html>
  );
}
