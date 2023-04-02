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
] : user && (user.is_admin || user.is_alumni) ? [{

  title: 'Jobs',
  path: '/jobs',
  icon: icon('ic_cart'),
},
] : [{
  title: 'Profile',
  path: '/profile',
  icon: icon('ic_user'),
}];

export default navConfig;
