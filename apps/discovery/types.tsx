import { RenderHTMLProps } from '@native-html/render';

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export interface SnippetDeclaration {
  name: string;
  codeSource: string;
  supportsLegacy: boolean;
  props?: RenderHTMLProps;
}
