import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { DaoVote } from './DaoVote.entity';
import { User } from './User.entity';
import { GarbageCollectDaoMerkleSubmission } from './GarbageCollectDaoMerkleSubmission.entity';

@Entity({ name: 'garbage_collect' })
export class GarbageCollect extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (v) => v.garbageCollects, { nullable: false, eager: true, onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => DaoVote, (v) => v.garbageCollect)
  daoVotes: DaoVote[];

  @Column({ type: 'number', nullable: true })
  pointsGiven?: number;

  @ManyToOne(() => GarbageCollectDaoMerkleSubmission, (v) => v.garbageCollects, { nullable: true })
  merkleSubmission?: GarbageCollectDaoMerkleSubmission;
}
