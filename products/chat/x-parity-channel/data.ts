// Same people and messages as 02-unified-inbox.
export const ME = 'Abhinav Singh';
export const NOW = '16:40'; // Friday afternoon
export type File = { name: string; meta: string };
export type Reaction = { label: string; count: number; mine?: boolean };
export type Msg = { id: string; who: string; time: string; yesterday?: boolean; text: string; isNew?: boolean; reactions?: Reaction[]; file?: File; replies?: Msg[] };
export type Conv = { id: string; kind: 'channel' | 'dm'; name: string; topic: string; members?: number; online?: boolean; messages: Msg[] };

export const CONVS: Conv[] = [
  { id: 'launch-week', kind: 'channel', name: 'launch-week', topic: 'Everything for the launch on Saturday 14 November', members: 14, messages: [
    { id: 'lw2', who: 'Manav Jain', time: '11:10', text: 'Launch-day rota is up. I have put you on the 08:00 to 11:00 shift.', replies: [
      { id: 'lw2a', who: ME, time: '11:30', text: 'Works for me.' },
      { id: 'lw2b', who: 'Ife Adeyemi', time: '15:20', isNew: true, text: 'Swapping with Noor on the late shift, rota updated.' },
      { id: 'lw2c', who: 'Noor Haddad', time: '15:48', isNew: true, text: 'Confirmed. Paging now points at me after 18:00.' },
    ] },
    { id: 'lw1', who: 'Kavya Reddy', time: '13:05', text: 'Pricing page copy is final from my side. @Abhinav can you sign it off by 17:00? Legal is waiting on your word before they close their review.', file: { name: 'pricing-page-v6.pdf', meta: 'PDF, 4 pages' }, reactions: [{ label: '+1', count: 3 }], replies: [
      { id: 'lw1a', who: 'Manav Jain', time: '13:22', text: 'The annual toggle copy changed too, worth a second look.' },
      { id: 'lw1b', who: 'Kavya Reddy', time: '13:40', text: 'Good catch. That is in **v6** as well.' },
      { id: 'lw1c', who: 'Ritu Sharma', time: '14:31', isNew: true, text: '@Abhinav legal just asked again.' },
    ] },
    { id: 'lw3', who: 'Ife Adeyemi', time: '15:02', isNew: true, text: 'Status page copy is merged.', reactions: [{ label: 'Done', count: 2 }] },
    { id: 'lw4', who: 'Tomas Lindqvist', time: '15:50', isNew: true, text: 'Press embargo confirmed for Saturday 09:00.' },
    { id: 'lw5', who: 'Tomas Lindqvist', time: '15:52', isNew: true, text: 'Briefing doc is in the launch folder if anyone gets a call before then.' },
  ] },
  { id: 'support-escalations', kind: 'channel', name: 'support-escalations', topic: 'Tickets that need someone senior', members: 7, messages: [
    { id: 'se1', who: 'Noor Haddad', time: '14:10', isNew: true, text: '@Abhinav Meridian Freight is asking whether deleted channels can be exported for their audit. Do we commit to that this quarter? They want an answer today.' },
    { id: 'se2', who: 'Mei Tanaka', time: '15:30', isNew: true, text: 'Two more tickets on login loops, both on Safari 19. Linked in the tracker.' },
  ] },
  { id: 'hiring', kind: 'channel', name: 'hiring', topic: 'Open roles and panels', members: 5, messages: [
    { id: 'hi1', who: 'Mei Tanaka', time: '09:40', isNew: true, text: 'The panel is split on Lena Okafor for the product design role. @Abhinav we need your yes or no today so we can reply before the weekend.', file: { name: 'lena-okafor-panel-notes.pdf', meta: 'PDF, 2 pages' }, replies: [
      { id: 'hi1a', who: 'Ritu Sharma', time: '10:15', text: 'Strong portfolio, weaker on systems. I would still hire.' },
    ] },
  ] },
  { id: 'design-crit', kind: 'channel', name: 'design-crit', topic: 'Work in progress, Mondays at 12:00', members: 9, messages: [
    { id: 'dc1', who: 'Ritu Sharma', time: '12:20', isNew: true, text: 'Composer v3 is ready. @Abhinav you asked to see the slash-command states before the crit, can you review?', file: { name: 'composer-v3.fig', meta: 'Design file, 12 frames' }, replies: [
      { id: 'dc1a', who: 'Kavya Reddy', time: '12:41', text: 'The send hint is much clearer now.' },
    ] },
    { id: 'dc2', who: 'Kavya Reddy', time: '14:05', isNew: true, text: 'Crit moved to Monday 12:00, room two.', reactions: [{ label: '+1', count: 4 }] },
  ] },
  { id: 'eng-platform', kind: 'channel', name: 'eng-platform', topic: 'Search, infrastructure and on-call', members: 18, messages: [
    { id: 'ep1', who: 'Tomas Lindqvist', time: '17:50', yesterday: true, text: 'Search index rebuild starts tonight. Expect stale results until morning.', replies: [
      { id: 'ep1a', who: ME, time: '18:02', yesterday: true, text: 'Please tell support before it starts.' },
      { id: 'ep1b', who: 'Tomas Lindqvist', time: '09:12', isNew: true, text: 'Rebuild finished at 06:40, 2.1 million messages.' },
      { id: 'ep1c', who: 'Manav Jain', time: '10:48', isNew: true, text: 'Some channels still return old results.' },
      { id: 'ep1d', who: 'Tomas Lindqvist', time: '16:05', isNew: true, text: 'Found it: archived channels were skipped. Re-running those tonight.' },
    ] },
    { id: 'ep2', who: 'Manav Jain', time: '13:15', isNew: true, text: 'Deploy freeze from Thursday 18:00 until launch.' },
  ] },
  { id: 'billing-migration', kind: 'channel', name: 'billing-migration', topic: 'Moving 2,400 accounts to the new invoices', members: 6, messages: [
    { id: 'bm2', who: 'Ife Adeyemi', time: '16:00', yesterday: true, text: 'Is the invoice email copy final?', replies: [
      { id: 'bm2a', who: ME, time: '16:20', yesterday: true, text: 'Final. Send it.' },
    ] },
    { id: 'bm1', who: 'Ife Adeyemi', time: '10:02', text: 'Test invoices for 40 accounts went out clean.', replies: [
      { id: 'bm1a', who: ME, time: '10:30', text: 'Did the tax lines match?' },
      { id: 'bm1b', who: 'Ife Adeyemi', time: '15:10', isNew: true, text: 'They match for all but three. Looking at those now.' },
    ] },
  ] },
  { id: 'announcements', kind: 'channel', name: 'announcements', topic: 'Company news, few posts', members: 42, messages: [
    { id: 'an1', who: 'Noor Haddad', time: '09:00', isNew: true, text: 'All-hands moved to Tuesday 11:00.', reactions: [{ label: '+1', count: 12 }] },
    { id: 'an2', who: 'Mei Tanaka', time: '12:30', isNew: true, text: 'The office is closed next Wednesday for the floor refit.' },
  ] },
  { id: 'random', kind: 'channel', name: 'random', topic: 'Tarts, books and everything else', members: 38, messages: [
    { id: 'ra1', who: 'Tomas Lindqvist', time: '13:00', isNew: true, text: 'Who left a whole persimmon tart in the kitchen? Asking as someone who ate a slice.' },
    { id: 'ra2', who: 'Mei Tanaka', time: '13:04', isNew: true, text: 'That was me. There is a second one.' },
    { id: 'ra3', who: 'Ritu Sharma', time: '13:06', isNew: true, text: 'On my way.' },
    { id: 'ra4', who: 'Manav Jain', time: '14:40', isNew: true, text: 'Book club is picking The Dispossessed next. Thoughts by next Friday.' },
  ] },
  { id: 'dm-manav', kind: 'dm', name: 'Manav Jain', topic: 'Direct message', online: true, messages: [
    { id: 'mj1', who: 'Manav Jain', time: '15:32', isNew: true, text: 'Do you have 15 minutes before the crit on Monday? I want to talk through the on-call load.' },
  ] },
  { id: 'dm-kavya', kind: 'dm', name: 'Kavya Reddy', topic: 'Direct message', online: true, messages: [
    { id: 'ky1', who: 'Kavya Reddy', time: '15:00', yesterday: true, text: 'Sending v6 of the pricing copy tomorrow morning.' },
    { id: 'ky2', who: ME, time: '15:04', yesterday: true, text: 'Thanks. Tag me in the channel so legal can see it.' },
  ] },
  { id: 'dm-noor', kind: 'dm', name: 'Noor Haddad', topic: 'Direct message', online: true, messages: [
    { id: 'nh1', who: 'Noor Haddad', time: '18:30', yesterday: true, text: 'Thanks for covering Tuesday.' },
    { id: 'nh2', who: ME, time: '18:40', yesterday: true, text: 'Any time.' },
  ] },
  { id: 'dm-tomas', kind: 'dm', name: 'Tomas Lindqvist', topic: 'Direct message', online: false, messages: [
    { id: 'tl1', who: 'Tomas Lindqvist', time: '11:50', text: 'No rush: can you read my launch postmortem template next week?' },
  ] },
];
