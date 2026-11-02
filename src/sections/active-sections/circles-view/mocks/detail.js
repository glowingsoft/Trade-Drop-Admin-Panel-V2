import { CIRCLES } from './data';

const PEOPLE = {
  1: [
    { id: 'p1', name: 'Lena Ortiz', craft: 'Hair and Beauty', role: 'Owner', joined: '14 Aug 2026', joinedAt: '2026-08-14', messages: 38, reportsAgainst: 0, status: 'Active' },
    { id: 'p2', name: 'Nina Brooks', craft: 'Photography', role: 'Organizer', joined: '02 Sep 2026', joinedAt: '2026-09-02', messages: 51, reportsAgainst: 0, status: 'Active' },
    { id: 'p3', name: 'Avery Park', craft: 'Photography', role: 'Member', joined: '20 Aug 2026', joinedAt: '2026-08-20', messages: 12, reportsAgainst: 0, status: 'Active' },
    { id: 'p4', name: 'Hana Suzuki', craft: 'Writing', role: 'Member', joined: '03 Sep 2026', joinedAt: '2026-09-03', messages: 7, reportsAgainst: 0, status: 'Active' },
    { id: 'p5', name: 'user #48211', craft: '—', role: 'Member', joined: '30 Oct 2026', joinedAt: '2026-10-30', messages: 9, reportsAgainst: 3, status: 'Muted' },
  ],
  2: [
    { id: 'p5', name: 'Amina Cole', craft: 'Styling', role: 'Organizer' },
    { id: 'p6', name: 'Noah Hart', craft: 'Editorial', role: 'Member' },
  ],
  3: [
    { id: 'p7', name: 'Lila Ortiz', craft: 'Portraits', role: 'Organizer' },
    { id: 'p8', name: 'Sam Adeyemi', craft: 'Photography', role: 'Member' },
  ],
  4: [
    { id: 'p9', name: 'Priya Shah', craft: 'Color', role: 'Organizer' },
    { id: 'p10', name: 'Elena Voss', craft: 'Braids', role: 'Member' },
  ],
};

const DROPS = {
  1: [
    {
      id: 'd1',
      status: 'Open drop',
      title: 'Photo Walk Recap Zine',
      when: 'Sat, Nov 14 · 3:00–6:00 PM EST',
      place: 'In person · Williamsburg, Brooklyn',
      distance: '0.9 mi',
      lookingFor: 'Recap photographer for the walk',
      offering: 'Featured spread + 10 printed copies',
      author: 'Jesse Kim',
      craft: 'Photography',
    },
  ],
  2: [
    {
      id: 'd2',
      status: 'Open drop',
      title: 'Lookbook fitting notes',
      when: 'Wed, Nov 19 · 11:00 AM–2:00 PM GMT',
      place: 'In person · Shoreditch, London',
      distance: '1.4 mi',
      lookingFor: 'Stylist for a half-day fitting',
      offering: 'Credit on the lookbook and prints',
      author: 'Amina Cole',
      craft: 'Styling',
    },
  ],
  3: [
    {
      id: 'd3',
      status: 'Open drop',
      title: 'Golden hour test prints',
      when: 'Sun, Nov 16 · 4:30–6:30 PM PST',
      place: 'In person · Silver Lake, Los Angeles',
      distance: '2.1 mi',
      lookingFor: 'Second photographer for the session',
      offering: 'Shared selects and a print set',
      author: 'Lila Ortiz',
      craft: 'Portraits',
    },
  ],
  4: [],
};

const EVENTS = {
  1: [
    { id: 'e1', month: 'Dec', day: '5', title: 'Bridal Test Day', place: 'Studio, Mercer St', dateLabel: 'Sat, 5 Dec · 10:00 AM', going: '18 / 20', audience: 'Public', status: 'Published' },
    { id: 'e2', month: 'Nov', day: '21', title: 'Natural Hair Swap Meet', place: 'From a member suggestion', dateLabel: 'Sat, 21 Nov', going: '—', audience: 'Members only', status: 'Draft' },
    { id: 'e3', month: 'Oct', day: '10', title: 'Editorial Updo Workshop', place: 'SoHo', dateLabel: 'Sat, 10 Oct', going: '24 / 24', audience: 'Public', status: 'Completed' },
  ],
  2: [
    {
      id: 'e2',
      month: 'Nov',
      day: '20',
      title: 'Editorial Styling Workshop',
      time: '11:00 AM–2:00 PM GMT',
      host: 'Editorial Stylists Collective',
      place: 'Shoreditch',
    },
  ],
  3: [
    {
      id: 'e3',
      month: 'Nov',
      day: '16',
      title: 'Silver Lake Portraits',
      time: '4:30–6:30 PM PST',
      host: 'Golden Hour Portraits',
      place: 'Silver Lake',
    },
  ],
  4: [],
};

