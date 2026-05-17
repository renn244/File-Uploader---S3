import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { userProvider } from './user.provider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, userProvider],
  imports: [DatabaseModule],
  exports: [userProvider]
})
export class AuthModule {}
