import { Theme as NavTheme } from '@react-navigation/native';
import { MD2Theme } from 'react-native-paper';
import colorPrimitivesDeclarations from './colorPrimitivesDeclaration';
import { ColorPrimitivesDeclaration } from './colorSystem';

export type ColorsShape = MD2Theme['colors'] & NavTheme['colors'];

function deriveThemeFromDeclaration({
  accent,
  card,
  primary,
  surface,
  scrim
}: ColorPrimitivesDeclaration): ColorsShape {
  const FIXME = '#594A13';
  return {
    border: FIXME,
    disabled: FIXME,
    error: FIXME,
    notification: FIXME,
    surface: FIXME,
    onSurface: FIXME,
    placeholder: FIXME,
    tooltip: FIXME,
    accent: accent.color,
    backdrop: scrim,
    background: surface.color,
    card: card.color,
    primary: primary.color,
    text: surface.content
  };
}

const themeAdaptedColors: Record<'light' | 'dark', ColorsShape> = {
  light: deriveThemeFromDeclaration(colorPrimitivesDeclarations.light),
  dark: deriveThemeFromDeclaration(colorPrimitivesDeclarations.dark)
};

export default themeAdaptedColors;
