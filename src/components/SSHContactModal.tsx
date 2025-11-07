"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Terminal, Copy, X, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type SSHContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SSH_COMMAND = "ssh ssh.pcstyle.dev";

export function SSHContactModal({ isOpen, onClose }: SSHContactModalProps) {
  const { translations } = useLanguage();
  const [copied, setCopied] = useState(false);

  // zamknij modal przy ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(SSH_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ssh-modal-title"
            className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="brutal-border brutal-shadow relative overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-background)] p-8">
              {/* close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border-4 border-[var(--color-ink)] bg-[var(--color-background)] text-[color:var(--color-ink)] transition-transform hover:rotate-90 hover:scale-110 hover:bg-[var(--color-magenta)] hover:text-white"
                aria-label={translations.contact.closeModal}
              >
                <X size={20} strokeWidth={3} aria-hidden="true" />
              </button>

              {/* header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Terminal className="h-8 w-8 text-[var(--color-cyan)]" aria-hidden="true" />
                  <h2 id="ssh-modal-title" className="text-3xl font-black uppercase text-[color:var(--color-ink)] sm:text-4xl">
                    {translations.contact.sshTitle}
                  </h2>
                </div>
                <p className="text-sm uppercase tracking-wide text-[color:var(--color-ink)]/60">
                  {translations.contact.sshSubtitle}
                </p>
              </div>

              {/* terminal preview */}
              <div className="mb-6 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-black p-6 font-mono">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-white/50">{translations.contact.terminal}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400">$</span>
                  <code className="text-green-400 text-lg font-bold">
                    {SSH_COMMAND}
                  </code>
                  <motion.span
                    className="inline-block h-5 w-0.5 bg-green-400"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* copy button */}
              <motion.button
                onClick={handleCopy}
                className="w-full brutal-border brutal-shadow bg-[var(--color-paper)] p-4 font-semibold uppercase tracking-wider text-[color:var(--color-ink)] transition-all hover:bg-[var(--color-cyan)] hover:text-[var(--color-background)] flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5" aria-hidden="true" />
                    <span>{translations.contact.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" aria-hidden="true" />
                    <span>{translations.contact.copyCommand}</span>
                  </>
                )}
              </motion.button>

              {/* info section */}
              <div className="mt-6 space-y-3 text-sm text-[color:var(--color-ink)]/70">
                <p className="font-medium uppercase tracking-wide">
                  {translations.contact.howItWorks}
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>{translations.contact.howItWorksSteps.step1}</li>
                  <li>{translations.contact.howItWorksSteps.step2}</li>
                  <li>{translations.contact.howItWorksSteps.step3}</li>
                  <li>{translations.contact.howItWorksSteps.step4}</li>
                </ol>
              </div>

              {/* decorative accent */}
              <div
                className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rotate-12 border-4 border-[var(--color-ink)] bg-[var(--color-cyan)] opacity-20"
                aria-hidden
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

