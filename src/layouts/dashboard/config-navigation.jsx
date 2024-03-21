import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Patient 360',
    path: '/patient-360',
    icon: icon('ic_user'),
  },
  {
    title: 'provider',
    path: '/provider',
    icon: icon('ic_cart'),
  },
  {
    title: 'patient directory',
    path: '/patient-directory',
    icon: icon('ic_blog'),
  },
  {
    title: 'observability',
    path: '/observability',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
