import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema()
export class Image {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'ApiKey' })
  apiKey: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'UploadToken' })
  uploadToken: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true, index: true })
  imageTokenHash: string;

  @Prop({
    type: String,
    enum: ['avatar', 'cover', 'post', 'thumbnail', 'other'],
    default: 'avatar',
  })
  purpose: string;

  @Prop({ type: String })
  publicId: string;

  @Prop({ type: String, required: true })
  displayName: string;

  @Prop({ type: String, default: null })
  url: string;

  @Prop({ type: String, default: null })
  mimeType: string;

  @Prop({ type: Number, default: null })
  size: number;

  @Prop({ type: Number, default: null })
  width: number;

  @Prop({ type: Number, default: null })
  height: number;

  @Prop({ type: Boolean, default: true })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ type: Date, default: null })
  expiresAt: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
