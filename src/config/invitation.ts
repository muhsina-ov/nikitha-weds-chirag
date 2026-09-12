/**
 * Single source of truth for one couple's invitation.
 * Duplicate the project, edit this file, swap the images in src/assets, deploy.
 */

export const invitation = {
  couple: {
    bride: "Nikitha",
    brideShort: "Nikitha",
    groom: "Chirag",
    groomShort: "Chirag",
    hashtag: "#NikithaAndChirag",
  },
  invite: {
    kicker: "Together with their families",
    line: "cordially invite you to celebrate their engagement",
  },
  event: {
    title: "The Engagement of Nikitha & Chirag",
    /** ISO with timezone offset — India Standard Time */
    startsAt: "2026-09-24T11:00:00+05:30",
    endsAt: "2026-09-24T16:00:00+05:30",
    dateLabel: "24 . 09 . 2026",
    dayLabel: "Thursday",
    timeLabel: "11:00 AM onwards",
    dressCode: "Traditional / Festive Indian Attire",
    note: "Lunch and celebrations to follow",
  },
  venue: {
    name: "Akshara Banquet & Lawns",
    address: "No. 5, GD Avenue, Kempapura Rd, Chikkabanavara, Bengaluru, Karnataka 560090",
    mapsQuery:
      "Akshara Banquet & Lawns, No. 5, GD Avenue, Kempapura Rd, Chikkabanavara, Bengaluru, Karnataka 560090",
    url: "https://maps.app.goo.gl/piix3ZGf51rxnUbn6?g_st=iw",
    lat: 13.0768,
    lng: 77.5085,
  },
  music: {
    youtubeId: "YK-TkctENzQ",
    title: "Chanakya (Sitar) — Rishab Rikhiram Sharma",
  },
  blessing: {
    line: "May your intentions be one, may your hearts beat as one.",
    translation:
      "Two families, one thread of gold — and a lifetime of happiness made luminous together.",
    source: "A blessing from both families",
  },
  footer: {
    families: "With love & warm wishes from the Families",
    contacts: [],
  },
  meta: {
    title: "Nikitha & Chirag — Engagement Invitation",
    description:
      "Nikitha and Chirag cordially invite you to celebrate their engagement on Thursday, September 24, 2026 at Akshara Banquet & Lawns, Bengaluru.",
    url: "https://nikitha-chirag.vercel.app",
    image: "https://media.invitestory.in/sage-parchment/og-image.jpg",
    siteName: "Nikitha & Chirag Engagement",
  },
} as const;

export type Invitation = typeof invitation;
