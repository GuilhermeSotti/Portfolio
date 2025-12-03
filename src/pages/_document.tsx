import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

class MyDocument extends Document {
  render() {
    // script que roda *antes* da React hydratar e define data-theme
    const setThemeScript = `
(function () {
  try {
    var theme = (function(){
      var m = document.cookie.match('(^|;)\\s*theme\\s*=\\s*([^;]+)');
      if (m) return decodeURIComponent(m[2]);
      // fallback to prefers-color-scheme
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
    })();
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) { /* ignore */ }
})();
`;
    return (
      <Html>
        <Head />
        <body>
          <script dangerouslySetInnerHTML={{ __html: setThemeScript }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
