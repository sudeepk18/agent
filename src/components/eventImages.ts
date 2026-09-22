// GSoC & LLM Workshop images (JPG only — HEIC is not browser-compatible)
import gsoc1 from '../assets/GSoc and LLM Workshop/IMG-20260213-WA0000.jpg';
import gsoc2 from '../assets/GSoc and LLM Workshop/IMG_5949.JPG';
import gsoc3 from '../assets/GSoc and LLM Workshop/IMG_5950.JPG';
import gsoc4 from '../assets/GSoc and LLM Workshop/IMG_5951.JPG';
import gsoc5 from '../assets/GSoc and LLM Workshop/IMG_5952.JPG';

// PromptOps 2K26 Challenge images
import po1 from '../assets/PromptOps 2026-20260915T115542Z-1-001/20260325_141046.jpg';
import po2 from '../assets/PromptOps 2026-20260915T115542Z-1-001/20260325_165226.jpg';
import po3 from '../assets/PromptOps 2026-20260915T115542Z-1-001/20260325_165255.jpg';
import po4 from '../assets/PromptOps 2026-20260915T115542Z-1-001/20260325_165327(0).jpg';
import po5 from '../assets/PromptOps 2026-20260915T115542Z-1-001/20260325_165354.jpg';
import po6 from '../assets/PromptOps 2026-20260915T115542Z-1-001/20260325_165426.jpg';
import po7 from '../assets/PromptOps 2026-20260915T115542Z-1-001/20260325_165526.jpg';
import po8 from '../assets/PromptOps 2026-20260915T115542Z-1-001/20260325_165737.jpg';
import po9 from '../assets/PromptOps 2026-20260915T115542Z-1-001/IMG_8476.JPG';
import po10 from '../assets/PromptOps 2026-20260915T115542Z-1-001/IMG_8492.JPG';
import po11 from '../assets/PromptOps 2026-20260915T115542Z-1-001/IMG_8500.JPG';
import po12 from '../assets/PromptOps 2026-20260915T115542Z-1-001/IMG_8523.JPG';

// Cybersecurity & Career Pathways images
import cs1 from '../assets/Cybersecurity & Career Pathways/IMG-20260326-WA0008.jpg';
import cs2 from '../assets/Cybersecurity & Career Pathways/IMG_8888.JPG';
import cs3 from '../assets/Cybersecurity & Career Pathways/IMG_8908.JPG';
import cs4 from '../assets/Cybersecurity & Career Pathways/IMG_8912.JPG';
import cs5 from '../assets/Cybersecurity & Career Pathways/IMG_8942.JPG';
import cs6 from '../assets/Cybersecurity & Career Pathways/IMG_8965.JPG';

/**
 * Maps event titles (from the EVENTS array) to their image arrays.
 * Only the 3 events with supplied photos are included.
 */
export const EVENT_IMAGES: Record<string, string[]> = {
  'Master the Future: A Hands-on GSoC & LLMs Workshop': [
    gsoc1, gsoc2, gsoc3, gsoc4, gsoc5,
  ],
  'PROMPT OPS-2K26 Challenge': [
    po1, po2, po3, po4, po5, po6, po7, po8, po9, po10, po11, po12,
  ],
  'Cyber Security & Career Pathways': [
    cs1, cs2, cs3, cs4, cs5, cs6,
  ],
};

export function getEventImages(title: string, customGallery?: string[]): string[] | undefined {
  if (customGallery && Array.isArray(customGallery) && customGallery.length > 0) {
    return customGallery;
  }
  return EVENT_IMAGES[title];
}
