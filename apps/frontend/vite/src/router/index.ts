import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

export const routes = {
  root: '/',
  photo: '/photo',
} as const;

export const router = createBrowserRouter([
  {
    path: routes.root,
    Component: lazy(() => import('../layouts/default-layout')),
    children: [
      {
        path: routes.root,
        Component: lazy(() => import('../pages/home')),
      },
    ],
  },
]);
