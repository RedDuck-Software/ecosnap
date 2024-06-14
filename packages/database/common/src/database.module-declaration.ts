import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';
import { EnvReaderFunc } from './data-source-utils';

export class DatabaseModuleOptions {
  options?: (reader: EnvReaderFunc) => Partial<DataSourceOptions>;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, ASYNC_OPTIONS_TYPE, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<DatabaseModuleOptions>()
    .setExtras(
      {
        global: true,
        name: 'default',
      },
      (definition, extras) => ({
        ...definition,
        global: extras.global,
        name: extras.name,
      })
    )
    .setClassMethodName('forRoot')
    .build();
