import { httpClient } from '../client';

export type Events = {
  events: {
    id: string;
    city: string;
    name: string;
    pictureUrl?: string;
    rewards: number;
    eventStartsAt: number;
    eventEndsAt: number;
    participants: number;
    maximumParticipants: number;
    description: string;
    admins: string[];
    files: { uri: string; fileExtension: string }[];
  }[];
};

const GET_EVENTS = 'api/cleanup-event';

export const getEvents = async () => {
  const events = await httpClient.get<Events>(`${GET_EVENTS}`);

  return events;
};
