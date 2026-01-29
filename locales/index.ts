import { en } from './en';
import { ru } from './ru';
import { ro } from './ro';

export type Language = 'en' | 'ru' | 'ro';
export type Translations = typeof en;

export const translations: Record<Language, Translations> = {
  en,
  ru,
  ro,
};

export const defaultLanguage: Language = 'en';
