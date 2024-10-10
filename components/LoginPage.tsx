"use client"

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-screen">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            card: 'bg-background',
          }
        }}
      />
    </div>
  );
}