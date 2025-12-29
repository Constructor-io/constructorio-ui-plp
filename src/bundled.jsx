/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ReactDOM from 'react-dom/client';
import CioPlpComponent from './components/CioPlp';
import { shopifyDefaults } from './utils/shopifyDefaults';
import './styles.css';

const CioPlp = ({ selector, includeCSS = true, useShopifyDefaults, ...rest }) => {
  if (document) {
    const stylesheet = document.getElementById('cio-plp-styles');
    const containerSelector =
      selector || (useShopifyDefaults ? shopifyDefaults.selector : undefined);
    const containerElement = containerSelector ? document.querySelector(containerSelector) : null;

    if (!containerElement) {
      // eslint-disable-next-line no-console
      console.error(`CioPlp: There were no elements found for the provided selector`);

      return;
    }

    if (stylesheet) {
      if (!includeCSS) {
        stylesheet.disabled = true;
      } else {
        stylesheet.disabled = false;
      }
    }

    ReactDOM.createRoot(containerElement).render(
      <React.StrictMode>
        <CioPlpComponent {...rest} useShopifyDefaults={useShopifyDefaults} />
      </React.StrictMode>,
    );
  }
};

if (window) {
  window.CioPlp = CioPlp;
}

export default CioPlp;
