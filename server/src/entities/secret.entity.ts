import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SecretDocument = HydratedDocument<Secret>;

@Schema({ timestamps: true })
export class Secret {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true, index: true })
  secretHash: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  revokedAt: Date;

  @Prop({ type: Date, default: null })
  lastUsedAt: Date;

  @Prop({ type: Date, default: null })
  expiredAt: Date;

  @Prop({ type: Number, default: 0 })
  usedCount: number;
}

export const SecretSchema = SchemaFactory.createForClass(Secret);
