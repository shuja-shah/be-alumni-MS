// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
const user = JSON.parse(localStorage.getItem('user'));
const navConfig = user && user.is_admin ? [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'users',
    path: '/users',
    icon: icon('ic_user'),
  },
  {
    title: 'Jobs',
    path: '/jobs',
    icon: icon('ic_cart'),
  },
  {
    title: 'Chat Channels',
    path: '/channel',
    icon: icon('ic_chat')
  },
] : user && user.is_alumni ? [{

  title: 'Jobs',
  path: '/jobs',
  icon: icon('ic_cart'),
},
{

  title: 'Chat',
  path: '/chat',
  icon: icon('ic_chat'),
},
] : [{
  title: 'Profile',
  path: '/profile',
  icon: icon('ic_user'),
},
{

  title: 'Chat',
  path: '/chat',
  icon: icon('ic_chat'),
},

];

export default navConfig;
