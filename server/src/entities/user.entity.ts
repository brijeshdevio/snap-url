import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

const STORAGE = 1024 * 1024 * 500; // 500MB

type AuthProvider = 'google' | 'github';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String, unique: true, sparse: true, index: true })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String, enum: ['google', 'github'] })
  authProvider: AuthProvider;

  @Prop({ type: String, unique: true, sparse: true })
  authId: string;

  @Prop({ type: String, enum: ['free', 'pro'] })
  plan: string;

  @Prop({ type: Number, default: STORAGE })
  storage: number;

  @Prop({ type: Number, default: 0 })
  storageUsed: number;

  @Prop({ type: String })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
