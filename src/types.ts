export interface WeddingEvent {
  nameBn: string;
  nameEn: string;
  dateBn: string;
  dateEn: string;
  timeBn: string;
  timeEn: string;
  venueBn: string;
  venueEn: string;
  addressBn: string;
  addressEn: string;
  mapLink: string;
  timeDetailsBn?: string;
  timeDetailsEn?: string;
}

export interface PersonDetails {
  nameEn: string;
  nameBn: string;
  fatherEn: string;
  fatherBn: string;
  motherEn: string;
  motherBn: string;
  villEn: string;
  villBn: string;
  poEn: string;
  poBn: string;
  distEn: string;
  distBn: string;
  wardEn?: string;
  wardBn?: string;
  thanaEn?: string;
  thanaBn?: string;
}

export interface InvitationData {
  groom: PersonDetails;
  bride: PersonDetails;
  nikah: WeddingEvent;
  walima: WeddingEvent;
  bismillahEn: string;
  bismillahBn?: string;
  quranArabic: string;
  quranEn: string;
  quranBn: string;
}

export interface RSVP {
  id: string;
  name: string;
  phone: string;
  status: 'attending' | 'declined';
  guestsCount: number;
  eventType: 'nikah' | 'walima' | 'both';
  message: string;
  createdAt: string;
}

export interface Wish {
  id: string;
  name: string;
  relation: string;
  message: string;
  createdAt: string;
}

export type LanguageMode = 'en' | 'bn' | 'bilingual';

export type CardTheme = 'emerald-gold' | 'royal-dark' | 'ivory-gold' | 'crimson-gold';
