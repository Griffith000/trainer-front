"use client";

import { Zap } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollAnimate } from "@/components/ui/scroll-animate";

const faqs = [
  {
    question: "How does the AI coaching actually work?",
    answer:
      "Our AI coach uses advanced natural language processing to understand your goals, preferences, and progress. It learns from your conversations and adapts its guidance to what works best for you. Think of it as a supportive friend who's always available and remembers everything about your journey.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Absolutely. We take your privacy seriously. Your conversations and personal data are encrypted and never shared with third parties. You can delete your data at any time. We only use your information to provide you with personalized coaching.",
  },
  {
    question: "Can I use AI Coach for any type of goal?",
    answer:
      "Yes! While we excel at fitness and wellness goals, AI Coach is designed to help with any habit-building or personal development goal. Whether it's learning a new skill, improving productivity, building better relationships, or developing mindfulness practices - we've got you covered.",
  },
  {
    question: "How is this different from other habit tracking apps?",
    answer:
      "Unlike simple habit trackers, AI Coach provides actual coaching through conversation. Instead of just checking boxes, you get personalized advice, motivation when you need it, and adaptive plans that change based on your progress. It's the difference between a to-do list and a personal coach.",
  },
  {
    question: "What if I miss a day or fall behind?",
    answer:
      "No judgment here! Life happens, and our AI understands that. Instead of making you feel guilty, it helps you get back on track with adjusted expectations and encouragement. The focus is on progress, not perfection.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="scroll-mt-16 px-4 py-20 sm:px-6 sm:py-28 lg:px-8 relative overflow-hidden"
    >
      {/* Energy background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl relative z-10">
        {/* Section header */}
        <ScrollAnimate animation="fade-in">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-600 dark:text-yellow-400">
              <Zap className="h-3.5 w-3.5" />
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked{" "}
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-primary bg-clip-text text-transparent">
                questions
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Got questions? We've got answers. If you don't find what you're
              looking for, feel free to reach out.
            </p>
          </div>
        </ScrollAnimate>

        {/* FAQ Accordion */}
        <ScrollAnimate animation="fade-in" delay={1}>
          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="border-border/50 transition-colors hover:border-yellow-500/30"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:text-yellow-600 dark:hover:text-yellow-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollAnimate>
      </div>
    </section>
  );
}
