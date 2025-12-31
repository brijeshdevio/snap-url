import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UploadTokenDocument = HydratedDocument<UploadToken>;

@Schema()
export class UploadToken {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'ApiKey' })
  apiKey: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true, index: true })
  tokenHash: string;

  @Prop({
    type: String,
    enum: ['avatar', 'cover', 'post', 'thumbnail', 'other'],
    default: 'avatar',
  })
  purpose: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  expiresAt: Date;

  @Prop({ type: Date, default: null })
  lastUsedAt: Date;

  @Prop({ type: String, default: null })
  idempotencyKey: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const UploadTokenSchema = SchemaFactory.createForClass(UploadToken);
