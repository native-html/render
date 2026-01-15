import ProfileV5 from './profiles/ProfileV5';
import ProfileV6Source from './profiles/ProfileV6Source';

const profiles = [
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
    props: {
      ignoredDomTags: ['svg', 'button', 'input', 'form', 'img', 'ol', 'table']
    }
  }
];

export default profiles;
