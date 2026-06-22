import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPlp from '../../../components/CioPlp';
import CioPlpGrid from '../../../components/CioPlpGrid';
import { DEMO_API_KEY, translationsDescription } from '../../../constants';
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
      description: translationsDescription,
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

function TranslationsStory({ defaultUrl }: { defaultUrl: string }) {
  const [currentUrl, setCurrentUrl] = useState(defaultUrl);
  const [gridKey, setGridKey] = useState(1);

  useEffect(() => {
    setGridKey((prev) => prev + 1);
  }, [currentUrl]);

  const spanishTranslations: Translations = {
    results: 'resultados',
    for: 'para',
    Filters: 'Filtros',
    'Sort by:': 'Ordenar por:',
    By: 'Por',
    Sort: 'Ordenar',
    from: 'desde',
    to: 'hasta',
    Categories: 'Categorias',
    'Show All': 'Mostrar todo',
    'Show Less': 'Mostrar menos',
    'Add to Cart': 'Agregar al carrito',
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
