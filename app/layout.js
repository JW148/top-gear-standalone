import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./Components/ui/navBar";
import Footer from "./Components/ui/footer";
import { Providers } from "./lib/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Top Gear Specialist Cars",
  description: "Unleash your passion for prestige cars",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NavBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
