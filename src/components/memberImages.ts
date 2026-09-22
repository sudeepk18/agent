import ajayImg from '../assets/images/Ajay Preenal Dsouza .jpg';
import chinthanImg from '../assets/images/Chinthan N V.jpg';
import frennyImg from '../assets/images/Frenny Chrystal Saldanha.jpg';
import rubenImg from '../assets/images/Ruben Saldana.WEBP';
import stevinImg from '../assets/images/Stevin D Souza.jpg';
import joylineImg from '../assets/images/joyline V.jpg';
import keithImg from '../assets/images/mr-keith-raymond-fernandes.jpg';

export interface MemberData {
  name: string;
  role: string;
  title: string;
  titleClass?: string;
  description: string;
  image: string;
}

export const MEMBER_IMAGES: Record<string, string> = {
  'Ruben Saldanha': rubenImg,
  'Ajay Preenal Dsouza': ajayImg,
  'Stevin Dsouza': stevinImg,
  'Frenny Chrystal Saldanha': frennyImg,
  'Joyline Galbao': joylineImg,
  'Chinthan N V': chinthanImg,
  'Mr. Keith Fernandes': keithImg,
};

export function getMemberImage(name: string, customUrl?: string): string | undefined {
  if (customUrl && customUrl.trim().length > 0) {
    return customUrl;
  }
  return MEMBER_IMAGES[name];
}
