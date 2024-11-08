import { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material';
import { DataGrid, arSD } from '@mui/x-data-grid';
// import { bgBG as pickersBgBG } from '@mui/x-date-pickers/locales';
import { bgBG as coreBgBG } from '@mui/material/locale';

export const tokens = (mode) => ({
  ...(mode === 'dark'
    ? {
        grey: {
          100: '#e0e0e0',
          200: '#c2c2c2',
          300: '#a3a3a3',
          400: '#858585',
          500: '#666666',
          600: '#525252',
          700: '#3d3d3d',
          800: '#292929',
          900: '#141414',
        },
        primary: {
          100: '#d0d1d5',
          200: '#a1a4ab',
          300: '#727681',
          400: '#1f2a40',
          500: '#141b2d',
          600: '#101624',
          700: '#0c101b',
          800: '#080b12',
          900: '#040509',
        },
        greenAccent: {
          100: '#dbf5ee',
          200: '#b7ebde',
          300: '#94e2cd',
          400: '#70d8bd',
          500: '#4cceac',
          600: '#3da58a',
          700: '#2e7c67',
          800: '#1e5245',
          900: '#0f2922',
        },
        redAccent: {
          100: '#f8dcdb',
          200: '#f1b9b7',
          300: '#e99592',
          400: '#e2726e',
          500: '#db4f4a',
          600: '#af3f3b',
          700: '#832f2c',
          800: '#58201e',
          900: '#2c100f',
        },
        blueAccent: {
          100: '#e1e2fe',
          200: '#c3c6fd',
          300: '#a4a9fc',
          400: '#868dfb',
          500: '#6870fa',
          600: '#535ac8',
          700: '#3e4396',
          800: '#2a2d64',
          900: '#151632',
        },
      }
    : {
        grey: {
          100: '#141414',
          200: '#292929',
          300: '#3d3d3d',
          400: '#525252',
          500: '#666666',
          600: '#858585',
          700: '#a3a3a3',
          800: '#c2c2c2',
          900: '#e0e0e0',
        },
        primary: {
          100: '#040509',
          200: '#080b12',
          300: '#0c101b',
          400: '#f2f0f0',
          500: '#e0e0e0',
          600: '#434957',
          700: '#727681',
          800: '#a1a4ab',
          900: '#d0d1d5',
        },
        greenAccent: {
          100: '#0f2922',
          200: '#1e5245',
          300: '#2e7c67',
          400: '#3da58a',
          500: '#4cceac',
          600: '#70d8bd',
          700: '#94e2cd',
          800: '#b7ebde',
          900: '#dbf5ee',
        },
        redAccent: {
          100: '#2c100f',
          200: '#58201e',
          300: '#832f2c',
          400: '#af3f3b',
          500: '#db4f4a',
          600: '#e2726e',
          700: '#e99592',
          800: '#f1b9b7',
          900: '#f8dcdb',
        },
        blueAccent: {
          900: '#151632',
          800: '#2a2d64',
          700: '#3e4396',
          600: '#535ac8',
          500: '#6870fa',
          400: '#868dfb',
          300: '#a4a9fc',
          200: '#c3c6fd',
          100: '#e1e2fe',
        },
      }),
});

// mui theme settings

export const themeSettings = (mode, direction) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },

            background: {
              default: colors.primary[500],
              paper: colors.primary[500],
            },
            white: {
              main: '#fff',
            },
            red: {
              main: colors.redAccent[500],
            },
            text: {
              primary: '#fff',
              secondary: colors.grey[100],
            },
          }
        : {
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            white: {
              main: '#fff',
            },
            red: {
              main: colors.redAccent[500],
            },
            background: {
              default: '#fcfcfc',
            },
            text: {
              primary: '#343536',
              secondary: colors.grey[100],
            },
          }),
    },
    typography: {
      fontFamily: ['Tajawal', 'sans-serif'].join(','),
      fontSize: 12,
      h1: {
        fontFamily: ['Tajawal', 'sans-serif'].join(','),
        fontSize: 40,
      },
      h2: {
        fontFamily: ['Tajawal', 'sans-serif'].join(','),
        fontSize: 32,
      },
      h3: {
        fontFamily: ['Tajawal', 'sans-serif'].join(','),
        fontSize: 24,
      },
      h4: {
        fontFamily: ['Tajawal', 'sans-serif'].join(','),
        fontSize: 20,
      },
      h5: {
        fontFamily: ['Tajawal', 'sans-serif'].join(','),
        fontSize: 13,
      },
      h6: {
        fontFamily: ['Tajawal', 'sans-serif'].join(','),
        fontSize: 10,
      },
    },
    direction: direction,
  };
};

// context for color mode

export const AppSettingsContext = createContext({
  toggleColorMode: () => {},
  toggleDirection: () => {},
  setLocale: () => {},
  locale: null,
  direction: null,
  colorMode: null,
});

export const useAppSettings = () => {
  const colorModeValueLocalStorage = window.localStorage.getItem('colorMode');
  const directionValueLocalStorage = window.localStorage.getItem('direction');
  const localeValueLocalStorage = window.localStorage.getItem('locale');

  const [colorMode, setColorMode] = useState(
    colorModeValueLocalStorage === 'light' ? 'light' : 'dark'
  );
  const [direction, setDirection] = useState(
    directionValueLocalStorage === 'rtl' ? 'rtl' : 'ltr'
  );
  const [locale, setLocale] = useState(
    localeValueLocalStorage ? localeValueLocalStorage : 'en'
  );

  document.dir = direction;
  const appSettings = useMemo(
    () => ({
      toggleColorMode: () =>
        setColorMode((prev) => {
          setLocalStorage('colorMode', prev === 'dark' ? 'light' : 'dark');
          return prev === 'dark' ? 'light' : 'dark';
        }),
      toggleDirection: () =>
        setDirection((prev) => {
          setLocalStorage('direction', prev === 'rtl' ? 'ltr' : 'rtl');
          return prev === 'rtl' ? 'ltr' : 'rtl';
        }),
      setLocale: (locale) =>
        setLocale(() => {
          setLocalStorage('locale', locale);
          return locale;
        }),
      locale: locale,
      direction: direction,
      colorMode: colorMode,
    }),
    [colorMode, direction, locale]
  );

  const theme = useMemo(
    () => createTheme(themeSettings(colorMode, direction), arSD, coreBgBG),
    [colorMode, direction, locale]
  );
  return { theme, appSettings, locale, direction, colorMode };
};

function setLocalStorage(key, value) {
  window.localStorage.setItem(key, value);
}
