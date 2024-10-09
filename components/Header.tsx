"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useState } from 'react'; // Add this import

export default function Header() {
  const { setTheme, theme } = useTheme()
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulating login state

  return (
    <header className="bg-background shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Reggie
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/about" className="text-foreground hover:text-primary">About</Link>
          <Link href="/demos" className="text-foreground hover:text-primary">Demos</Link>
          <Link href="/faq" className="text-foreground hover:text-primary">FAQ</Link>
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-foreground hover:text-primary">Dashboard</Link>
              <Button variant="outline" onClick={() => setIsLoggedIn(false)}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" onClick={() => setIsLoggedIn(true)}>Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </nav>
    </header>
  );
}