/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Scrollbars } from 'react-custom-scrollbars-2';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <Scrollbars >
      <Router />
      </Scrollbars>
    </ThemeProvider>
  );
}
