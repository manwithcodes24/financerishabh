import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is NovaX and how does it work?",
    a: "NovaX is a next-generation decentralized investment platform that enables secure, transparent, and permissionless trading across 50+ blockchain networks. Our protocol uses advanced smart contracts to ensure trustless execution of all transactions.",
  },
  {
    q: "How do I start investing on NovaX?",
    a: "Getting started is simple. Connect your preferred Web3 wallet (MetaMask, WalletConnect, etc.), fund your account, and begin trading. Our platform supports both spot trading and DeFi yield opportunities.",
  },
  {
    q: "Is my investment secure?",
    a: "Security is our top priority. NovaX implements bank-grade encryption, multi-signature wallets, and has undergone multiple security audits by leading firms. All smart contracts are open-source and verifiable on-chain.",
  },
  {
    q: "What are the fees?",
    a: "NovaX offers competitive fee structures starting at 0.1% per trade. Holding NVX tokens provides fee discounts up to 50%. There are no hidden fees, deposit charges, or withdrawal penalties.",
  },
  {
    q: "How does staking work?",
    a: "Stake your NVX tokens to earn passive rewards. Our flexible staking program offers APY rates from 8% to 25% depending on the lock period. Rewards are distributed daily and can be compounded automatically.",
  },
  {
    q: "What chains does NovaX support?",
    a: "NovaX supports Ethereum, Solana, Polygon, Arbitrum, Optimism, Avalanche, BNB Chain, and 40+ additional networks. Our cross-chain bridge enables seamless asset transfers between supported chains.",
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
            Everything you need to know about NovaX.
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
