// import ProfileSimple from './profiles/ProfileSimple';
import ProfileV5 from './profiles/ProfileV5';
import ProfileV6Source from './profiles/ProfileV6Source';

const profiles = [
  // Disabled because of htmlparser resolution
  // {
  //   name: 'Simple implementation',
  //   component: ProfileSimple
  // },
  {
    name: 'V5',
    component: ProfileV5,
    props: {
      ignoredTags: ['svg', 'button', 'input', 'form', 'img', 'ol', 'table']
    }
  },
  {
    name: 'V6',
    component: ProfileV6Source,
    props: {}
  }
];

export default profiles;
