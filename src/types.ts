export interface Post {
  id: number;
  title_ko: string;
  title_en: string;
  content_ko: string;
  content_en: string;
  image_url: string;
  created_at: string;
}

export interface Product {
  id: number;
  name_ko: string;
  name_en: string;
  description_ko: string;
  description_en: string;
  category: string;
  image_url: string;
  created_at: string;
}

export interface SiteSettings {
  site_name: string;
  primary_color: string;
  bg_color: string;
  font_family: string;
  contact_email: string;
  social_links: string; // JSON string
  logo_url: string;
  about_title_ko: string;
  about_title_en: string;
  about_content_ko: string;
  about_content_en: string;
  about_image_url: string;
  partner_logos: string; // JSON string
  hero_bg_url: string;
  hero_title_ko: string;
  hero_title_en: string;
  hero_subtitle_ko: string;
  hero_subtitle_en: string;
  formspree_url: string;
}

export type Language = 'ko' | 'en';
