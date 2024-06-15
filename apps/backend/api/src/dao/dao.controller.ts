import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { DaoService } from './dao.service';
import { UseDaoUserAuthGuard } from '../guards/dao-user-auth.guard';
import { RequestUser, UserClaims } from '../decorators/request-user.decorator';

export const DAO_API_TAG = 'DAO';

export enum CastVoteDirection {
  FOR,
  AGAINST,
}

export class CastVoteDTO {
  garbageCollectId: string;
  signature: string;
  voteDirection: CastVoteDirection;
}

@Controller('dao')
@ApiTags(DAO_API_TAG)
export class DaoController {
  constructor(private readonly daoService: DaoService) {}

  @Post('/vote')
  @UseDaoUserAuthGuard()
  async postCastVote(@Body() castVote: CastVoteDTO, @RequestUser() { pubKey }: UserClaims) {
    return this.daoService.castVote({ ...castVote, voterPubKey: pubKey });
  }

  @Get('/vote/message')
  getSignMessage(@Query('gcId') gcId: string, @Query('voteDirection') voteDirection: CastVoteDirection) {
    return this.daoService.getSignMessage(gcId, voteDirection);
  }
}
