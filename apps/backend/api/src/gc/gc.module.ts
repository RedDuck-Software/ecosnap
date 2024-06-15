import { Module } from '@nestjs/common';
import { GcService } from './gc.service';
import { JwtModule } from '../jwt/jwt.module';
import { DatabaseModule } from '@gc/database-common';
import { GcController } from './gc.controller';

@Module({
  imports: [DatabaseModule],
  exports: [GcService],
  providers: [GcService],
  controllers: [GcController],
})
export class GcModule {}
