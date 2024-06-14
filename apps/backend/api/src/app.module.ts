/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@gc/database-common';
import { defaultDataSource } from '@gc/database-gc';

import path from 'path';

class GlobalProviders {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: GlobalProviders,
      providers: [Logger],
      imports: [],
      exports: [Logger],
    };
  }
}

@Module({
  imports: [
    GlobalProviders.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.development', '.env', path.resolve('../../../.env')] }),
    DatabaseModule.forRootAsync({
      global: true,
      useFactory: async () => {
        return {
          options: (_) => defaultDataSource,
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
