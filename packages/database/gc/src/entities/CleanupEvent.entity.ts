import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { User } from './User.entity';
import { CleanupEventParticipation } from './CleanupEventParticipation.entity';
import { MerkleSubmission } from './MerkleSubmission.entity';

@Entity({ name: 'cleanup_event' })
export class CleanupEvent extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  rewards: number;

  @Column({ type: 'timestamptz' })
  eventStartsAt: Date;

  @Column({ type: 'timestamptz' })
  eventEndsAt: Date;

  @Column({ type: 'varchar', unique: true })
  entryCode: string;

  @OneToMany(() => CleanupEventParticipation, (v) => v.cleanupEvent, { cascade: true })
  participants: CleanupEventParticipation[];

  @ManyToMany(() => User, (v) => v.cleanUpEventsAdmin, { cascade: true })
  @JoinTable()
  admins: User[];

  @ManyToMany(() => MerkleSubmission)
  @JoinTable()
  merkleSubmissions?: MerkleSubmission[];
}
