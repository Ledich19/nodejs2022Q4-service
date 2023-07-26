import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [AuthModule, UserModule, ArtistModule, TrackModule],
})
export class AppModule {}
