import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SolanaPubKeyColumn, TimeKnownEntity } from '@gc/database-common';
import { DaoVote } from './DaoVote.entity';
import { GarbageCollect } from './GarbageCollect.entity';
import { PublicKey } from '@solana/web3.js';

@Entity({ name: 'garbage_collect_dao_merkle_submission' })
export class GarbageCollectDaoMerkleSubmission extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => GarbageCollect, (v) => v.merkleSubmission, { cascade: true })
  garbageCollects: GarbageCollect[];

  @Column({ type: 'varchar' })
  merkleRootHash?: string;

  @SolanaPubKeyColumn(undefined, { nullable: true })
  contractRootHashStatePubKey?: PublicKey;
}
