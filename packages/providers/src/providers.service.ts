import { Inject, Injectable } from '@nestjs/common';
import { ProvidersModuleConfig } from './provider.module-definition';
import { Connection } from '@solana/web3.js';

@Injectable()
export class ProvidersService {
  constructor(
    @Inject('PROVIDERS_CONFIG')
    public readonly config: ProvidersModuleConfig
  ) {}

  getSolProvider() {
    if (!this.config.sol.rpc) throw new Error('Provider for SOL is not configured');
    const provider = new Connection(this.config.sol.rpc, 'finalized');
    return provider;
  }
}
