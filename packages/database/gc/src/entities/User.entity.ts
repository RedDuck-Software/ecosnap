import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SolanaPubKeyColumn, TimeKnownEntity } from '@gc/database-common';
import { DaoVote } from './DaoVote.entity';
import { GarbageCollect } from './GarbageCollect.entity';
import { AuthNonce } from './AuthNonce.entity';
import { PublicKey } from '@solana/web3.js';
import { CleanupEvent } from './CleanupEvent.entity';

@Entity({ name: 'user' })
export class User extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  points: number;

  @SolanaPubKeyColumn(undefined, { unique: true })
  pubKey: PublicKey;

  @Column({
    type: 'boolean',
    default: false,
  })
  canVote: boolean;

  @OneToMany(() => DaoVote, (v) => v.voter, { cascade: true })
  daoVotes: DaoVote[];

  @OneToMany(() => AuthNonce, (v) => v.user, { cascade: true })
  authNonces: AuthNonce[];

  @OneToMany(() => GarbageCollect, (v) => v.user, { cascade: true })
  garbageCollects: GarbageCollect[];

  @ManyToMany(() => CleanupEvent, (v) => v.admins)
  cleanUpEventsAdmin: CleanupEvent[];
}
