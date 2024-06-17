import { Button } from '@/components/ui/button';
import { useSendIntroSignature } from '@/hooks/mutations/use-send-intro-signature';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  const { connected } = useWallet();
  const { mutateAsync: sendIntro } = useSendIntroSignature();

  const onSignMessage = async () => {
    try {
      await sendIntro();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className={`flex flex-1 flex-col items-center justify-between p-24`}>
      <WalletMultiButton />
      {connected && <Button onClick={onSignMessage}>Sign message</Button>}
    </main>
  );
}