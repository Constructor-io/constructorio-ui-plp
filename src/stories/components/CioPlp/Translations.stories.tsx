import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPlp from '../../../components/CioPlp';
import CioPlpGrid from '../../../components/CioPlpGrid';
import { DEMO_API_KEY } from '../../../constants';
import { Translations } from '../../../types';
import '../../../styles.css';

const meta = {
  title: 'Components/CioPlp/Translations',
  component: CioPlp,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    apiKey: {
      description: 'The index API key',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    translations: {
      description: 'Object containing UI string translations for internationalization',
      table: {
        type: {
          summary: 'Translations',
        },
      },
    },
  },
} satisfies Meta<typeof CioPlp>;

export default meta;
type Story = StoryObj<typeof meta>;

function TranslationsStory({ defaultUrl }: any) {
  const [currentUrl, setCurrentUrl] = useState(defaultUrl);
  const [gridKey, setGridKey] = useState(1);

  useEffect(() => {
    setGridKey(gridKey + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrl]);

  const spanishTranslations: Translations = {
    results: 'resultados',
    for: 'para',
    Filters: 'Filtros',
    'Sort by:': 'Ordenar por:',
    By: 'Por',
    Sort: 'Ordenar',
    Categories: 'Categorias',
    'Show All': 'Mostrar todo',
    'Show Less': 'Mostrar menos',
    "Sorry, we didn't find:": 'Lo sentimos, no encontramos:',
    'Sorry, we were unable to find what you were looking for.':
      'Lo sentimos, no pudimos encontrar lo que buscabas.',
    'Check for typos': 'Revisa errores tipograficos',
    'Use fewer keywords': 'Usa menos palabras clave',
    'Broaden your search terms': 'Amplia tus terminos de busqueda',
  };

  return (
    <CioPlp
      apiKey={DEMO_API_KEY}
      translations={spanishTranslations}
      urlHelpers={{
        setUrl: (url) => {
          setCurrentUrl(url);
        },
        getUrl: () => currentUrl,
      }}>
      <CioPlpGrid key={gridKey} />
    </CioPlp>
  );
}

export const Spanish: Story = {
  render: () => <TranslationsStory defaultUrl={`${window.location.href}&q=shirt`} />,
};
