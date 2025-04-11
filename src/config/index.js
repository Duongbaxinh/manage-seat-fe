import { GiAccordion } from 'react-icons/gi';
import { RoomIcon } from '../icons';

export const URL_DASHBOARD = [
  {
    icon: <RoomIcon />,
    url: '/room-management',
    title: 'Manage Room',
  },
  {
    icon: <GiAccordion />,
    url: '/account-management',
    title: 'Manage Account',
  },
];
