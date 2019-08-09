import Application from './Application.jsx';
import {BrowserRouter} from 'react-router-dom';
import React from 'react';
import { hydrate } from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';

function Main() {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Application />
    </ThemeProvider>
  );
}

hydrate(
  <BrowserRouter>
    <Main />
  </BrowserRouter>,
  document.getElementById('container')
);

if (module.hot) {
  module.hot.accept();
}
