import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { envConfig } from '../../config/env.config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: envConfig.GITHUB_CLIENT_ID,
      clientSecret: envConfig.GITHUB_CLIENT_SECRET,
      callbackURL: envConfig.GITHUB_CALLBACK,
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      authProvider: 'github',
      authId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
    };
  }
}
