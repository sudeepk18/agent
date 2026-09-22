import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

const BASE_TITLE = 'AgentBlazer Club';
const BASE_URL = 'https://agentblazer.sjec.ac.in';

const PAGE_SEO: Record<string, { title: string; description: string }> = {
  home: {
    title: `${BASE_TITLE} — AI & Agentic Systems | SJEC CSE`,
    description:
      'AgentBlazer Club is a student-led AI & autonomous agent research collective at St Joseph Engineering College, Mangaluru. Explore workshops, hackathons, and Salesforce Trailblazer community events.',
  },
  about: {
    title: `About Us — ${BASE_TITLE} | Faculty, Core Team & Committee`,
    description:
      'Meet the AgentBlazer Club leadership — faculty advisors, student core team officers, and the working committee powering AI research and workshops at SJEC CSE Mangaluru.',
  },
  events: {
    title: `Events & Workshops — ${BASE_TITLE} | Hackathons, Masterclasses`,
    description:
      'Explore AgentBlazer Club workshops, prompt engineering contests, GSoC masterclasses, cybersecurity sessions, and Salesforce Agentforce developer labs at SJEC Mangaluru.',
  },
  join: {
    title: `Join & Connect — ${BASE_TITLE} | Become a Member`,
    description:
      'Apply to join AgentBlazer Club at SJEC CSE. Collaborate with peers on autonomous AI projects, gain Salesforce Trailhead developer org access, and shape real agent architectures.',
  },
  admin: {
    title: `Admin Panel — ${BASE_TITLE}`,
    description: 'Secure content management dashboard for AgentBlazer Club administrators.',
  },
};

export function usePageSEO(page: string) {
  useEffect(() => {
    const seo = PAGE_SEO[page] || PAGE_SEO.home;

    // Update document title
    document.title = seo.title;

    // Update meta description
    updateMeta('description', seo.description);

    // Update Open Graph tags
    updateMeta('og:title', seo.title, 'property');
    updateMeta('og:description', seo.description, 'property');
    updateMeta('og:url', `${BASE_URL}/${page === 'home' ? '' : page}`, 'property');

    // Update Twitter Card tags
    updateMeta('twitter:title', seo.title);
    updateMeta('twitter:description', seo.description);
    updateMeta('twitter:url', `${BASE_URL}/${page === 'home' ? '' : page}`);

    // Update canonical link
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `${BASE_URL}/${page === 'home' ? '' : page}`);
    }
  }, [page]);
}

function updateMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (el) {
    el.setAttribute('content', content);
  } else {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    el.setAttribute('content', content);
    document.head.appendChild(el);
  }
}

export default usePageSEO;
