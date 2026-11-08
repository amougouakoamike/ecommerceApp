type SyncResponse = {
  success: boolean;
  message?: string;
};

const isSyncResponse = (value: unknown): value is SyncResponse =>
  typeof value === 'object' &&
  value !== null &&
  'success' in value &&
  typeof value.success === 'boolean' &&
  (!('message' in value) || typeof value.message === 'string');

export const syncCurrentUser = async (
  getToken: () => Promise<string | null>,
): Promise<void> => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');
  if (!apiUrl) {
    throw new Error('Set EXPO_PUBLIC_API_URL in akoaApp/.env to your backend URL.');
  }

  const token = await getToken();
  if (!token) {
    throw new Error('Could not get your Clerk session. Please sign in again.');
  }

  const response = await fetch(`${apiUrl}/api/users/sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const responseText = await response.text();
  let payload: SyncResponse | undefined;

  if (responseText) {
    try {
      const parsed: unknown = JSON.parse(responseText);
      if (isSyncResponse(parsed)) {
        payload = parsed;
      }
    } catch {
      if (response.ok) {
        throw new Error('The backend returned an invalid account-sync response.');
      }
    }
  }

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload?.message ?? `Account sync failed with HTTP ${response.status}.`,
    );
  }
};
