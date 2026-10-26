import { useEffect, useRef, useState } from 'react';

import '@fontsource/anton';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import circleImage from 'src/assets/landing/circle.jpg';
import dayImage from 'src/assets/landing/day.jpg';
import dropImage from 'src/assets/landing/drop.jpg';
import heroLookbook from 'src/assets/landing/hero-trade-set.jpg';
import recordImage from 'src/assets/landing/record.jpg';
import tapImage from 'src/assets/landing/tap.jpg';
import logo from 'src/assets/logo/light-mode-logo.png';

import { Iconify } from 'src/components/iconify';

const ink = '#F4F0E6';
const muted = '#A39B90';
const faint = '#6F675F';
const line = 'rgba(244, 240, 230, 0.14)';
const copper = '#B8923D';
const copperDeep = '#8A6B25';
const bg = '#0C0C0C';
const raised = '#161616';
const onGold = '#FFFFFF';
const poster = 'Anton, "Arial Black", sans-serif !important';
const headingTrack = '0.02em';
const mono = '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

const NAV = [
  { label: 'Product', id: 'product' },
  { label: 'Drops', id: 'drops' },
  { label: 'Circles', id: 'circles' },
  { label: 'Events', id: 'events' },
];

const FACTS = [
  'No platform fee',
  'Need beside the offer',
  'Accept before the chat',
  'Photographers and stylists',
  'Public or private circles',
  'A date and a city',
  'Badges for closed trades',
  'Skill for skill',
];

const PRODUCT = [
  {
    title: 'The drop',
    text: 'A post with both halves written down: the thing you need, and the thing you can give for it. No vague “collab?”.',
    image: dropImage,
    wide: true,
  },
  {
    title: 'The tap',
    text: 'A counter-offer with terms. Chat does not open because someone liked the idea. It opens because you accepted.',
  },
  {
    title: 'The circle',
    text: 'A room for one craft. Public if you want the city in. Private if the work is not ready to be found.',
  },
  {
    title: 'The day out',
    text: 'Walks and workshops hosted by a person or by the circle. A date, a city, a finite list.',
  },
  {
    title: 'The record',
    text: 'Badges follow finished trades. Reputation is the work that closed, not a follower count.',
  },
];

const DROPS = [
  {
    role: 'Photographer',
    city: 'New York',
    ask: 'Style the fall story. Six looks, one point of view.',
    give: 'Half a day in the studio. Portraits, retouched.',
    status: 'Open',
    image: dayImage,
  },
  {
    role: 'Stylist',
    city: 'London',
    ask: 'Color that can go copper and still stay soft.',
    give: 'Direction and wardrobe for two looks.',
    status: 'Open',
    image: circleImage,
  },
  {
    role: 'Colorist',
    city: 'Toronto',
    ask: 'Braids that hold when the crop gets close.',
    give: 'The color session, chair to rinse.',
    status: 'In review',
    image: tapImage,
  },
  {
    role: 'Makeup',
    city: 'Los Angeles',
    ask: 'Four hours of north light. Nothing softer.',
    give: 'The face for the stills, and the tests.',
    status: 'Open',
    image: recordImage,
  },
];

const ROLES = [
  { name: 'Photographers', line: 'Trade a set for styling, color, or a studio you do not own.' },
  { name: 'Stylists', line: 'Trade direction for frames you can put in the book.' },
  { name: 'Colorists', line: 'Trade a session for pictures that show the color honestly.' },
  { name: 'Makeup', line: 'Trade the face for a still, a walk, or a lookbook page.' },
];

const TRADES = [
  { name: 'Photographers', needs: 'music / design' },
  { name: 'Videographers', needs: 'branding / web' },
  { name: 'Hairstylists', needs: 'tattoos / photo' },
  { name: 'Tattoo artists', needs: 'photos / hair' },
  { name: 'Musicians', needs: 'design / video' },
  { name: 'Graphic designers', needs: 'photos / copy' },
  { name: 'Developers', needs: 'content / shoots' },
  { name: 'Comedians', needs: 'web / design' },
  { name: 'Makeup artists', needs: 'shoots / branding' },
  { name: 'Writers / copywriters', needs: 'web / photos' },
];

const CIRCLES = [
  { name: 'NYC Film Photographers', place: 'New York', access: 'Public', count: '184', note: 'Where a walk gets a date and a drop finds a second shooter.' },
  { name: 'Editorial Stylists', place: 'London', access: 'Private', count: '62', note: 'Closed until the room decides the work can be seen.' },
  { name: 'Braid & Color Studio', place: 'Toronto', access: 'Public', count: '41', note: 'Hair and color booking each other, not a group chat.' },
];

const EVENTS = [
  { day: '14', mon: 'Sep', name: 'Golden hour walk', city: 'New York', host: 'NYC Film Photographers', seats: 'Open' },
  { day: '20', mon: 'Sep', name: 'Editorial workshop', city: 'London', host: 'Editorial Stylists', seats: '16 seats' },
  { day: '30', mon: 'Aug', name: 'Street portraits', city: 'Los Angeles', host: 'Golden Hour Portraits', seats: 'Full' },
];

const COMPARE = [
  { label: 'What you pay', theirs: 'A cut, or nothing but “exposure”', ours: 'Nothing. The trade is the payment.' },
  { label: 'How you meet', theirs: 'A DM with no terms', ours: 'A drop, then a tap, then a yes.' },
  { label: 'Who sees the room', theirs: 'Everyone, always', ours: 'Public, or private until you open it.' },
  { label: 'What counts', theirs: 'Followers', ours: 'Trades that actually closed.' },
];

