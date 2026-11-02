import Calendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { useResponsive } from 'src/hooks/use-responsive';
import { fDate } from 'src/utils/format-time';
import { varAlpha } from 'src/theme/styles';

import { StyledCalendar } from 'src/sections/calendar/styles';

import { getEventStatusOption } from '../event-status';
import { EVENTS } from '../mocks/data';

const VIEW_OPTIONS = [
  { value: 'dayGridMonth', label: 'Month', icon: 'mingcute:calendar-month-line' },
  { value: 'timeGridWeek', label: 'Week', icon: 'mingcute:calendar-week-line' },
  { value: 'timeGridDay', label: 'Day', icon: 'mingcute:calendar-day-line' },
  { value: 'listWeek', label: 'Agenda', icon: 'fluent:calendar-agenda-24-regular' },
];

const STATUS_COLOR = {
  published: 'success',
  full: 'warning',
  reported: 'error',
  cancelled: 'default',
};

function EventsCalendarToolbar({ date, view, onToday, onNextDate, onPrevDate, onChangeView }) {
  const popover = usePopover();
  const selectedItem = VIEW_OPTIONS.find((item) => item.value === view) || VIEW_OPTIONS[0];

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      >
        <Button
          size="small"
          color="inherit"
          variant="outlined"
          onClick={popover.onOpen}
          startIcon={<Iconify icon={selectedItem.icon} />}
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" sx={{ ml: -0.5 }} />}
          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          {selectedItem.label}
        </Button>

        <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="center">
          <IconButton onClick={onPrevDate}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>
          <Typography variant="h6" sx={{ minWidth: 160, textAlign: 'center' }}>
            {date}
          </Typography>
          <IconButton onClick={onNextDate}>
            <Iconify icon="eva:arrow-ios-forward-fill" />
          </IconButton>
        </Stack>

        <Button size="small" variant="contained" color="primary" onClick={onToday} sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
          Today
        </Button>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-left' } }}
      >
        <MenuList>
          {VIEW_OPTIONS.map((viewOption) => (
            <MenuItem
              key={viewOption.value}
              selected={viewOption.value === view}
              onClick={() => {
                popover.onClose();
                onChangeView(viewOption.value);
              }}
            >
              <Iconify icon={viewOption.icon} />
              {viewOption.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}

export function EventsCalendarPanel({ events = EVENTS, onEventClick }) {
  const theme = useTheme();
  const calendarRef = useRef(null);
  const smUp = useResponsive('up', 'sm');

  const [date, setDate] = useState(() => new Date('2026-12-01'));
  const [view, setView] = useState(smUp ? 'dayGridMonth' : 'listWeek');

  const calendarEvents = useMemo(
    () =>
      events.map((event) => {
        const statusOption = getEventStatusOption(event.status);
        const paletteKey = STATUS_COLOR[event.status] || 'primary';
        const color =
          paletteKey === 'default'
            ? theme.vars.palette.grey[600]
            : theme.vars.palette[paletteKey]?.main || theme.vars.palette.primary.main;

        return {
          id: event.id,
          title: event.name,
          start: event.start,
          end: event.end,
          allDay: false,
          backgroundColor: color,
          borderColor: color,
          textColor: theme.vars.palette.common.white,
          extendedProps: {
            code: event.code,
            host: event.host,
            location: event.location,
            status: statusOption?.label || event.status,
            statusKey: event.status,
          },
        };
      }),
    [events, theme]
  );

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (!calendarEl) return;

    const calendarApi = calendarEl.getApi();
    const nextView = smUp ? 'dayGridMonth' : 'listWeek';
    calendarApi.changeView(nextView);
    setView(nextView);
  }, [smUp]);

  const syncDate = useCallback(() => {
    const calendarEl = calendarRef.current;
    if (!calendarEl) return;
    setDate(calendarEl.getApi().getDate());
  }, []);

  const onChangeView = useCallback((newView) => {
    const calendarEl = calendarRef.current;
    if (!calendarEl) return;
    calendarEl.getApi().changeView(newView);
    setView(newView);
  }, []);

  const onDateToday = useCallback(() => {
    const calendarEl = calendarRef.current;
    if (!calendarEl) return;
    calendarEl.getApi().today();
    syncDate();
  }, [syncDate]);

  const onDatePrev = useCallback(() => {
    const calendarEl = calendarRef.current;
    if (!calendarEl) return;
    calendarEl.getApi().prev();
    syncDate();
  }, [syncDate]);

  const onDateNext = useCallback(() => {
    const calendarEl = calendarRef.current;
    if (!calendarEl) return;
    calendarEl.getApi().next();
    syncDate();
  }, [syncDate]);

  const handleEventClick = useCallback(
    (arg) => {
      arg.jsEvent.preventDefault();
      onEventClick?.(arg.event.id);
    },
    [onEventClick]
  );

  const renderEventContent = useCallback((arg) => {
    const { event, timeText, view: currentView } = arg;
    const isList = currentView.type.startsWith('list');

    if (isList) {
      return (
        <Box sx={{ py: 0.75, px: 0.5, width: 1, cursor: 'pointer' }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="subtitle2">{event.title}</Typography>
            <Label variant="soft" color={STATUS_COLOR[event.extendedProps.statusKey] || 'default'}>
              {event.extendedProps.status}
            </Label>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {[timeText, event.extendedProps.host, event.extendedProps.location].filter(Boolean).join(' · ')}
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          px: 0.75,
          py: 0.25,
          width: 1,
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        <Typography
          component="span"
          variant="caption"
          sx={{
            fontWeight: 700,
            color: 'inherit',
            display: 'block',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {timeText ? `${timeText} ` : ''}
          {event.title}
        </Typography>
      </Box>
    );
  }, []);

  return (
    <Card
      sx={{
        minWidth: 0,
        overflow: 'hidden',
        minHeight: { xs: 560, md: 720 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <EventsCalendarToolbar
        date={fDate(date)}
        view={view}
        onNextDate={onDateNext}
        onPrevDate={onDatePrev}
        onToday={onDateToday}
        onChangeView={onChangeView}
      />

      <StyledCalendar
        sx={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          px: 1,
          pt: 1,
          pb: 1,
          '.fc.fc-media-screen': { flex: '1 1 auto' },
          '& .fc .fc-event': {
            cursor: 'pointer !important',
            border: 'none !important',
            borderRadius: '8px !important',
            backgroundColor: 'var(--fc-event-bg-color) !important',
            boxShadow: theme.customShadows?.z1,
            transition: theme.transitions.create(['transform', 'box-shadow', 'opacity']),
            '&:hover': {
              opacity: 0.92,
              transform: 'translateY(-1px)',
              boxShadow: theme.customShadows?.z8 || theme.shadows[4],
            },
          },
          '& .fc .fc-event .fc-event-main': {
            p: 0,
            borderRadius: 1,
            overflow: 'hidden',
            color: `${theme.vars.palette.common.white} !important`,
            backgroundColor: 'transparent !important',
            '&::before': { display: 'none' },
          },
          '& .fc .fc-event .fc-event-main-frame': {
            filter: 'none',
            color: theme.vars.palette.common.white,
          },
          '& .fc .fc-daygrid-event-dot': { display: 'none' },
          '& .fc .fc-daygrid-day.fc-day-today': {
            backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.04),
          },
          '& .fc .fc-daygrid-day-frame': {
            minHeight: { md: 110 },
          },
          '& .fc .fc-list-event': {
            cursor: 'pointer',
            transition: theme.transitions.create(['background-color']),
            '&:hover td': {
              backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.06),
            },
          },
          '& .fc .fc-list-event-dot': {
            borderColor: 'currentColor',
          },
        }}
      >
        <Calendar
          weekends
          selectable={false}
          editable={false}
          rerenderDelay={10}
          ref={calendarRef}
          initialDate={date}
          initialView={view}
          dayMaxEventRows={3}
          eventDisplay="block"
          events={calendarEvents}
          headerToolbar={false}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          height="auto"
          contentHeight={620}
          plugins={[listPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
        />
      </StyledCalendar>
    </Card>
  );
}
