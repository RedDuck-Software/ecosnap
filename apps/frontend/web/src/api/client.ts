import { Fetcher } from '@/lib/fetcher';

export const httpClient = new Fetcher(new URL('http://localhost:3002'), {
  'Content-Type': 'application/json',
});

export const formDataHttpClient = new Fetcher(new URL('http://localhost:3002'), {});
