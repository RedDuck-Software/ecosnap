import { PublicKey } from '@solana/web3.js';

import { PostAsset } from './post-asset';

import { Button } from '../ui/button';

import { generateBlockies } from '@/lib/blockies';
import { shortenAddress } from '@/lib/utils';

type Props = {
  isMy: boolean;
  address: string;
};

export const Post = ({ isMy, address }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {generateBlockies(new PublicKey(address))}
          <p>{shortenAddress(address)}</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[12px] font-medium text-gray">15 min</p>
          {isMy && <Button className="p-2 h-4">...</Button>}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-medium">
          Lorem ipsum dolor sit amet consectetur. Nulla tempus aliquam viverra in nam posuere. Magna accumsan hendrerit
          ornare orci velit diam sed.
        </p>
        <div className="grid md:grid-cols-3 grid-cols-2 gap-2">
          <PostAsset src="/images/default-city.png" type="image" />
          <PostAsset src="https://media.w3.org/2010/05/sintel/trailer.mp4	" type="video" />
        </div>
      </div>
      <div className="flex gap-1 items-center">
        <Button variant="dark" className="text-primary">
          👍 {'100'}
        </Button>
        <Button variant="dark" className="text-danger">
          👎 {'5'}
        </Button>
      </div>
    </div>
  );
};
