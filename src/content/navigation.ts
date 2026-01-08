/**
 * Navigation-Konfiguration
 * Zentrale Verwaltung aller Navigationslinks
 */

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const mainNavigation: NavItem[] = [
  { label: 'Start', href: '/' },
  { label: 'Leistungen', href: '/leistungen' },
  { label: 'Projekte', href: '/projekte' },
  { label: 'Über uns', href: '/ueber-uns' },
  { label: 'News', href: '/news' },
  { label: 'Kontakt', href: '/kontakt' },
];

export const footerNavigation: {
  main: NavItem[];
  legal: NavItem[];
} = {
  main: [
    { label: 'Leistungen', href: '/leistungen' },
    { label: 'Projekte', href: '/projekte' },
    { label: 'Über uns', href: '/ueber-uns' },
    { label: 'News', href: '/news' },
    { label: 'Kontakt', href: '/kontakt' },
  ],
  legal: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
  ],
};
