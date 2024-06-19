import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';

import { useAuth } from './use-auth';

import { postGeneratePassCode } from '@/api/post/event-generate-pass-code';

export const useGeneratePassCode = () => {
  const { publicKey } = useWallet();
  const { mutateAsync: auth } = useAuth();

  return useMutation({
    mutationFn: async ({ eventId }: { eventId: string }) => {
      if (!publicKey) {
        throw new Error('No public key');
      }

      const accessToken = await auth();

      const res = await postGeneratePassCode({
        eventId,
        jwt: accessToken,
      });

      if (!res.data) throw new Error('Request failed');

      return res.data.code;
    },
  });
};