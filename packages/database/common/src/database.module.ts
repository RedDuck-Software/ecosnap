import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { assert } from 'console';
import { getDataSourceOptions } from './data-source-utils';
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass } from './database.module-declaration';

@Module({})
export class DatabaseModule extends ConfigurableModuleClass {
  static forFeature(...options: Parameters<typeof TypeOrmModule.forFeature>) {
    return TypeOrmModule.forFeature(...options);
  }

  static forRootAsync(asyncOptions: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    assert(asyncOptions.useFactory, 'useFactory is undefined');

    return {
      ...super.forRootAsync(asyncOptions),
      global: asyncOptions.global,
      exports: [TypeOrmModule],
      imports: [
        ...(asyncOptions.imports ?? []),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          name: asyncOptions.name,
          useFactory: async (configService: ConfigService) => {
            const options = await asyncOptions.useFactory?.(configService);

            return getDataSourceOptions((key: string) => configService.get(key), options?.options);
          },
        }),
      ],
    };
  }
}
