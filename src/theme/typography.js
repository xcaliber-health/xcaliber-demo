// ----------------------------------------------------------------------

export function remToPx(value) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ sm, md, lg }) {
  return {
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

export const primaryFont = 'Space Grotesk';
export const secondaryFont = 'DM Sans';

// ----------------------------------------------------------------------

export const typography = {
  fontFamily: primaryFont,
  fontSecondaryFamily: secondaryFont,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 700,
    lineHeight: '100%',
    fontSize: pxToRem(72),
    ...responsiveFontSizes({ sm: 60, md: 68, lg: 72 }),
  },
  h2: {
    fontWeight: 700,
    lineHeight: '100%',
    fontSize: pxToRem(56),
    ...responsiveFontSizes({ sm: 48, md: 56, lg: 56 }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: '100%',
    fontSize: pxToRem(48),
    ...responsiveFontSizes({ sm: 40, md: 48, lg: 48 }),
  },
  h4: {
    fontWeight: 700,
    lineHeight: '100%',
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
  },
  h5: {
    fontWeight: 700,
    lineHeight: '100%',
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
  },
  h6: {
    fontWeight: 700,
    lineHeight: '100%',
    fontSize: pxToRem(17),
    ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
  },
  subtitle1: {
    fontFamily: secondaryFont,
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontFamily: secondaryFont,
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    fontFamily: secondaryFont,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: 'unset',
  },
};
