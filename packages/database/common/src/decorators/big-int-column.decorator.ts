import { Column, ColumnOptions } from 'typeorm';

export function BigIntColumn(
  columnDecorator: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...params: any
  ) => PropertyDecorator = Column,
  options?: Omit<ColumnOptions, 'type' | 'length' | 'transformer'>
): PropertyDecorator {
  return columnDecorator({
    type: 'varchar',
    transformer: {
      to: (value: bigint | undefined | null) => {
        return value?.toString()?.trim();
      },
      from: (value: string | undefined | null) => {
        return value ? BigInt(value.trim()).valueOf() : value;
      },
    },
    ...(options ?? {}),
  });
}
