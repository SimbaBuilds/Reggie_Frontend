"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "How long does it take to scan files?",
      answer: "About 1 minute per person record."
    },
    {
      question: "How long after we scan will we have access to the digitized records?",
      answer: "Same day access."
    },
    {
      question: "Is this application FERPA compliant?",
      answer: "Yes, we are in compliance with all FERPA regulations."
    },
    {
      question: "My records are already digitized -- can I still use Reggie?",
      answer: "Yes, but Reggie requires specific file organization and names to work properly. Please contact support for details."
    },
    {
      question: "Can Reggie work with Microsoft 365?",
      answer: "Currently, Reggie is only compatible with Google Workspace and GSuite. You will need to create a school-managed Google account if you don't have one."
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}