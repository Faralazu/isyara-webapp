"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "./Navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Globe } from "lucide-react";
import { GithubIcon, IsyaraLogo } from "@/components/ui/icons";
import { APP_NAME, APP_TAGLINE, GITHUB_REPO_URL } from "@/lib/constants";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [locale, setLocale] = useState<"id" | "en">("id");

  const toggleLanguage = () => {
    setLocale((prev) => (prev === "id" ? "en" : "id"));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 font-semibold text-lg tracking-tight transition-opacity hover:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg py-1 px-1.5"
          aria-label={`${APP_NAME} - Beranda`}
        >
          <IsyaraLogo className="size-8 transition-transform duration-200 group-hover:scale-105 shadow-xs" />
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-foreground tracking-tight leading-none">
              {APP_NAME}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase mt-0.5">
              {APP_TAGLINE}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <Navigation orientation="horizontal" />
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Bilingual Indicator / Switcher (MOD-I18N) */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={
              locale === "id"
                ? "Beralih ke English (segera hadir)"
                : "Switch to Bahasa Indonesia (coming soon)"
            }
            aria-label={`Ganti bahasa. Saat ini: ${locale === "id" ? "Bahasa Indonesia" : "English"}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 px-2 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground"
            )}
          >
            <Globe className="size-3.5" aria-hidden="true" />
            <span className="uppercase">{locale}</span>
          </button>

          {/* GitHub Repository Link */}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Buka repository Isyara di GitHub"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 px-2.5 gap-1.5 text-xs font-medium hidden sm:inline-flex"
            )}
          >
            <GithubIcon className="size-3.5" />
            <span>GitHub</span>
          </a>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-controls="mobile-nav-menu"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "size-9 p-0 md:hidden text-muted-foreground hover:text-foreground"
            )}
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="border-b border-border/50 bg-background/95 px-4 pt-3 pb-5 backdrop-blur-lg md:hidden animate-in slide-in-from-top-2 duration-200"
        >
          <div className="mb-3">
            <Navigation
              orientation="vertical"
              onItemClick={() => setIsMobileMenuOpen(false)}
            />
          </div>

          <div className="pt-3 border-t border-border/40 flex items-center justify-between">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full justify-center gap-2 text-xs"
              )}
            >
              <GithubIcon className="size-4" />
              <span>Buka di GitHub</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
