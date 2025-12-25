
export interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: number;
}

export interface CoupleInfo {
  name: string;
  fullName: string;
  father: string;
  mother: string;
  accountNumber?: string;
  bankName?: string;
  phone?: string;
}

export interface WeddingData {
  groom: CoupleInfo;
  bride: CoupleInfo;
  date: string;
  time: string;
  location: string;
  mapsLink: string;
}