const NOTES = [
  { name: 'Amira Cole', role: 'Stylist, New York', quote: 'I had the studio until six. I needed color. We did not talk about a rate.' },
  { name: 'Jules Adeyemi', role: 'Colorist, Toronto', quote: 'The tap said what I would give and what I wanted back. That was enough to say yes.' },
];

const QUESTIONS = [
  { q: 'Is TradeDrop free to use?', a: 'Yes. There is no fee on a trade and no checkout. You exchange the work.' },
  { q: 'What goes on a drop?', a: 'Two lines that matter: what you need, and what you offer. City and craft sit beside them.' },
  { q: 'When can we message?', a: 'After the drop owner accepts the tap. Before that, the offer stays on the board.' },
  { q: 'Can a circle stay hidden?', a: 'Yes. Private circles are not listed. Flagged circles wait for review before they are discoverable.' },
  { q: 'Who can host an event?', a: 'A member, or the circle. It is a date in a city, not another post in a feed.' },
  { q: 'Do I give up my clients?', a: 'No. A trade is one day. The next paid job is still yours.' },
];

const pad = { py: { xs: 8, md: 11 } };
const wrap = {
  width: '100%',
  mx: 'auto',
  px: { xs: 2.5, md: 4, lg: 6 },
  '@media (min-width: 2000px)': { maxWidth: 1600 },
};

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Kicker({ children }) {
  return (
    <Typography sx={{ color: copper, fontFamily: mono, fontSize: 13, letterSpacing: '0.02em', mb: 1.5 }}>
      {children}
    </Typography>
  );
}

function toneWord(index) {
  const step = index % 3;
  if (step === 1) return { color: copper };
  if (step === 2) return { color: 'transparent', WebkitTextStroke: '0.035em #6d645e' };
  return { color: '#f3efe6' };
}

function ToneWords({ children }) {
  const words = String(children).split(' ');
  return words.map((word, index) => (
    <Box key={`${word}-${index}`} component="span" sx={toneWord(index)}>
      {word}{index < words.length - 1 ? ' ' : ''}
    </Box>
  ));
}

function Title({ children, sx }) {
  return (
    <Typography sx={{ fontFamily: poster, fontWeight: 400, fontSize: { xs: 34, sm: 46, md: 60, lg: 68 }, lineHeight: 1.18, letterSpacing: headingTrack, textTransform: 'uppercase', ...sx }}>
      <ToneWords>{children}</ToneWords>
    </Typography>
  );
}

function replay(setOn) {
  setOn(false);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => setOn(true));
  });
}

function rise(delay, on = true) {
  return {
    opacity: on ? 1 : 0,
    animation: on ? `riseLine 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both` : 'none',
    '@media (prefers-reduced-motion: reduce)': { opacity: 1, animation: 'none' },
  };
}

function Reveal({ delay = 0, sx, children, ...rest }) {
  const ref = useRef(null);
  const reduce = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const active = useRef(false);
  const [shown, setShown] = useState(reduce.current);

  useEffect(() => {
    if (reduce.current) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.15) {
          if (!active.current) {
            active.current = true;
            replay(setShown);
          }
        } else if (!entry.isIntersecting && active.current) {
          active.current = false;
          setShown(false);
        }
      },
      { threshold: [0, 0.15] }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      {...rest}
      sx={{
        ...sx,
        opacity: shown ? 1 : 0,
        animation: shown ? `riseLine 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms backwards` : 'none',
        '@media (prefers-reduced-motion: reduce)': { opacity: 1, transform: 'none', animation: 'none' },
      }}
    >
      {children}
    </Box>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const go = (id) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 30, bgcolor: 'rgba(12,12,12,0.92)', backdropFilter: 'blur(16px)' }}>
      <Stack direction="row" alignItems="center" sx={{ ...wrap, position: 'relative', height: 72, gap: 2 }}>
        <Box component={RouterLink} href="/" aria-label="TradeDrop" sx={{ display: 'inline-flex', mr: 'auto' }}>
          <Box component="img" alt="TradeDrop" src={logo} sx={{ height: { xs: 34, sm: 44 }, width: 'auto', mixBlendMode: 'screen' }} />
        </Box>
        <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          {NAV.map((item) => (
            <Box
              key={item.id}
              component="button"
              type="button"
              onClick={() => go(item.id)}
              sx={{ border: 0, p: 0, bgcolor: 'transparent', color: muted, cursor: 'pointer', fontSize: 14, '&:hover': { color: ink } }}
            >
              {item.label}
            </Box>
          ))}
        </Stack>
        <Button component={RouterLink} href={paths.auth.jwt.signIn} sx={{ color: ink, minWidth: 0, px: 1.25, display: { xs: 'none', sm: 'inline-flex' }, '&:hover': { bgcolor: 'transparent', color: copper } }}>
          Login
        </Button>
        <Button component={RouterLink} href={paths.auth.jwt.signUp} variant="contained" sx={{ bgcolor: copper, color: onGold, borderRadius: 10, px: 2.25, boxShadow: 'none', '&:hover': { bgcolor: copperDeep, boxShadow: 'none' } }}>
          Sign up
        </Button>
        <IconButton aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((v) => !v)} sx={{ color: ink, display: { md: 'none' } }}>
          <Iconify icon={open ? 'mingcute:close-line' : 'mingcute:menu-line'} />
        </IconButton>
      </Stack>
      {open && (
        <Stack spacing={1.5} sx={{ ...wrap, pb: 2, display: { md: 'none' } }}>
          {NAV.map((item) => (
            <Box key={item.id} component="button" type="button" onClick={() => go(item.id)} sx={{ border: 0, p: 0, textAlign: 'left', bgcolor: 'transparent', color: ink, fontSize: 16, cursor: 'pointer' }}>
              {item.label}
            </Box>
          ))}
          <Button component={RouterLink} href={paths.auth.jwt.signIn} sx={{ color: ink, justifyContent: 'flex-start', px: 0 }}>
            Login
          </Button>
        </Stack>
      )}
      <Box sx={{ height: '1px', background: `linear-gradient(90deg, transparent 0%, rgba(244,240,230,0.22) 8%, ${copper} 46%, #F5E8C8 50%, ${copper} 54%, rgba(244,240,230,0.22) 92%, transparent 100%)` }} />
    </Box>
  );
}

