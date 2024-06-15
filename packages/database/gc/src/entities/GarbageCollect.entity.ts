import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { DaoVote } from './DaoVote.entity';
import { User } from './User.entity';
import { GarbageCollectDaoMerkleSubmission } from './GarbageCollectDaoMerkleSubmission.entity';
import { File } from './File.entity';

@Entity({ name: 'garbage_collect' })
export class GarbageCollect extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (v) => v.garbageCollects, { nullable: false, eager: true, onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => DaoVote, (v) => v.garbageCollect, { cascade: true })
  daoVotes: DaoVote[];

  @OneToMany(() => File, (v) => v.garbageCollect, { cascade: true })
  files: File[];

  @Column({ type: 'int', nullable: true })
  pointsGiven?: number;

  @Column({ type: 'varchar', nullable: true, length: 120 })
  description?: string;

  @ManyToOne(() => GarbageCollectDaoMerkleSubmission, (v) => v.garbageCollects, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  merkleSubmission?: GarbageCollectDaoMerkleSubmission;
}
