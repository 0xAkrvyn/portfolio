export interface SiteInfo {
  name: string;
  tagline: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSub: string;
  footer: string;
}

export interface Stat {
  title: string;
  value: string;
  desc: string;
}

export interface About {
  name: string;
  role: string;
  initials: string;
  bio: string;
  stats: Stat[];
  skills: string[];
}

export interface ServiceCategory {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

export interface Service {
  category: string;
  icon: string;
  title: string;
  desc: string;
  tags: string[];
}

export type BlogCategory = "cyber" | "support" | "other";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  tags: string[];
  category: BlogCategory;
  featured: boolean;
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  responseTime: string;
  encrypted: string;
}

export interface AdminCreds {
  username: string;
  password: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  date: string;
  read: boolean;
}

export interface SiteData {
  site: SiteInfo;
  about: About;
  serviceCategories: ServiceCategory[];
  services: Service[];
  blog: BlogPost[];
  contact: ContactInfo;
  admin: AdminCreds;
  messages: Message[];
}
