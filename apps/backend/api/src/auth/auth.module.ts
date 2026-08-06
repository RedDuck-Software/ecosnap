import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '../jwt/jwt.module';
import { DatabaseModule } from '@gc/database-common';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule, DatabaseModule],
  exports: [AuthService],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
