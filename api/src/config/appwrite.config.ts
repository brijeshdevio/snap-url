import sdk from 'node-appwrite';
import { envConfig } from './env.config';

const client = new sdk.Client()
  .setEndpoint(envConfig.APPWRITE_ENDPOINT)
  .setProject(envConfig.APPWRITE_PROJECT_ID)
  .setKey(envConfig.APPWRITE_API_KEY);

export const storage = new sdk.Storage(client);
