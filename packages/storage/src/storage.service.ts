import { Inject, Injectable } from '@nestjs/common';
import { StorageModuleConfig } from './storage.module-definition';
import { Connection } from '@solana/web3.js';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_CONFIG')
    public readonly config: StorageModuleConfig
  ) {}
}
