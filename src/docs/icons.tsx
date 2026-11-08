/* Simple inline icons for stories. Not part of the public API. */
import type { SVGProps } from 'react';

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 20 20',
  width: 20,
  height: 20,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const PlusIcon = () => (
  <svg {...base}>
    <path d="M10 4v12M4 10h12" />
  </svg>
);

export const ArrowRightIcon = () => (
  <svg {...base}>
    <path d="M4 10h12m-5-5 5 5-5 5" />
  </svg>
);

export const TrashIcon = () => (
  <svg {...base}>
    <path d="M3.5 5.5h13M8 5.5V4h4v1.5m-6.5 0 .8 10.5h7.4l.8-10.5" />
  </svg>
);

export const SettingsIcon = () => (
  <svg {...base}>
    <circle cx="10" cy="10" r="2.5" />
    <path d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1 4.7 4.7" />
  </svg>
);

export const SearchIcon = () => (
  <svg {...base}>
    <circle cx="9" cy="9" r="5.5" />
    <path d="m13 13 4 4" />
  </svg>
);

export const HeartIcon = () => (
  <svg {...base}>
    <path d="M10 16.5s-6.5-3.8-6.5-8.3A3.7 3.7 0 0 1 10 6a3.7 3.7 0 0 1 6.5 2.2c0 4.5-6.5 8.3-6.5 8.3Z" />
  </svg>
);

export const MailIcon = () => (
  <svg {...base}>
    <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
    <path d="m3 5.5 7 5 7-5" />
  </svg>
);

export const LockIcon = () => (
  <svg {...base}>
    <rect x="4" y="9" width="12" height="8" rx="2" />
    <path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" />
  </svg>
);

export const UserIcon = () => (
  <svg {...base}>
    <circle cx="10" cy="7" r="3.5" />
    <path d="M3.5 17a6.5 6.5 0 0 1 13 0" />
  </svg>
);

export const GlobeIcon = () => (
  <svg {...base}>
    <circle cx="10" cy="10" r="7.5" />
    <path d="M2.5 10h15M10 2.5c2 2.2 3 4.7 3 7.5s-1 5.3-3 7.5c-2-2.2-3-4.7-3-7.5s1-5.3 3-7.5Z" />
  </svg>
);

export const MessageIcon = () => (
  <svg {...base}>
    <path d="M4 4.5h12a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H9l-4 3v-3H4A1.5 1.5 0 0 1 2.5 13V6A1.5 1.5 0 0 1 4 4.5Z" />
  </svg>
);

export const CheckCircleIcon = () => (
  <svg {...base}>
    <circle cx="10" cy="10" r="7.5" />
    <path d="m6.75 10.25 2.25 2.25 4.25-4.75" />
  </svg>
);

export const GridIcon = () => (
  <svg {...base}>
    <rect x="3" y="3" width="5.5" height="5.5" rx="1" />
    <rect x="11.5" y="3" width="5.5" height="5.5" rx="1" />
    <rect x="3" y="11.5" width="5.5" height="5.5" rx="1" />
    <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1" />
  </svg>
);

export const ListIcon = () => (
  <svg {...base}>
    <path d="M7 5h10M7 10h10M7 15h10M3 5h.01M3 10h.01M3 15h.01" />
  </svg>
);

export const ColumnsIcon = () => (
  <svg {...base}>
    <rect x="2.5" y="3.5" width="15" height="13" rx="1.5" />
    <path d="M7.5 3.5v13M12.5 3.5v13" />
  </svg>
);

export const CircleIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 20 20" width={20} height={20}>
    <circle cx="10" cy="10" r="5" fill={color} />
  </svg>
);
