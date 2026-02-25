import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does WealthX work?",
    a: "You invest a minimum amount starting from Rs.5,000. I manage your crypto portfolio using proven trading strategies across multiple exchanges. At the end of each month, you receive your investment + 40% returns directly in your account.",
  },
  {
    q: "How do I start investing?",
    a: "Simply contact us on Telegram (link available on the website). We'll explain the process, you transfer the investment amount, and we start managing your portfolio immediately. It's that simple.",
  },
  {
    q: "Is my money safe?",
    a: "Absolutely. Your money is invested through verified crypto exchanges with top-tier security. I provide complete transparency with regular portfolio updates. Over 500 investors trust me with their money.",
  },
  {
    q: "What is the minimum investment?",
    a: "The minimum investment starts from Rs.5,000. You can invest any amount above that. Higher investments are managed with dedicated attention and priority support.",
  },
  {
    q: "How and when do I get my returns?",
    a: "Returns are paid out monthly. After the minimum 1-month period, you receive your original investment plus 40% returns. Payouts are made directly to your bank account or UPI.",
  },
  {
    q: "Can I withdraw my money anytime?",
    a: "Yes, after the minimum 1-month lock-in period, you can withdraw your investment along with returns. Just inform me 2-3 days in advance for processing.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" data-testid="faq-section" className="relative py-24 md:py-32">
      <div className="blur-blob w-[400px] h-[400px] bg-[#FF0080]/10 bottom-0 right-1/4" />

      <div className="max-w-3xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#00F0FF] border border-cyan-500/30 bg-cyan-500/10 mb-6">
            FAQ
          </span>
          <h2 className="font-['Unbounded'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Got <span className="text-gradient-cyan">Questions?</span>
          </h2>
          <p className="text-base md:text-lg text-[#A1A1AA] max-w-xl mx-auto">
            Everything you need to know about investing with WealthX.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                data-testid={`faq-item-${i}`}
                className="rounded-xl border border-white/[0.06] bg-[#0F0518]/40 backdrop-blur-sm px-6 overflow-hidden data-[state=open]:border-purple-500/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-sm md:text-base font-medium text-white hover:text-[#E056FD] transition-colors py-5 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[#A1A1AA] leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
