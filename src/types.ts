export interface Content {
  bodyHeadline: string;
  body: Array<string>;
  projectHeadline: string;
  projects: Array<Project>;
}

export interface Project {
  content: string;
  link: string;
}

export interface Emoji {
  c: string;
  n: string;
}

export interface Track {
  artist: string;
  artistLink: string;
  current: boolean;
  timestamp: string;
  title: string;
  trackLink: string;
}

export interface VisitorInfo {
  ip: string;
  type: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
}
