export interface APIEvent {
  country_uri: string | null;
  event_id: string;
  event_uri: string | null;
  measure_uri: string;
  timestamp: string;
  uploader_uri: string;
  value: number;
  work_uri: string;
  // Citation-specific fields (if present in API)
  authors?: NameInput[];
  editors?: NameInput[];
  year?: number;
  title?: string;
  source?: string;
  volume?: string | null;
  issue?: string | null;
  page?: string | null;
  doi?: string | null;
  url?: string | null;
  type?: string | null;
}

export type NameInput =
  | string
  | {
      last_name?: string;
      initial?: string;
      family?: string;
      given?: string;
      name?: string;
    };
