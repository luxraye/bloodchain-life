export const SITE = {
  contactEmail:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTACT_EMAIL?.trim()) ||
    'giftjrnakedi@gmail.com',

  contactName: 'Gift Jr Nakedi',
  contactPhoneDisplay: '(267) 721 610 38',
  contactPhoneTel: '+26772161038',

  projectTitle:    'Bloodchain',
  projectEyebrow:  'Modular Blood Supply Infrastructure',
  projectTagline:  'Modular blood-supply infrastructure.',
  projectSubtitle: 'Start with one module — or run the whole chain. Plug-and-play software for community blood drives, donor retention, hospital transfusion safety, laboratory screening, and chronic care, deployed institution by institution.',

  organization:    'Bloodchain Botswana',
  incubationLine:  'Incubated by Unipod at the University of Botswana',

  prototypeNote:
    'Bloodchain is modular: every application runs on its own or connects through one shared custody core. Institutions adopt the modules they need today and extend later — no rip-and-replace. Live demonstrations are arranged by appointment.',

  repoUrl: '',
}

export function mailtoLink(subject, body) {
  const q = new URLSearchParams()
  if (subject) q.set('subject', subject)
  if (body)    q.set('body', body)
  const qs = q.toString()
  return `mailto:${SITE.contactEmail}${qs ? `?${qs}` : ''}`
}

function sig() { return `\n\n— ${SITE.contactName}` }

export function mailtoGeneral() {
  return mailtoLink(
    'Bloodchain — General inquiry',
    `Hello Bloodchain Botswana,\n\nI would like to learn more about the Bloodchain platform.${sig()}`,
  )
}
export function mailtoCollaboration() {
  return mailtoLink(
    'Bloodchain — Collaboration / partnership',
    `Hello Bloodchain Botswana,\n\nWe would like to explore collaboration or partnership with Bloodchain.\n\nOrganisation:\nRole:${sig()}`,
  )
}
export function mailtoMediaDemo() {
  return mailtoLink(
    'Bloodchain — Media / demo request',
    `Hello Bloodchain Botswana,\n\nI am requesting a demo or interview about Bloodchain.\n\nOutlet / affiliation:\nPreferred dates:${sig()}`,
  )
}
