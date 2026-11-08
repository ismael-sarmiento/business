// IsBusiness · the only place with the contact details and the WhatsApp messages.
// Change the number here (for example, for a business number) and every button follows.
export const CONTACT = {
  whatsapp: '34613371874',            // digits only, with country code (wa.me format)
  email: 'contacto@isuniverse.dev',   // the domain alias, never a personal mailbox
};
export const MESSAGES = {
  es: { wa: 'Hola, he visto IsBusiness y me gustaría una demo gratis para mi negocio.', mailSubject: 'Demo gratis para mi negocio' },
  en: { wa: 'Hi, I saw IsBusiness and I would like a free demo for my business.', mailSubject: 'Free demo for my business' },
};
export const waHref = lang => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent((MESSAGES[lang] || MESSAGES.es).wa)}`;
export const mailHref = lang => `mailto:${CONTACT.email}?subject=${encodeURIComponent((MESSAGES[lang] || MESSAGES.es).mailSubject)}`;
