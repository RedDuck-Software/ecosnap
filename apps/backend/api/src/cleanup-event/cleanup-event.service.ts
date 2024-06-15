import { BadRequestException, Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource } from 'typeorm';
import {
  CleanupEvent,
  CleanupEventParticipation,
  ParticipationResultsStatus,
  ParticipationStatus,
  User,
} from '@gc/database-gc';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';

@Injectable()
export class CleanupEventService {
  constructor(private readonly dataSource: DataSource) {}

  async participate({
    signature,
    eventEntryCode,
    userPubKey,
  }: {
    signature: string;
    eventEntryCode: string;
    userPubKey: PublicKey;
  }) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const eventRepo = manager.getRepository(CleanupEvent);
      const userRepo = manager.getRepository(User);
      const eventParticipationRepo = manager.getRepository(CleanupEventParticipation);

      const event = await eventRepo.findOneBy({
        entryCode: eventEntryCode,
      });

      if (!event) throw new BadRequestException('Event is not found');

      const user = await userRepo.findOneBy({
        pubKey: userPubKey,
      });

      if (!user) throw new BadRequestException('User is not found');

      const signedMessage = this.getParticipateMessage(event.id);

      const verified = nacl.sign.detached.verify(
        new TextEncoder().encode(signedMessage),
        bs58.decode(signature),
        userPubKey.toBuffer()
      );

      if (!verified) throw new BadRequestException('Invalid signature');

      const existingParticipation = await eventParticipationRepo.findOneBy({
        participant: {
          id: user.id,
        },
      });

      if (existingParticipation) throw new BadRequestException('Already participated to this event');

      const participation = await eventParticipationRepo.save(
        eventParticipationRepo.create({
          participant: user,
          cleanupEvent: event,
          participationSignature: signature,
        })
      );

      return participation;
    });
  }

  async acceptParticipation({
    signature,
    participationId,
    eventId,
    adminPubKey,
  }: {
    signature: string;
    participationId: string;
    eventId: string;
    adminPubKey: PublicKey;
  }) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const eventParticipationRepo = manager.getRepository(CleanupEventParticipation);

      const participation = await eventParticipationRepo.findOneBy({
        id: participationId,
        cleanupEvent: { id: eventId },
      });

      if (!participation) throw new BadRequestException('Participation is not found by id');

      const admin = await userRepo.findOneBy({
        pubKey: adminPubKey,
        cleanUpEventsAdmin: {
          id: eventId,
        },
      });

      if (!admin) throw new BadRequestException('Admin User for provided event is not found');

      // TODO: move to separate package
      const signedMessage = this.getAcceptParticipationMessage(participationId);

      const verified = nacl.sign.detached.verify(
        new TextEncoder().encode(signedMessage),
        bs58.decode(signature),
        adminPubKey.toBuffer()
      );

      if (!verified) throw new BadRequestException('Invalid signature');

      participation.participationSignature = signature;
      participation.participationStatus = ParticipationStatus.ACCEPTED;

      await manager.save(participation);
    });
  }

  async acceptEventResult({
    signature,
    participationId,
    eventId,
    adminPubKey,
  }: {
    signature: string;
    participationId: string;
    eventId: string;
    adminPubKey: PublicKey;
  }) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const eventParticipationRepo = manager.getRepository(CleanupEventParticipation);

      const participation = await eventParticipationRepo.findOne({
        where: {
          id: participationId,
          cleanupEvent: { id: eventId },
        },
        relations: {
          cleanupEvent: true,
          participant: true,
        },
      });

      if (!participation) throw new BadRequestException('Participation is not found by id');

      const admin = await userRepo.findOneBy({
        pubKey: adminPubKey,
        cleanUpEventsAdmin: {
          id: eventId,
        },
      });

      if (!admin) throw new BadRequestException('Admin User for provided event is not found');

      // TODO: move to separate package
      const signedMessage = this.getAcceptResultMessage(participationId);

      const verified = nacl.sign.detached.verify(
        new TextEncoder().encode(signedMessage),
        bs58.decode(signature),
        adminPubKey.toBuffer()
      );

      if (!verified) throw new BadRequestException('Invalid signature');

      participation.resultStatusSignature = signature;
      participation.resultsStatus = ParticipationResultsStatus.ACCEPTED;
      participation.participant.points += participation.cleanupEvent.rewards;
      // TODO: update `canVote` status if user points >= X points

      await manager.save(participation);
    });
  }

  getParticipateMessage(id: string) {
    return `Confirming participation for: ${id}`;
  }

  getAcceptParticipationMessage(id: string) {
    return `Accepting participation for: ${id}`;
  }

  getAcceptResultMessage(id: string) {
    return `Accepting cleanup result for: ${id}`;
  }
}
