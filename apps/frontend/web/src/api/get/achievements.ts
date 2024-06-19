import { httpClient } from '../client';

const POST = 'api/achievements';

type GetUserAchievementsResponse = {
  achievements: {
    proofs: {
      proof: Buffer[];
      leaf: Object;
    }[];

    received: boolean;
    currentPoints: number;
    merkleSubmitted: boolean;
    achievement: {
      description: string;
      id: string;
      canHaveMany: boolean;
      imageUrl: string;
    };
  };
};

export const getUserAchievements = async ({ user }: { user: string }) => {
  const res = await httpClient.get<GetUserAchievementsResponse>(`${POST}/${encodeURIComponent(user)}`);

  if (res.status !== 200) throw new Error('Request failed');

  return {
    ...res,
  };
};