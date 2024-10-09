"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDigit, Clock, Database } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Reggie</h1>
        <p className="text-xl mb-8">Streamline Your Education Admin Workflows</p>
        <div className="flex justify-center space-x-4">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="lg">Watch Demo</Button>
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileDigit className="mr-2" />
                Quick Digitization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>No 4 month lead time: have your records digitized as soon as you can scan them to yourself.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2" />
                Efficient Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>No more jam-packed file rooms. Store all your records digitally and access them with ease.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2" />
                Time-Saving Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Save hours of labor for your team with Reggie, your records manager and spreadsheet expert.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Option 1: Digitize</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-4">$100</p>
              <p>One-time fee for digitization service</p>
              <Button className="mt-4" variant="outline">Choose Plan</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Option 2: Reggie Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-4">$50/month</p>
              <p>Includes Reggie assistant and digitization</p>
              <Button className="mt-4">Choose Plan</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="mb-8">Transform your administrative workflows today with Reggie.</p>
        <Link href="/signup">
          <Button size="lg">Sign Up Now</Button>
        </Link>
      </section>
    </div>
  );
}