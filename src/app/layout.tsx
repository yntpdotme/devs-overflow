import type {Metadata} from "next";
import {SessionProvider} from "next-auth/react";
import localFont from "next/font/local";

import {auth} from "@/auth";
import {Toaster} from "@/components/ui/toaster";
import ThemeProvider from "@/context/Theme";
import "./globals.css";

const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 700 800 900",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "300 400 500 700",
});

const GlobalLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
          />
        </head>
        <body
          className={`${inter.className} ${spaceGrotesk.variable} background-light850_dark100 relative antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>

          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
};

export default GlobalLayout;

export const metadata: Metadata = {
  title: "Devs Overflow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "/images/site-logo.svg",
  },
  generator: "Next.js",
  applicationName: "Devs Overflow",
  referrer: "origin-when-cross-origin",

  keywords: [
    "Devs Overflow",
    "programming questions",
    "developer Q&A",
    "web development",
    "JavaScript",
    "React",
    "Node.js",
    "algorithms",
    "data structures",
    "developer community",
  ],

  authors: [{name: "Akash Kadlag", url: "https://yntp.me"}],
  creator: "Akash Kadlag",
  publisher: "Devs Overflow",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
