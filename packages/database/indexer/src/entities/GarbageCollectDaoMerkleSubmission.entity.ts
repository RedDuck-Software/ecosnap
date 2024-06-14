import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { DaoVote } from './DaoVote.entity';
import { GarbageCollect } from './GarbageCollect.entity';

@Entity({ name: 'garbage_collect_dao_merkle_submission' })
export class GarbageCollectDaoMerkleSubmission extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => GarbageCollect, (v) => v.merkleSubmission)
  garbageCollects: GarbageCollect[];

  @Column({ type: 'varchar' })
  merkleRootHash?: string;
}