export function LandingView() {
  const heroRef = useRef(null);
  const [heroOn, setHeroOn] = useState(false);

  useEffect(() => {
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = bg;
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHeroOn(true);
      return undefined;
    }
    const node = heroRef.current;
    if (!node) return undefined;
    let active = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.15) {
          if (!active) {
            active = true;
            replay(setHeroOn);
          }
        } else if (!entry.isIntersecting && active) {
          active = false;
          setHeroOn(false);
        }
      },
      { threshold: [0, 0.15] }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      sx={{
        bgcolor: bg,
        color: ink,
        minHeight: '100vh',
        overflowX: 'hidden',
        '@keyframes riseLine': {
          from: { opacity: 0, transform: 'translateY(40px)' },
          to: { opacity: 1, transform: 'none' },
        },
        '@keyframes driftPhoto': {
          from: { transform: 'scale(1.12)' },
          to: { transform: 'scale(1)' },
        },
        '@keyframes glowBreath': {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.72 },
          '50%': { transform: 'translate(-50%, -50%) scale(1.16)', opacity: 1 },
        },
        '@keyframes slowZoom': {
          from: { transform: 'scale(1)' },
          to: { transform: 'scale(1.08)' },
        },
        '@keyframes strokePulse': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
        '@keyframes tradeDrift': {
          '0%, 100%': { transform: 'translateY(-54%) translateX(0)' },
          '50%': { transform: 'translateY(-54%) translateX(-28px)' },
        },
      }}
    >
      <Header />

      <Box ref={heroRef} sx={{ position: 'relative', overflow: 'hidden', bgcolor: bg }}>
        <Box
          sx={{
            ...wrap,
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.15fr) minmax(220px, 0.85fr)' },
            alignItems: 'stretch',
            minHeight: { md: 620, lg: '82vh' },
          }}
        >
        <Typography
          aria-hidden
          sx={{
            display: { xs: 'none', lg: 'block' },
            position: 'absolute',
            left: '28%',
            top: '46%',
            transform: 'translateY(-50%)',
            m: 0,
            fontFamily: 'Impact, sans-serif',
            fontSize: 'clamp(8rem, 16vw, 14rem)',
            lineHeight: 0.8,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(184,146,61,0.28)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            animation: 'strokePulse 7s ease-in-out infinite',
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          Drop
        </Typography>

        <Box sx={{ position: 'relative', zIndex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: { xs: 5, md: 8 }, pr: { lg: 3 } }}>
          <Typography sx={{ fontFamily: mono, fontSize: '13px', letterSpacing: '0.18em', textTransform: 'uppercase', color: copper, ...rise(0.05, heroOn) }}>
            For people who trade the work
          </Typography>

          <Box
            component="h1"
            sx={{
              m: 0,
              pt: { xs: 2, md: 2.5 },
              fontFamily: 'Impact, sans-serif',
              fontWeight: 400,
              fontSize: { xs: 'clamp(2.7rem, 15vw, 4rem)', sm: 'clamp(3.5rem, 11vw, 5.6rem)', md: 'clamp(3.6rem, 6.2vw, 6.4rem)', lg: 'clamp(3.8rem, 7vw, 8.8rem)' },
              lineHeight: 1,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            <Box component="span" sx={{ display: 'block', color: '#f3efe6', ...rise(0.12, heroOn) }}>
              Trade
            </Box>
            <Box component="span" sx={{ display: 'block', color: copper, ...rise(0.24, heroOn) }}>
              Your
            </Box>
            <Box component="span" sx={{ display: 'block', color: 'transparent', WebkitTextStroke: '0.035em #6d645e', ...rise(0.36, heroOn) }}>
              Craft.
            </Box>
          </Box>

          <Typography sx={{ maxWidth: 520, mt: { xs: 3, md: 4 }, color: muted, fontFamily: mono, fontSize: '14px', lineHeight: 1.7, ...rise(0.48, heroOn) }}>
            A photographer needs styling. A designer needs the still. Post both sides, agree once, and keep the client. No fee.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3.5, ...rise(0.6, heroOn) }}>
            <Button component={RouterLink} href={paths.auth.jwt.signUp} variant="contained" sx={{ bgcolor: copper, color: onGold, borderRadius: 10, px: 3, minHeight: 48, boxShadow: 'none', '&:hover': { bgcolor: copperDeep, boxShadow: 'none' } }}>
              Sign Up
            </Button>
            <Button component={RouterLink} href={paths.auth.jwt.signIn} sx={{ color: '#FFFFFF', borderRadius: 10, px: 3, minHeight: 48, border: '1px solid rgba(255,255,255,0.35)', textDecoration: 'none', '&:hover': { borderColor: '#FFFFFF', bgcolor: 'transparent', textDecoration: 'none' } }}>
              Login
            </Button>
          </Stack>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, minWidth: 0, minHeight: { md: '100%' } }}>
          <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: 28, right: { md: 0, lg: 28 }, bottom: 52, left: { md: 36, lg: 56 }, border: `1px solid ${copper}`, ...rise(0.2, heroOn) }} />
          <Box sx={{ position: { xs: 'relative', md: 'absolute' }, top: { md: 48, lg: 56 }, right: { md: 12, lg: 48 }, bottom: { md: 128, lg: 120 }, left: { md: 0 }, height: { xs: 320, sm: 400, md: 'auto' }, overflow: { md: 'hidden' } }}>
            <Box component="img" src={heroLookbook} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: { xs: 'contain', md: 'cover' }, objectPosition: 'center', animation: { md: heroOn ? 'driftPhoto 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both' : 'none' }, '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }} />
          </Box>
          <Box sx={{ position: { xs: 'relative', md: 'absolute' }, left: { md: 0 }, right: { md: 20, lg: 64 }, bottom: { md: 16, lg: 36 }, bgcolor: bg, borderTop: `2px solid ${copper}`, px: { xs: 0, md: 2.5 }, py: 2, ...rise(0.4, heroOn) }}>
            <Typography sx={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: copper }}>Open drop · New York</Typography>
            <Typography sx={{ mt: 0.75, fontFamily: 'Impact, sans-serif', fontSize: 'clamp(1.5rem, 2vw, 2rem)', lineHeight: 1.12, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Styling for a fall lookbook
            </Typography>
            <Typography sx={{ mt: 1, fontFamily: mono, fontSize: '13px', color: muted }}>Half a day of portraits</Typography>
          </Box>
        </Box>
        </Box>
      </Box>

      <Box sx={{ overflow: 'hidden', borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}`, py: { xs: 5.5, md: 8 }, '@keyframes slideFacts': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } } }}>
        <Box sx={{ display: 'flex', width: 'max-content', animation: 'slideFacts 32s linear infinite', '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}>
          {[...FACTS, ...FACTS].map((fact, index) => (
            <Box key={`${fact}-${index}`} sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Typography sx={{ px: { xs: 3, md: 4 }, fontFamily: 'Impact, sans-serif', fontSize: { xs: '28px', md: '40px' }, lineHeight: 1, letterSpacing: '0.02em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: index % 2 ? copper : '#f3efe6' }}>
                {fact}
              </Typography>
              <Box sx={{ width: '7px', height: '7px', bgcolor: copper, transform: 'rotate(45deg)', flexShrink: 0 }} />
            </Box>
          ))}
        </Box>
      </Box>

      <Box id="product" sx={{ ...pad }}>
        <Box sx={wrap}>
          <Reveal>
            <Kicker>The product</Kicker>
            <Title>Five pieces. One desk.</Title>
          </Reveal>
          <Box
            sx={{
              mt: 5,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1.35fr 1fr 1fr' },
              gridAutoRows: { md: 'minmax(250px, auto)' },
              columnGap: { xs: 3, md: 6 },
              rowGap: { xs: 3, md: 4 },
            }}
          >
            {PRODUCT.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 90}
                sx={{
                  gridColumn: { md: item.wide ? '1 / -1' : 'auto', lg: item.wide ? '1 / 2' : 'auto' },
                  gridRow: { lg: item.wide ? '1 / span 2' : 'auto' },
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '22px',
                  height: { xs: item.wide ? 300 : 200, md: item.wide ? 420 : 230, lg: 'auto' },
                  minHeight: { lg: item.wide ? '100%' : 250 },
                  border: `1px solid ${line}`,
                  color: ink,
                  transition: 'transform 0.5s ease',
                  '&:hover': { transform: 'translateY(-8px)' },
                  background: item.image
                    ? 'transparent'
                    : [
                      'linear-gradient(165deg, rgba(217,185,106,0.72) 0%, rgba(138,107,37,0.28) 34%, #141414 68%)',
                      'linear-gradient(205deg, rgba(184,146,61,0.78) 0%, rgba(92,70,24,0.35) 36%, #121212 70%)',
                      'linear-gradient(150deg, rgba(245,232,200,0.42) 0%, rgba(184,146,61,0.22) 32%, #161616 66%)',
                      'linear-gradient(188deg, rgba(138,107,37,0.9) 0%, rgba(184,146,61,0.25) 40%, #101010 72%)',
                    ][index - 1],
                  '&:hover img': { transform: 'scale(1.08)' },
                }}
              >
                {item.image && (
                  <Box
                    component="img"
                    src={item.image}
                    alt=""
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s ease',
                    }}
                  />
                )}
                {item.image && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(12,12,12,0.05) 0%, rgba(12,12,12,0.08) 32%, rgba(138,107,37,0.55) 70%, rgba(12,12,12,0.94) 100%)',
                    }}
                  />
                )}
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${copper}, transparent)` }} />
                {!item.image && (
                  <Typography sx={{ position: 'absolute', top: { xs: 12, md: 18 }, left: { xs: 18, md: 24 }, zIndex: 1, fontFamily: 'Impact, sans-serif', fontSize: 'clamp(4.6rem, 6vw, 7rem)', lineHeight: 0.8, letterSpacing: '0.02em', color: 'transparent', WebkitTextStroke: '1.5px rgba(244,240,230,0.7)', pointerEvents: 'none' }}>
                    0{index + 1}
                  </Typography>
                )}
                <Box sx={{ position: 'relative', zIndex: 1, height: '100%', minHeight: 'inherit', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: { xs: 2.5, md: 3 } }}>
                  {item.image && (
                    <Typography sx={{ fontFamily: mono, fontSize: '12px', letterSpacing: '0.18em', color: '#F5E8C8' }}>0{index + 1}</Typography>
                  )}
                  <Typography sx={{ mt: item.image ? 1 : 0, fontFamily: poster, fontSize: item.wide ? { xs: '34px', sm: '42px', lg: '48px' } : { xs: '26px', md: '30px' }, lineHeight: 1.18, letterSpacing: headingTrack, textTransform: 'uppercase', color: ink }}>{item.title}</Typography>
                  <Typography sx={{ mt: 1.25, color: 'rgba(244,240,230,0.86)', fontFamily: mono, fontSize: '13px', lineHeight: 1.65, maxWidth: 420 }}>{item.text}</Typography>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ ...pad, pt: 0 }}>
        <Box sx={wrap}>
          <Reveal>
            <Kicker>Who it is for</Kicker>
            <Title>If the work is the currency.</Title>
          </Reveal>
          <Box sx={{ mt: 5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
            {ROLES.map((role, index) => (
              <Reveal
                key={role.name}
                delay={index * 90}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  p: 2.5,
                  borderRadius: '20px',
                  border: `1px solid rgba(184,146,61,0.35)`,
                  transition: 'transform 0.5s ease',
                  '&:hover': { transform: 'translateY(-8px)' },
                  background: [
                    'linear-gradient(155deg, rgba(217,185,106,0.62) 0%, #1A1712 58%)',
                    'linear-gradient(205deg, #A6853A 0%, #2A2416 46%, #141210 100%)',
                    'linear-gradient(165deg, rgba(184,146,61,0.48) 0%, #161412 62%)',
                    'linear-gradient(145deg, #1C1A16 0%, #3A3120 100%)',
                  ][index],
                }}
              >
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, #F5E8C8, ${copper}, transparent)` }} />
                <Typography sx={{ fontFamily: mono, fontSize: '12px', letterSpacing: '0.18em', color: '#F5E8C8' }}>0{index + 1}</Typography>
                <Typography sx={{ mt: 1.5, fontFamily: poster, fontSize: '28px', lineHeight: 1.18, letterSpacing: headingTrack, textTransform: 'uppercase', color: ink }}>{role.name}</Typography>
                <Typography sx={{ mt: 1.5, color: 'rgba(244,240,230,0.82)', fontFamily: mono, fontSize: '13px', lineHeight: 1.65 }}>{role.line}</Typography>
              </Reveal>
            ))}
          </Box>
        </Box>
      </Box>

      <Box id="crafts" sx={{ ...pad, bgcolor: '#080808' }}>
        <Box sx={wrap}>
          <Reveal>
            <Kicker>The wider room</Kicker>
            <Title>Every craft needs another.</Title>
          </Reveal>
          <Box sx={{ position: 'relative', mt: { xs: 4, md: 6 } }}>
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: { xs: '92%', md: '62%' },
                height: { xs: '42%', md: '58%' },
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(245,232,200,0.42) 0%, rgba(217,185,106,0.34) 22%, rgba(184,146,61,0.22) 46%, rgba(138,107,37,0.08) 68%, transparent 78%)',
                filter: 'blur(10px)',
                pointerEvents: 'none',
                animation: 'glowBreath 8s ease-in-out infinite',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            />
            {TRADES.map((trade, index) => (
              <Reveal key={trade.name} delay={index * 50} sx={{ position: 'relative', display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' }, alignItems: { xs: 'center', md: 'baseline' }, gap: { xs: 1, md: 2.5 }, py: { xs: 1.75, md: 2 }, borderBottom: `1px solid ${line}`, transition: 'transform 0.45s ease', '&:hover': { transform: { md: 'translateX(8px)' } } }}>
                <Typography sx={{ fontFamily: poster, fontSize: { xs: '20px', sm: '24px', md: '28px' }, lineHeight: 1, letterSpacing: headingTrack, textTransform: 'uppercase', minWidth: 0 }}>{trade.name}</Typography>
                <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 1, borderBottom: '1px dashed rgba(184,146,61,0.55)', minWidth: 24 }} />
                <Typography sx={{ width: { xs: '100%', md: 'auto' }, fontFamily: mono, fontSize: { xs: '12px', md: '14px' }, letterSpacing: '0.04em', color: muted, textAlign: { xs: 'left', md: 'right' } }}>
                  needs: <Box component="span" sx={{ color: '#F5E8C8' }}>{trade.needs}</Box>
                </Typography>
              </Reveal>
            ))}
          </Box>
        </Box>
      </Box>

      <Box id="drops" sx={{ ...pad, bgcolor: '#080808' }}>
        <Box sx={wrap}>
          <Reveal>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 5 }}>
              <Box>
                <Kicker>The board</Kicker>
                <Title>Drops that are actually specific.</Title>
              </Box>
              <Typography sx={{ maxWidth: 360, color: muted, fontFamily: mono, fontSize: 14, lineHeight: 1.7, alignSelf: { md: 'end' } }}>
                A useful drop can be answered in one tap. Vague posts do not survive here.
              </Typography>
            </Stack>
          </Reveal>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.25fr 0.75fr' }, gap: { xs: 3, lg: 3 }, alignItems: 'stretch' }}>
            <Reveal sx={{ position: 'relative', height: { xs: 380, sm: 460, lg: 620 }, overflow: 'hidden' }}>
              <Box component="img" src={DROPS[0].image} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', animation: 'slowZoom 18s ease-in-out infinite alternate', '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }} />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(12,12,12,0.05) 20%, rgba(12,12,12,0.2) 48%, rgba(12,12,12,0.92) 100%)' }} />
              <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: { xs: 2.5, md: 4 } }}>
                <Typography sx={{ fontFamily: mono, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F5E8C8', overflowWrap: 'anywhere' }}>
                  01  ·  {DROPS[0].role}  ·  {DROPS[0].city}  ·  {DROPS[0].status}
                </Typography>
                <Typography sx={{ mt: 1.5, maxWidth: 560, fontFamily: 'Impact, sans-serif', fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', lineHeight: 1.12, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  <ToneWords>{DROPS[0].ask}</ToneWords>
                </Typography>
                <Typography sx={{ mt: 2, maxWidth: 420, fontFamily: mono, fontSize: '14px', lineHeight: 1.7, color: 'rgba(244,240,230,0.86)' }}>
                  {DROPS[0].give}
                </Typography>
              </Box>
            </Reveal>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {DROPS.slice(1).map((drop, index) => (
                <Reveal key={drop.role} delay={index * 100} sx={{ display: 'grid', gridTemplateColumns: { xs: '92px 1fr', sm: '128px 1fr' }, gap: { xs: 1.5, md: 2.5 }, alignItems: 'center', py: { xs: 2, lg: 0 }, borderTop: index ? `1px solid ${line}` : 'none', minWidth: 0, '&:hover img': { transform: 'scale(1.08)' } }}>
                  <Box sx={{ position: 'relative', height: { xs: 92, sm: 128 }, overflow: 'hidden' }}>
                    <Box component="img" src={drop.image} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }} />
                  </Box>
                  <Box sx={{ py: { lg: 2 }, minWidth: 0 }}>
                    <Typography sx={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: copper }}>
                      0{index + 2}  ·  {drop.city}  ·  {drop.status}
                    </Typography>
                    <Typography sx={{ mt: 0.75, fontFamily: poster, fontSize: '26px', lineHeight: 1, letterSpacing: headingTrack, textTransform: 'uppercase' }}>{drop.role}</Typography>
                    <Typography sx={{ mt: 1, color: ink, fontFamily: mono, fontSize: '13px', lineHeight: 1.6 }}>{drop.ask}</Typography>
                    <Typography sx={{ mt: 0.75, color: muted, fontFamily: mono, fontSize: '13px', lineHeight: 1.6 }}>{drop.give}</Typography>
                  </Box>
                </Reveal>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={pad}>
        <Box sx={{ ...wrap, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.8fr 1.2fr' }, gap: { xs: 4, md: 8 }, alignItems: 'start' }}>
          <Reveal>
            <Kicker>Against the other options</Kicker>
            <Title>Not a marketplace. Not a favor.</Title>
          </Reveal>
          <Stack spacing={0} sx={{ borderTop: `1px solid ${line}` }}>
            {COMPARE.map((row, index) => (
              <Reveal key={row.label} delay={index * 70} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '140px 1fr 1fr' }, gap: { xs: 0.5, sm: 2 }, py: 2.25, borderBottom: `1px solid ${line}`, minWidth: 0 }}>
                <Typography sx={{ color: faint, fontSize: 13 }}>{row.label}</Typography>
                <Typography sx={{ color: muted, fontFamily: mono, fontSize: 14 }}>{row.theirs}</Typography>
                <Typography sx={{ fontFamily: mono, fontSize: 14 }}>{row.ours}</Typography>
              </Reveal>
            ))}
          </Stack>
        </Box>
      </Box>

      <Box id="circles" sx={{ ...pad, bgcolor: '#080808' }}>
        <Box sx={wrap}>
          <Reveal>
            <Kicker>Membership</Kicker>
            <Title>Circles with a door policy.</Title>
          </Reveal>
          <Box sx={{ mt: 2 }}>
            {CIRCLES.map((circle, index) => (
              <Reveal
                key={circle.name}
                delay={index * 90}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr auto', lg: '140px 120px 1.4fr 1fr' },
                  columnGap: { xs: 2, md: 4 },
                  rowGap: 1,
                  alignItems: 'center',
                  py: { xs: 3, md: 4 },
                  borderTop: `1px solid ${line}`,
                  borderBottom: index === CIRCLES.length - 1 ? `1px solid ${line}` : 'none',
                  background: circle.access === 'Private' ? 'linear-gradient(90deg, rgba(184,146,61,0.16), transparent 55%)' : 'transparent',
                  transition: 'background 0.45s ease',
                  '&:hover': { background: 'linear-gradient(90deg, rgba(184,146,61,0.22), transparent 70%)' },
                }}
              >
                <Typography sx={{ fontFamily: mono, fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: copper }}>{circle.access}</Typography>
                <Typography sx={{ fontFamily: 'Impact, sans-serif', fontSize: { xs: '42px', lg: '64px' }, lineHeight: 0.8, letterSpacing: '0.02em', color: circle.access === 'Private' ? copper : 'transparent', WebkitTextStroke: circle.access === 'Private' ? '0' : '1.5px rgba(244,240,230,0.8)', textAlign: { xs: 'right', lg: 'left' } }}>{circle.count}</Typography>
                <Box sx={{ gridColumn: { xs: '1 / -1', lg: 'auto' }, minWidth: 0 }}>
                  <Typography sx={{ fontFamily: poster, fontSize: { xs: '26px', sm: '30px', lg: '34px' }, lineHeight: 1.18, letterSpacing: headingTrack, textTransform: 'uppercase' }}>{circle.name}</Typography>
                  <Typography sx={{ mt: 0.75, fontFamily: mono, fontSize: '13px', color: muted }}>{circle.place}</Typography>
                </Box>
                <Typography sx={{ gridColumn: { xs: '1 / -1', lg: 'auto' }, minWidth: 0, fontFamily: mono, fontSize: '14px', lineHeight: 1.7, color: 'rgba(244,240,230,0.82)' }}>{circle.note}</Typography>
              </Reveal>
            ))}
          </Box>
        </Box>
      </Box>

      <Box id="events" sx={pad}>
        <Box sx={wrap}>
          <Reveal>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'end' }} spacing={2}>
              <Box>
                <Kicker>Off the screen</Kicker>
                <Title>A short calendar.</Title>
              </Box>
              <Typography sx={{ maxWidth: 320, color: muted, fontFamily: mono, fontSize: '14px', lineHeight: 1.7 }}>
                A city, a host, and a list that actually ends.
              </Typography>
            </Stack>
          </Reveal>

          <Box sx={{ mt: { xs: 4, md: 5 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
            {EVENTS.map((event, index) => (
              <Reveal
                key={event.name}
                delay={index * 100}
                sx={{
                  py: { xs: 3, md: 0 },
                  pl: { md: index ? 4 : 0 },
                  pr: { md: 3 },
                  borderTop: { xs: index ? `1px solid ${line}` : 'none', md: 'none' },
                  borderLeft: { md: index ? `1px solid ${line}` : 'none' },
                }}
              >
                <Typography sx={{ fontFamily: mono, fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: copper }}>
                  {event.mon}  ·  {event.city}  ·  {event.seats}
                </Typography>
                <Typography sx={{ mt: 1.5, fontFamily: poster, fontSize: { xs: '28px', md: '32px' }, lineHeight: 1.18, letterSpacing: headingTrack, textTransform: 'uppercase' }}>{event.name}</Typography>
                <Typography sx={{ mt: 1.25, fontFamily: mono, fontSize: '13px', lineHeight: 1.6, color: muted }}>{event.host}</Typography>
              </Reveal>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ ...pad, pt: 0 }}>
        <Box sx={{ ...wrap, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {NOTES.map((note, index) => (
            <Reveal
              key={note.name}
              delay={index * 120}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                p: { xs: 3, md: 4 },
                borderRadius: '22px',
                color: index ? ink : onGold,
                border: index ? '1px solid rgba(184,146,61,0.4)' : 'none',
                background: index
                  ? 'linear-gradient(205deg, rgba(217,185,106,0.34) 0%, #141210 48%)'
                  : `linear-gradient(145deg, ${copperDeep} 0%, ${copper} 46%, #D9B96A 100%)`,
                transition: 'transform 0.5s ease',
                '&:hover': { transform: 'translateY(-8px)' },
              }}
            >
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: index ? `linear-gradient(90deg, #F5E8C8, ${copper}, transparent)` : 'linear-gradient(90deg, rgba(255,255,255,0.7), transparent)' }} />
              <Typography sx={{ fontFamily: 'Impact, sans-serif', fontSize: '48px', lineHeight: 0.7, color: index ? copper : 'rgba(255,255,255,0.7)' }}>&ldquo;</Typography>
              <Typography sx={{ mt: 1.5, fontFamily: poster, fontSize: { xs: '26px', md: '32px' }, lineHeight: 1.2, color: 'inherit' }}>{note.quote}</Typography>
              <Box sx={{ mt: 3, pt: 2, borderTop: index ? `1px solid ${line}` : '1px solid rgba(255,255,255,0.35)' }}>
                <Typography sx={{ fontFamily: poster, fontSize: '18px', letterSpacing: headingTrack, textTransform: 'uppercase', color: 'inherit' }}>{note.name}</Typography>
                <Typography sx={{ mt: 0.5, fontFamily: mono, fontSize: '13px', letterSpacing: '0.06em', color: index ? muted : 'rgba(255,255,255,0.82)' }}>{note.role}</Typography>
              </Box>
            </Reveal>
          ))}
        </Box>
      </Box>

      <Box sx={{ ...pad, bgcolor: '#080808' }}>
        <Box sx={wrap}>
          <Reveal>
            <Kicker>Practical</Kicker>
            <Title>Before the first drop.</Title>
          </Reveal>
          <Box sx={{ position: 'relative', mt: 5 }}>
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: { xs: '88%', md: '70%' },
                height: { xs: '46%', md: '72%' },
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(245,232,200,0.42) 0%, rgba(217,185,106,0.34) 22%, rgba(184,146,61,0.22) 46%, rgba(138,107,37,0.08) 68%, transparent 78%)',
                filter: 'blur(10px)',
                pointerEvents: 'none',
                animation: 'glowBreath 8s ease-in-out infinite',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            />
            <Box sx={{ position: 'relative', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {QUESTIONS.map((item, index) => (
              <Reveal key={item.q} delay={(index % 2) * 80} sx={{ position: 'relative', zIndex: 1, p: 3, borderRadius: 3, border: `1px solid ${line}`, transition: 'border-color 0.4s ease, transform 0.45s ease', '&:hover': { borderColor: copper, transform: 'translateY(-6px)' } }}>
                <Typography sx={{ fontFamily: poster, fontSize: 26, lineHeight: 1.18, letterSpacing: headingTrack, textTransform: 'uppercase' }}>{item.q}</Typography>
                <Typography sx={{ mt: 1, color: muted, fontFamily: mono, fontSize: 14, lineHeight: 1.7 }}>{item.a}</Typography>
              </Reveal>
            ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 8, md: 12 },
          color: '#1A1408',
          background: 'linear-gradient(105deg, #3d2e10 0%, #5C4618 16%, #8A6B25 38%, #B8923D 58%, #D9B96A 78%, #F5E8C8 100%)',
        }}
      >
        <Typography
          aria-hidden
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            right: { md: '-2%', lg: '2%' },
            top: '50%',
            transform: 'translateY(-54%)',
            m: 0,
            fontFamily: 'Impact, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(9rem, 18vw, 16rem)',
            lineHeight: 0.8,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: 'rgba(61,46,16,0.28)',
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 32%, #000 72%, transparent 100%)',
            maskImage: 'linear-gradient(90deg, transparent 0%, #000 32%, #000 72%, transparent 100%)',
            animation: 'tradeDrift 9s ease-in-out infinite',
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          Trade
        </Typography>
        <Reveal sx={{ ...wrap, position: 'relative', zIndex: 1 }}>
          <Typography sx={{ fontFamily: poster, fontSize: { xs: '36px', sm: '48px', md: '68px', lg: '80px' }, lineHeight: 1.18, letterSpacing: headingTrack, textTransform: 'uppercase', maxWidth: 860, color: '#F5E8C8' }}>
            Post the need. Name the offer.
          </Typography>
          <Typography sx={{ mt: 2, maxWidth: 520, color: 'rgba(245,232,200,0.88)', fontFamily: mono, fontSize: '14px', lineHeight: 1.7 }}>
            A drop is both halves. A tap is the yes. Circles and events are where the work meets.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
            <Button component={RouterLink} href={paths.auth.jwt.signUp} variant="contained" sx={{ bgcolor: '#F5E8C8', color: copperDeep, borderRadius: 10, px: 3, minHeight: 48, boxShadow: 'none', '&:hover': { bgcolor: '#fff', boxShadow: 'none' } }}>
              Sign up
            </Button>
            <Button component={RouterLink} href={paths.auth.jwt.signIn} sx={{ color: '#F5E8C8', borderRadius: 10, px: 3, minHeight: 48, border: '1px solid rgba(245,232,200,0.55)', '&:hover': { bgcolor: 'transparent', borderColor: '#F5E8C8' } }}>
              Login
            </Button>
          </Stack>
        </Reveal>
      </Box>

      <Box component="footer" sx={{ py: 3 }}>
        <Box sx={{ ...wrap, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr' }, justifyItems: { xs: 'center', sm: 'stretch' }, alignItems: 'center', rowGap: 1.5, columnGap: 2 }}>
        <Box component={RouterLink} href="/" aria-label="TradeDrop" sx={{ display: 'inline-flex', justifySelf: { xs: 'center', sm: 'start' } }}>
          <Box component="img" alt="TradeDrop" src={logo} sx={{ height: { xs: 32, md: 40 }, width: 'auto', mixBlendMode: 'screen' }} />
        </Box>
        <Typography sx={{ fontFamily: mono, fontSize: { xs: '11px', md: '12px' }, color: faint, textAlign: 'center' }}>© 2026 TradeDrop. All rights reserved.</Typography>
        <Stack direction="row" spacing={2} sx={{ justifySelf: { xs: 'center', sm: 'end' } }}>
          <Box component={RouterLink} href={paths.auth.jwt.signIn} sx={{ color: '#FFFFFF', fontFamily: mono, fontSize: 13, whiteSpace: 'nowrap', textDecoration: 'none', '&:hover': { color: '#FFFFFF', textDecoration: 'none' } }}>Login</Box>
          <Box component={RouterLink} href={paths.auth.jwt.signUp} sx={{ color: '#FFFFFF', fontFamily: mono, fontSize: 13, whiteSpace: 'nowrap', textDecoration: 'none', '&:hover': { color: '#FFFFFF', textDecoration: 'none' } }}>Sign up</Box>
        </Stack>
        </Box>
      </Box>
    </Box>
  );
}
