import { PrimaryGeneratedColumn } from 'typeorm';
import {  TimeKnownEntity } from '@gc/database-common';

export class EntityTest extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
