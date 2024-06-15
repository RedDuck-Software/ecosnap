import { httpClient } from '@/api/client';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const GET_POST_BY_ID = '/posts/';

export const getIntroMessage = async (publicKey: string) => {
  const randomId = Math.floor(Math.random() * 100 + 1);
  return publicKey
    ? (await httpClient.get<Post>(`${GET_POST_BY_ID}${randomId}`)).data?.title
    : '';
};
