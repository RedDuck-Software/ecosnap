import { Column, ColumnOptions } from 'typeorm';
import { PublicKey } from '@solana/web3.js';
export function SolanaPubKeyColumn(
  columnDecorator: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...params: any
  ) => PropertyDecorator = Column,
  options?: Omit<ColumnOptions, 'type' | 'length' | 'transformer'>
): PropertyDecorator {
  return columnDecorator({
    type: 'varchar',
    transformer: {
      to: (value: PublicKey | undefined | null) => {
        return value?.toBase58()?.trim();
      },
      from: (value: string | undefined | null) => {
        return value ? new PublicKey(value) : value;
      },
    },
    ...(options ?? {}),
  });
}
