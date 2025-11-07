"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Send, X, Loader2, Check, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type WebContactFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ContactFormData = {
  message: string;
  name?: string;
  email?: string;
  discord?: string;
  phone?: string;
  facebook?: string;
  source: "web";
};

type FieldError = {
  field: string;
  message: string;
};

// validation helpers - proste ale działają
function validateEmail(email: string): boolean {
  if (!email) return true; // optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateURL(url: string): boolean {
  if (!url) return true; // optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function WebContactForm({ isOpen, onClose }: WebContactFormProps) {
  const { translations } = useLanguage();
  const [formData, setFormData] = useState<ContactFormData>({
    message: "",
    name: "",
    email: "",
    discord: "",
    phone: "",
    facebook: "",
    source: "web",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const firstInputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // zamknij modal przy ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  // focus first field when modal opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      // mały delay żeby animacja się skończyła
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        message: "",
        name: "",
        email: "",
        discord: "",
        phone: "",
        facebook: "",
        source: "web",
      });
      setErrors({});
      setSubmitStatus("idle");
      setSubmitMessage("");
    }
  }, [isOpen]);

  // validation - matching API schema
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "message":
        if (!value.trim()) return translations.contact.validation.messageRequired;
        if (value.length > 2000) return translations.contact.validation.messageTooLong;
        if (value.length < 1) return translations.contact.validation.messageRequired;
        return "";
      case "name":
        if (value && value.length > 100) return translations.contact.validation.nameTooLong;
        return "";
      case "email":
        if (value && value.length > 100) return translations.contact.validation.emailTooLong;
        if (value && !validateEmail(value)) return translations.contact.validation.emailInvalid;
        return "";
      case "discord":
        if (value && value.length > 100) return translations.contact.validation.discordTooLong;
        return "";
      case "phone":
        if (value && value.length > 50) return translations.contact.validation.phoneTooLong;
        return "";
      case "facebook":
        if (value && value.length > 200) return translations.contact.validation.facebookTooLong;
        if (value && !validateURL(value)) return translations.contact.validation.facebookInvalid;
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // validate all fields
    Object.keys(formData).forEach((key) => {
      if (key !== "source") {
        const error = validateField(key, formData[key as keyof ContactFormData] as string);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("idle");
    setSubmitMessage("");

    if (!validateForm()) {
      setSubmitMessage("Please fix the errors above");
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);

    // prepare data - remove empty optional fields
    const payload: ContactFormData = {
      message: formData.message.trim(),
      source: "web",
    };

    if (formData.name?.trim()) payload.name = formData.name.trim();
    if (formData.email?.trim()) payload.email = formData.email.trim();
    if (formData.discord?.trim()) payload.discord = formData.discord.trim();
    if (formData.phone?.trim()) payload.phone = formData.phone.trim();
    if (formData.facebook?.trim()) payload.facebook = formData.facebook.trim();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // handle different error types
        if (response.status === 429) {
          setSubmitMessage(translations.contact.errors.tooManyRequests);
        } else if (response.status === 400 && data.details) {
          // validation errors from API
          const apiErrors: Record<string, string> = {};
          data.details.forEach((detail: { path: string[]; message: string }) => {
            const field = detail.path[0];
            apiErrors[field] = detail.message;
          });
          setErrors((prev) => ({ ...prev, ...apiErrors }));
          setSubmitMessage(translations.contact.errors.fixValidationErrors);
        } else {
          setSubmitMessage(data.error || translations.contact.errors.failed);
        }
        setSubmitStatus("error");
        setIsSubmitting(false);
        return;
      }

      // success!
      setSubmitStatus("success");
      setSubmitMessage(data.message || translations.contact.success);
      
      // reset form
      setFormData({
        message: "",
        name: "",
        email: "",
        discord: "",
        phone: "",
        facebook: "",
        source: "web",
      });
      setErrors({});

      // close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitMessage(translations.contact.errors.networkError);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageLength = formData.message.length;
  const isFormValid = formData.message.trim().length >= 1 && formData.message.length <= 2000 && Object.keys(errors).length === 0;

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
            className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="brutal-border brutal-shadow relative overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-background)] p-8">
              {/* close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border-4 border-[var(--color-ink)] bg-[var(--color-background)] text-[color:var(--color-ink)] transition-transform hover:rotate-90 hover:scale-110 hover:bg-[var(--color-magenta)] hover:text-white"
                aria-label={translations.contact.closeModal}
              >
                <X size={20} strokeWidth={3} />
              </button>

              {/* header */}
              <div className="mb-6">
                <h2 className="text-3xl font-black uppercase text-[color:var(--color-ink)] sm:text-4xl">
                  {translations.contact.webTitle}
                </h2>
                <p className="mt-2 text-sm uppercase tracking-wide text-[color:var(--color-ink)]/60">
                  {translations.contact.webSubtitle}
                </p>
              </div>

              {/* form */}
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* message field - required */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[color:var(--color-ink)]"
                  >
                    {translations.contact.message} <span className="text-[var(--color-magenta)]">*</span>
                  </label>
                  <textarea
                    ref={firstInputRef}
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={6}
                    required
                    maxLength={2000}
                    className={`w-full rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-4 font-mono text-sm text-[color:var(--color-ink)] transition-all focus:border-[var(--color-magenta)] focus:outline-none focus:ring-0 ${
                      errors.message ? "border-[var(--color-magenta)] bg-[var(--color-magenta)]/10" : ""
                    }`}
                    placeholder={translations.contact.messagePlaceholder}
                    aria-describedby={errors.message ? "message-error" : "message-help"}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    {errors.message ? (
                      <span id="message-error" className="text-xs font-semibold text-[var(--color-magenta)]" role="alert">
                        {errors.message}
                      </span>
                    ) : (
                      <span id="message-help" className="text-xs text-[color:var(--color-ink)]/60">
                        {translations.contact.messageRequired}
                      </span>
                    )}
                    <span className={`text-xs font-mono ${messageLength > 2000 ? "text-[var(--color-magenta)]" : "text-[color:var(--color-ink)]/60"}`}>
                      {messageLength}/2000
                    </span>
                  </div>
                </div>

                {/* optional fields grid */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[color:var(--color-ink)]"
                    >
                      {translations.contact.name}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={100}
                      className={`w-full rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-3 font-mono text-sm text-[color:var(--color-ink)] transition-all focus:border-[var(--color-cyan)] focus:outline-none focus:ring-0 ${
                        errors.name ? "border-[var(--color-magenta)] bg-[var(--color-magenta)]/10" : ""
                      }`}
                      placeholder={translations.contact.optional}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <span id="name-error" className="mt-1 block text-xs font-semibold text-[var(--color-magenta)]" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[color:var(--color-ink)]"
                    >
                      {translations.contact.email}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={100}
                      className={`w-full rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-3 font-mono text-sm text-[color:var(--color-ink)] transition-all focus:border-[var(--color-cyan)] focus:outline-none focus:ring-0 ${
                        errors.email ? "border-[var(--color-magenta)] bg-[var(--color-magenta)]/10" : ""
                      }`}
                      placeholder={translations.contact.optional}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <span id="email-error" className="mt-1 block text-xs font-semibold text-[var(--color-magenta)]" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* discord */}
                  <div>
                    <label
                      htmlFor="discord"
                      className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[color:var(--color-ink)]"
                    >
                      {translations.contact.discord}
                    </label>
                    <input
                      id="discord"
                      name="discord"
                      type="text"
                      value={formData.discord}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={100}
                      className={`w-full rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-3 font-mono text-sm text-[color:var(--color-ink)] transition-all focus:border-[var(--color-cyan)] focus:outline-none focus:ring-0 ${
                        errors.discord ? "border-[var(--color-magenta)] bg-[var(--color-magenta)]/10" : ""
                      }`}
                      placeholder={translations.contact.optional}
                      aria-describedby={errors.discord ? "discord-error" : undefined}
                    />
                    {errors.discord && (
                      <span id="discord-error" className="mt-1 block text-xs font-semibold text-[var(--color-magenta)]" role="alert">
                        {errors.discord}
                      </span>
                    )}
                  </div>

                  {/* phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[color:var(--color-ink)]"
                    >
                      {translations.contact.phone}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={50}
                      className={`w-full rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-3 font-mono text-sm text-[color:var(--color-ink)] transition-all focus:border-[var(--color-cyan)] focus:outline-none focus:ring-0 ${
                        errors.phone ? "border-[var(--color-magenta)] bg-[var(--color-magenta)]/10" : ""
                      }`}
                      placeholder={translations.contact.optional}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                    {errors.phone && (
                      <span id="phone-error" className="mt-1 block text-xs font-semibold text-[var(--color-magenta)]" role="alert">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* facebook - full width */}
                <div>
                  <label
                    htmlFor="facebook"
                    className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[color:var(--color-ink)]"
                  >
                    {translations.contact.facebook}
                  </label>
                  <input
                    id="facebook"
                    name="facebook"
                    type="url"
                    value={formData.facebook}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={200}
                    className={`w-full rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-3 font-mono text-sm text-[color:var(--color-ink)] transition-all focus:border-[var(--color-cyan)] focus:outline-none focus:ring-0 ${
                      errors.facebook ? "border-[var(--color-magenta)] bg-[var(--color-magenta)]/10" : ""
                    }`}
                    placeholder={translations.contact.facebookPlaceholder}
                    aria-describedby={errors.facebook ? "facebook-error" : undefined}
                  />
                  {errors.facebook && (
                    <span id="facebook-error" className="mt-1 block text-xs font-semibold text-[var(--color-magenta)]" role="alert">
                      {errors.facebook}
                    </span>
                  )}
                </div>

                {/* submit status message */}
                {submitStatus === "error" && submitMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 rounded-[var(--radius-card)] border-4 border-[var(--color-magenta)] bg-[var(--color-magenta)]/10 p-4"
                  >
                    <AlertCircle className="h-5 w-5 text-[var(--color-magenta)]" />
                    <span className="text-sm font-semibold text-[var(--color-magenta)]">{submitMessage}</span>
                  </motion.div>
                )}

                {submitStatus === "success" && submitMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 rounded-[var(--radius-card)] border-4 border-[var(--color-cyan)] bg-[var(--color-cyan)]/10 p-4"
                  >
                    <Check className="h-5 w-5 text-[var(--color-cyan)]" />
                    <span className="text-sm font-semibold text-[var(--color-ink)]">{submitMessage}</span>
                  </motion.div>
                )}

                {/* submit button */}
                <motion.button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full brutal-border brutal-shadow bg-[var(--color-paper)] p-4 font-semibold uppercase tracking-wider text-[color:var(--color-ink)] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-magenta)] hover:text-white disabled:hover:bg-[var(--color-paper)] disabled:hover:text-[color:var(--color-ink)] flex items-center justify-center gap-3"
                  whileHover={!isSubmitting && isFormValid ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isSubmitting && isFormValid ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{translations.contact.sending}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>{translations.contact.sendMessage}</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* decorative accent block */}
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
