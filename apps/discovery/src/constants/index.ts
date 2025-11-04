import Constants from 'expo-constants';
import { filter, pipe, uniq } from 'ramda';

const normalizeFonts = pipe<string[][], string[], string[]>(
  uniq,
  filter<string>(
    (c) =>
      !c.match(
        /bold|italic|semi|regular|extra|ultra|light|black|medium|thin|-/i
      )
  )
);

const SYSTEM_FONTS = normalizeFonts([...Constants.systemFonts, 'space-mono']);
const BODY_CHAPTER_SPACING = 16;
const BODY_VERTICAL_SPACING = 12;
const BODY_HZ_SPACING = 2;
const BODY_PARAGRAPH_SPACING = 8;
const HEADER_COLL_HEIGHT = 54;
export {
  SYSTEM_FONTS,
  BODY_CHAPTER_SPACING,
  BODY_PARAGRAPH_SPACING,
  BODY_HZ_SPACING,
  BODY_VERTICAL_SPACING,
  HEADER_COLL_HEIGHT
};
