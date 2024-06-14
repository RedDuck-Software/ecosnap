import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { DaoVote } from './DaoVote.entity';
import { GarbageCollect } from './GarbageCollect.entity';

@Entity({ name: 'user' })
export class User extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'number' })
  points: number;

  @OneToMany(() => DaoVote, (v) => v.voter)
  daoVotes: DaoVote[];

  @OneToMany(() => GarbageCollect, (v) => v.user)
  garbageCollects: GarbageCollect[];
}
