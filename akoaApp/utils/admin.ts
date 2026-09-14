type ClerkUserLike = {
  publicMetadata?: Record<string, unknown> | null;
  privateMetadata?: Record<string, unknown> | null;
  emailAddresses?: Array<{ emailAddress?: string | null } | null> | null;
  primaryEmailAddress?: { emailAddress?: string | null } | null;
};

export const ADMIN_EMAILS = [
  'amougouakoamike7@gmail.com',
  'admin@akoaapp.com',
  'admin@akoa.com',
  'admin@example.com',
];

const normalizeEmail = (value?: string) => value?.trim().toLowerCase();

export const isAdminUser = (user?: ClerkUserLike | null) => {
  if (!user) return false;

  const publicRole = user.publicMetadata?.role;
  const privateRole = user.privateMetadata?.role;
  const role =
    typeof publicRole === 'string'
      ? publicRole
      : typeof privateRole === 'string'
        ? privateRole
        : '';

  if (role.toLowerCase() === 'admin') return true;
  if (user.publicMetadata?.admin === true || user.privateMetadata?.admin === true) return true;

  const email =
    normalizeEmail(user.primaryEmailAddress?.emailAddress ?? undefined) ??
    normalizeEmail(user.emailAddresses?.find((address) => !!address)?.emailAddress ?? undefined) ??
    '';

  if (!email) return false;

  const matchesAdminEmail = ADMIN_EMAILS.some((adminEmail) => normalizeEmail(adminEmail) === email);
  const includesAdminKeyword = email.includes('admin');

  return matchesAdminEmail || includesAdminKeyword;
};
