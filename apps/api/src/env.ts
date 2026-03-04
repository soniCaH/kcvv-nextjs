import { Context } from "effect";

export interface WorkerEnv {
  readonly PSD_API_BASE_URL: string; // https://clubapi.prosoccerdata.com
  readonly FOOTBALISTO_LOGO_CDN_URL: string;
  readonly PSD_API_KEY: string; // wrangler secret
  readonly PSD_API_CLUB: string; // wrangler secret
  readonly PSD_API_AUTH: string; // wrangler secret (Authorization header value)
  readonly PSD_CACHE: KVNamespace;
}

export class WorkerEnvTag extends Context.Tag("WorkerEnv")<
  WorkerEnvTag,
  WorkerEnv
>() {}
