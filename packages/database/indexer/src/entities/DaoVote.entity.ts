import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { User } from './User.entity';
import { GarbageCollect } from './GarbageCollect.entity';

@Entity({ name: 'dao_vote' })
export class DaoVote extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (v) => v.daoVotes)
  voter: User;

  @ManyToOne(() => GarbageCollect, (v) => v.daoVotes)
  garbageCollect: GarbageCollect;
}
