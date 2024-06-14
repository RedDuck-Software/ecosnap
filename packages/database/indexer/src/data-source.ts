import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { getDataSourceOptions, readEnv } from '@gc/database-common';
import { EntityTest } from './entities';

export const defaultDataSource = getDataSourceOptions(readEnv, (readEnv) => ({
  entities: [EntityTest],
  migrations: readEnv('RUN_MIGRATION') ? ['**/migrations/*.{ts,js}'] : undefined,
  migrationsRun: false,
  synchronize: true,
  pool: {
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    acquireTimeoutMillis: 30000, // Time to wait to acquire a connection before timing out
  },
  extra: {
    cli: {
      migrationsDir: 'packages/database/gc/migrations',
    },
  },
  ssl:
    readEnv('DATABASE_SSL', 'true') === 'true'
      ? undefined
      : {
          rejectUnauthorized: false,
        },
}));

export const dataSource = new DataSource(defaultDataSource);
