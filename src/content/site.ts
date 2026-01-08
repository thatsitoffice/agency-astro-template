/**
 * Zentrale Site-Konfiguration
 * Hier werden alle globalen Einstellungen für die Website verwaltet.
 */

export interface SiteConfig {
  domain: string;
  name: string;
  tagline?: string;
  defaultSEO: {
    title: string;
    description: string;
    image?: string;
  };
  organization: {
    name: string;
    legalName?: string;
    url: string;
    logo?: string;
    address?: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    contact?: {
      email: string;
      phone?: string;
    };
  };
  socials?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
}

export const site: SiteConfig = {
  // ⚠️ ÄNDERN: Ihre Domain (z.B. 'https://meine-agentur.de')
  domain: import.meta.env.PUBLIC_SITE_URL || 'https://muster-agentur.de',
  
  // ⚠️ ÄNDERN: Name Ihrer Agentur
  name: 'Muster Agentur',
  
  // ⚠️ ÄNDERN: Ihr Tagline/Slogan (optional)
  tagline: 'Wir gestalten digitale Erlebnisse, die begeistern',
  
  defaultSEO: {
    // ⚠️ ÄNDERN: SEO-Titel für Google
    title: 'Muster Agentur - Professionelle Webdesign & Marketing Agentur',
    
    // ⚠️ ÄNDERN: SEO-Beschreibung für Google (max. 160 Zeichen)
    description: 'Muster Agentur: Ihre Spezialisten für Webdesign, SEO und digitale Marketing-Lösungen. Individuelle Websites, die Ergebnisse liefern.',
    
    // Bild für Social Media (1200x630px empfohlen)
    image: '/og-default.jpg',
  },
  
  organization: {
    // ⚠️ ÄNDERN: Firmenname
    name: 'Muster Agentur GmbH',
    
    // ⚠️ ÄNDERN: Rechtlicher Firmenname (falls anders)
    legalName: 'Muster Agentur GmbH',
    
    url: import.meta.env.PUBLIC_SITE_URL || 'https://muster-agentur.de',
    
    // ⚠️ ÄNDERN: Pfad zu Ihrem Logo (falls vorhanden, sonst leer lassen)
    logo: '/logo.svg',
    
    address: {
      // ⚠️ ÄNDERN: Ihre Adresse
      street: 'Musterstraße 123',
      city: 'München',
      postalCode: '80331',
      country: 'Deutschland',
    },
    contact: {
      // ⚠️ ÄNDERN: Ihre E-Mail-Adresse
      email: 'info@muster-agentur.de',
      
      // ⚠️ ÄNDERN: Ihre Telefonnummer (optional, kann gelöscht werden)
      phone: '+49 89 12345678',
    },
  },
  
  socials: {
    // ⚠️ ÄNDERN: Ihre Social Media Links (optional, nicht benötigte Zeilen löschen)
    twitter: 'https://twitter.com/musteragentur',
    linkedin: 'https://linkedin.com/company/muster-agentur',
    instagram: 'https://instagram.com/musteragentur',
  },
};
