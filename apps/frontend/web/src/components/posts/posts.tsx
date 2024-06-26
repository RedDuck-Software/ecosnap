import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Post } from './post';

import { Message } from '../icons/message';
import { NewPost } from '../icons/new-post';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

import { useGetGcs } from '@/hooks/queries/use-get-gcs.ts';
import { useGetUser } from '@/hooks/queries/use-get-user';
import { useGetUserGcs } from '@/hooks/queries/use-get-user-gcs.ts';
import { generateBlockies } from '@/lib/blockies';
import { shortenAddress } from '@/lib/utils';
import { routes } from '@/router';

export const PostsTabs = () => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const posts = useGetGcs();
  const user = useGetUser();

  const userPosts = useGetUserGcs();

  const allPosts = useMemo(() => {
    return posts?.data?.gcs ?? [];
  }, [posts]);

  const discoverPosts = useMemo(() => {
    return userPosts?.data?.gcs ?? [];
  }, [userPosts]);

  return (
    <Tabs defaultValue="discover" className="w-full gap-4  flex items-center flex-col">
      <TabsList className="mx-auto">
        <TabsTrigger disabled={!publicKey} value="my-posts">
          My posts
        </TabsTrigger>
        <TabsTrigger value="discover">Discover</TabsTrigger>
      </TabsList>

      <TabsContent value="my-posts" className="gap-10 w-full flex flex-col">
        {publicKey && (
          <div className="w-full  rounded-[24px] p-6 flex bg-gray-blue flex-col gap-4">
            <div className="flex items-center gap-2">
              {generateBlockies(publicKey, 14)}
              <p>{shortenAddress(publicKey?.toString() || '')}</p>
            </div>
            <div className="flex gap-6 items-center">
              <div className="flex items-center gap-1">
                <Message className="w-4 h-4 [&_path]:fill-primary" />
                <p className="font-medium text-[16px] text-gray">Posts</p>
                <p className="font-semibold text-[16px]">{discoverPosts.length}</p>
              </div>
              <div className="flex items-center gap-1">
                <img src="/images/star.png" alt="star" />
                <p className="font-medium text-[16px] text-gray">Points</p>
                <p className="font-semibold text-[16px]">{user.data?.points ?? 0}</p>
              </div>
            </div>
          </div>
        )}
        {discoverPosts.map((post, i) => (
          <div className="flex flex-col ">
            <Post gcs={post} isMy={false} />
            {i < allPosts.length - 1 && <div className="w-full h-[1px] my-4 bg-gray-blue" />}
          </div>
        ))}
      </TabsContent>
      <TabsContent className="w-full" value="discover">
        {allPosts.map((post, i) => (
          <div className="flex flex-col ">
            <Post key={i} gcs={post} isMy={false} />
            {i < allPosts.length - 1 && <div className="w-full h-[1px] my-4 bg-gray-blue" />}
          </div>
        ))}
      </TabsContent>
      <Button
        onClick={() => navigate(routes.newPost)}
        disabled={!publicKey}
        className="rounded-full xl:hidden fixed bottom-[150px] lg:right-[20%] right-[10%]  p-3 shadow-glow"
      >
        <NewPost />
      </Button>
    </Tabs>
  );
};
