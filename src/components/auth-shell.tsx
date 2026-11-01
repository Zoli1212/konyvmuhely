import Link from "next/link";

import { signInWithGoogle } from "@/actions/auth";
import { GoogleIcon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import type { Locale } from "@/i18n/config";

/** Shared frame for the sign-in and sign-up pages. */
export function AuthShell({
  title,
  lead,
  children,
  googleEnabled,
  googleLabel,
  googleUnavailable,
  dividerLabel,
  locale,
  next,
  footer,
}: {
  title: string;
  lead: string;
  children: React.ReactNode;
  googleEnabled: boolean;
  googleLabel: string;
  googleUnavailable: string;
  dividerLabel: string;
  locale: Locale;
  next?: string;
  footer: React.ReactNode;
}) {
  return (
    <div className="shell flex justify-center py-16 sm:py-24">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-semibold text-paper">
          {title}
        </h1>
        <p className="mt-2 text-sm text-paper-dim">{lead}</p>

        <div className="panel mt-8 p-6 sm:p-7">
          {googleEnabled ? (
            <>
              <form action={signInWithGoogle}>
                <input type="hidden" name="locale" value={locale} />
                {next ? <input type="hidden" name="next" value={next} /> : null}
                <SubmitButton className="btn btn-secondary w-full">
                  <GoogleIcon />
                  {googleLabel}
                </SubmitButton>
              </form>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-ink-700" />
                <span className="text-xs tracking-wide text-mute uppercase">
                  {dividerLabel}
                </span>
                <span className="h-px flex-1 bg-ink-700" />
              </div>
            </>
          ) : (
            <p className="mb-6 rounded-lg border border-ink-700 bg-ink-900 px-3.5 py-2.5 text-xs text-mute">
              {googleUnavailable}
            </p>
          )}

          {children}
        </div>

        <p className="mt-6 text-center text-sm text-mute">{footer}</p>
      </div>
    </div>
  );
}

/** "No account yet? Sign up" - the link under the card. */
export function AuthFooterLink({
  question,
  linkLabel,
  href,
}: {
  question: string;
  linkLabel: string;
  href: string;
}) {
  return (
    <>
      {question}{" "}
      <Link
        href={href}
        className="font-medium text-gold-300 transition-colors hover:text-gold-200"
      >
        {linkLabel}
      </Link>
    </>
  );
}
