/**
 * Whether a Stripe key is a live one.
 *
 * Checking for `sk_live_` alone is wrong: a key created with restricted
 * permissions — the kind this shop should use, since it cannot move money
 * out of the account — is prefixed `rk_live_`. Reading that as "test" would
 * let the go-live scripts report the wrong mode at exactly the moment the
 * mode matters most.
 */
export function isLiveKey(key: string): boolean {
  return key.startsWith("sk_live_") || key.startsWith("rk_live_");
}

export function describeKey(key: string): string {
  const restricted = key.startsWith("rk_");
  return `${isLiveKey(key) ? "LIVE" : "test / sandbox"}${restricted ? " (restricted key)" : ""}`;
}
