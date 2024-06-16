import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { CleanupEventService } from './cleanup-event.service';
import { UseUserAuthGuard } from '../guards/user-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import 'multer';
import { RequestUser, UserClaims } from '../decorators/request-user.decorator';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export const CLEANUP_EVENT_API_TAG = 'Cleanup event';

export class ParticipateToEventDTO {
  @ApiProperty({ type: String })
  @IsString()
  signature: string;

  @ApiProperty({ type: String })
  @IsString()
  eventEntryCode: string;
}

export class AcceptParticipationDTO {
  @ApiProperty({ type: String })
  @IsString()
  signature: string;

  @ApiProperty({ type: String })
  @IsUUID()
  participationId: string;

  @ApiProperty({ type: String })
  @IsUUID()
  eventId: string;
}

export class AcceptResultsDTO {
  @ApiProperty({ type: String })
  @IsString()
  signature: string;

  @ApiProperty({ type: String })
  @IsUUID()
  participationId: string;

  @ApiProperty({ type: String })
  @IsUUID()
  eventId: string;
}

@Controller('cleanup-event')
@ApiTags(CLEANUP_EVENT_API_TAG)
export class CleanupController {
  constructor(private readonly cleanUpEventService: CleanupEventService) {}

  @Post('/participate')
  @UseUserAuthGuard()
  async postParticipate(@Body() { eventEntryCode, signature }: ParticipateToEventDTO, @RequestUser() user: UserClaims) {
    const event = await this.cleanUpEventService.participate({ signature, eventEntryCode, userPubKey: user.pubKey });
    return {
      participationId: event.id,
    };
  }

  @Post('/admin/participate/accept')
  @UseUserAuthGuard()
  async postAcceptParticipation(
    @Body() { participationId, signature, eventId }: AcceptParticipationDTO,
    @RequestUser() user: UserClaims
  ) {
    return await this.cleanUpEventService.acceptParticipation({
      adminPubKey: user.pubKey,
      eventId,
      participationId,
      signature,
    });
  }

  @Post('/admin/result/accept')
  @UseUserAuthGuard()
  async postAcceptResults(
    @Body() { eventId, participationId, signature }: AcceptResultsDTO,
    @RequestUser() user: UserClaims
  ) {
    return await this.cleanUpEventService.acceptEventResult({
      adminPubKey: user.pubKey,
      eventId,
      participationId,
      signature,
    });
  }

  @Get('/participate/message')
  getParticipateMessage(@Query('eventId') eventId: string) {
    return { message: this.cleanUpEventService.getParticipateMessage(eventId) };
  }

  @Get('/admin/participate/message')
  getAcceptParticipationMessage(@Query('eventId') eventId: string) {
    return { message: this.cleanUpEventService.getAcceptParticipationMessage(eventId) };
  }

  @Get('/admin/result/message')
  getAcceptResultsMessage(@Query('eventId') eventId: string) {
    return { message: this.cleanUpEventService.getAcceptResultMessage(eventId) };
  }
}
