import React from "react";

type SocialLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export default function Footer() {
  const socials: SocialLink[] = [
    {
      label: "Instagram",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm10.25 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.9.3-1.6 1.7-1.6H17V4.8c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.8v8h3.7Z" />
        </svg>
      ),
    },
    {
      label: "Twitter",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d="M18.5 2h3l-6.6 7.5L22 22h-6.9l-4.3-5.9L5.6 22H2l7.1-8.1L2 2h7.1l3.9 5.3L18.5 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.4 20Z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3.5 21V9h3v12h-3ZM9 9h2.9v1.7h.04c.4-.75 1.4-1.55 2.9-1.55C18 9.15 19.5 11 19.5 14.2V21h-3v-6.1c0-1.45-.03-3.3-2-3.3s-2.3 1.56-2.3 3.2V21H9V9Z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="bg-slate-900">
        {/* Pattern layer (pure CSS, no image needed) */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.18)_0,transparent_35%),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.12)_0,transparent_40%),radial-gradient(circle_at_40%_90%,rgba(255,255,255,0.10)_0,transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:26px_26px]" />
        </div>

        <div className="relative px-4 sm:px-6 md:px-10 py-10">
          <div className="mx-auto max-w-[1200px] flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Social icons */}
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="h-12 w-12 rounded-full border-2 border-yellow-400 text-yellow-400 flex items-center justify-center
                             hover:bg-yellow-400 hover:text-slate-900 transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Right text */}
            <div className="text-sm text-slate-200/90">
              © {new Date().getFullYear()} All Rights Reserved By{" "}
              <span className="font-semibold text-slate-100">DigiMark</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}