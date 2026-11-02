import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';
import { SvgIcon } from '@mui/material';


const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;


const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  users: icon('ic-users'),
  settings: icon('ic-settings'),
  category: icon("ic-category"),
  timingChips: icon("ic-timing-chips"),
  badges: icon("ic-badges"),
  disputes: icon("ic-disputes"),
  export: icon("ic-export"),
  request: icon("ic-request")
};


let notification = <SvgIcon>
  <path
    fill="currentColor"
    d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.794 25.794 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.393 4.393 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
    opacity="0.5"
  />
  <path
    fill="currentColor"
    d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"
  />
</SvgIcon>

export const navDataAdmin = [

  {
    subheader: 'Dashboard',
    items: [
      { title: 'Dashboard', path: paths.adminDashboard.root, icon: ICONS.dashboard },
      { title: "Users", path: paths.adminDashboard.users.root, icon: ICONS.users, deepMatch: true },
      { title: "Circles", path: paths.adminDashboard.circles, icon: ICONS.chat, deepMatch: true },
      { title: "Events", path: paths.adminDashboard.events, icon: ICONS.calendar, deepMatch: true },
      { title: "Drops", path: paths.adminDashboard.drops, icon: ICONS.request },
      { title: "Category", path: paths.adminDashboard.categories, icon: ICONS.category },
      { title: "Timing chips", path: paths.adminDashboard.timingChips, icon: ICONS.timingChips },
      { title: "Badges", path: paths.adminDashboard.badges, icon: ICONS.badges },
      { title: "Disputes", path: paths.adminDashboard.disputes, icon: ICONS.disputes, deepMatch: true },
      { title: "Notifications", path: paths.adminDashboard.notifications, icon: notification },
      {
        title: "CMS", path: paths.adminDashboard.cms.root, icon: ICONS.file,
        children: [
          { title: "FAQs", path: paths.adminDashboard.cms.faqs },
          { title: "About Us", path: paths.adminDashboard.cms.aboutUs },
          { title: "Terms of Service", path: paths.adminDashboard.cms.termsOfService },
          { title: "Privacy Policy", path: paths.adminDashboard.cms.privacyPolicy },
        ]
      },
      { title: 'Settings', path: paths.adminDashboard.settings, icon: ICONS.settings }
    ],
  },
];
