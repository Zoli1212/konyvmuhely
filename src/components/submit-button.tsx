"use client";

import { useFormStatus } from "react-dom";

/**
 * A submit button that knows when its own form is in flight. Keeping this in
 * one place means every form in the app shows pending state the same way,
 * without any of them needing their own useState.
 */
export function SubmitButton({
  children,
  pendingLabel,
  className = "btn btn-primary",
  disabled = false,
  name,
  value,
  onClick,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  value?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      name={name}
      value={value}
      onClick={onClick}
      disabled={pending || disabled}
      aria-busy={pending}
      className={className}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