const ADMIN = {
  1: {
    code: 'CIR-0192',
    createdAt: '14 Aug 2026',
    createdBy: 'Lena Ortiz',
    featured: true,
    homeArea: 'SoHo, New York',
    latitude: 40.7233,
    longitude: -74.003,
    lastActivity: '2 hours ago',
    upcomingEvents: 2,
    health: { messages: 412, newMembers: 21, eventsHeld: 3, openReports: 1 },
    settings: {
      joining: 'Open · anyone can join',
      suggestEvents: 'On',
      discussion: 'Members only · threaded replies on',
    },
    organizers: [
      { id: 'o1', name: 'Lena Ortiz', craft: 'Hair and Beauty', role: 'Owner', since: 'Creator · Hair and Beauty · Joined 14 Aug' },
      { id: 'o2', name: 'Nina Brooks', craft: 'Photography', role: 'Organizer', since: 'Organizer since 3 Sep' },
    ],
    joinRequests: [
      { id: 'j1', name: 'Tomás Ortega', craft: 'Photography', when: 'requested 3 days ago', note: 'I shoot bridal editorials and want to meet stylists.' },
      { id: 'j2', name: 'Ines Park', craft: 'Modeling', when: 'requested 9 days ago', stuck: 'Stuck 9 days' },
    ],
    polls: [
      {
        id: 'poll1',
        title: 'Where should November’s meetup be?',
        status: 'Open · closes Fri',
        votes: 43,
        createdBy: 'Lena Ortiz',
        options: [
          { label: 'SoHo studio', percent: 58 },
          { label: 'Williamsburg rooftop', percent: 30 },
          { label: 'Online', percent: 12 },
        ],
      },
    ],
    reports: [
      {
        id: 'r1',
        title: 'Message in discussion',
        reason: 'Spam',
        quote: 'DM me for cheap followers 🔥 link in bio',
        by: 'user #48211',
        reportedBy: '3 members',
        when: '1 day ago',
      },
    ],
    activity: [
      { id: 'a1', when: '02 Nov 18:14', text: 'Nina Brooks published event “Bridal Test Day”' },
      { id: 'a2', when: '01 Nov 18:02', text: '3 members reported a message (Spam)' },
      { id: 'a3', when: '28 Oct 09:40', text: 'Admin changed home area from “Manhattan” to “SoHo, New York”' },
      { id: 'a4', when: '02 Sep 12:11', text: 'Lena Ortiz made Nina Brooks an organizer' },
      { id: 'a5', when: '14 Aug 16:25', text: 'Circle created by Lena Ortiz (Open joining)' },
    ],
  },
  2: {
    code: 'CIR-0102',
    createdAt: '2 Jul 2026',
    createdBy: 'Amina Cole',
    featured: false,
    homeArea: 'Shoreditch, London',
    latitude: 51.5225,
    longitude: -0.0782,
    lastActivity: '1 day ago',
    health: { messages: 74, newMembers: 4, eventsHeld: 1, openReports: 0 },
    settings: {
      joining: 'Request · organizers approve',
      suggestEvents: 'On',
      discussion: 'Members only · threaded replies on',
    },
    organizers: [{ id: 'o3', name: 'Amina Cole', craft: 'Styling', role: 'Owner', since: 'Creator · Joined 2 Jul' }],
    joinRequests: [{ id: 'j3', name: 'Noah Hart', craft: 'Editorial', when: 'Requested 1 day ago' }],
    polls: [],
    reports: [],
    activity: [{ id: 'a4', text: 'Circle created', when: '2 Jul 2026' }],
  },
  3: {
    code: 'CIR-0103',
    createdAt: '19 Jun 2026',
    createdBy: 'Lila Ortiz',
    featured: false,
    homeArea: 'Silver Lake, Los Angeles',
    latitude: 34.0869,
    longitude: -118.2702,
    lastActivity: '5 hours ago',
    health: { messages: 96, newMembers: 8, eventsHeld: 1, openReports: 1 },
    settings: {
      joining: 'Open · anyone can join',
      suggestEvents: 'On',
      discussion: 'Members only · threaded replies off',
    },
    organizers: [{ id: 'o4', name: 'Lila Ortiz', craft: 'Portraits', role: 'Owner', since: 'Creator · Joined 19 Jun' }],
    joinRequests: [],
    polls: [],
    reports: [{ id: 'r1', title: 'Misleading location on a drop', meta: 'Open · reported 5 hours ago' }],
    activity: [{ id: 'a5', text: 'A report was opened', when: '5 hours ago' }],
  },
  4: {
    code: 'CIR-0104',
    createdAt: '8 May 2026',
    createdBy: 'Priya Shah',
    featured: false,
    homeArea: 'Toronto',
    latitude: 43.6532,
    longitude: -79.3832,
    lastActivity: '4 days ago',
    health: { messages: 41, newMembers: 2, eventsHeld: 0, openReports: 0 },
    settings: {
      joining: 'Open · anyone can join',
      suggestEvents: 'Off',
      discussion: 'Members only · threaded replies on',
    },
    organizers: [{ id: 'o5', name: 'Priya Shah', craft: 'Color', role: 'Owner', since: 'Creator · Joined 8 May' }],
    joinRequests: [],
    polls: [],
    reports: [],
    activity: [{ id: 'a6', text: 'Circle created', when: '8 May 2026' }],
  },
};

export function getCircleDetail(id) {
  const circle = CIRCLES.find((item) => item.id === String(id));

  if (!circle) return null;

  const extra = ADMIN[circle.id] || {};
  const events = EVENTS[circle.id] || [];

  return {
    ...circle,
    ...extra,
    visibilityDetail: circle.visibility === 'public' ? 'Listed in search & on map' : 'Hidden from search & map',
    people: PEOPLE[circle.id] || [],
    drops: DROPS[circle.id] || [],
    events,
    upcomingEvents: extra.upcomingEvents ?? events.length,
    joinRequests: extra.joinRequests || [],
    polls: extra.polls || [],
    reports: extra.reports || [],
    activity: extra.activity || [],
    organizers: extra.organizers || [],
  };
}
