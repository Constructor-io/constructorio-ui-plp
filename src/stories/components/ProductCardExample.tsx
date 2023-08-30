import React from 'react';
import ProductCard from '../../components/ProductCard';
import { DEMO_API_KEY } from '../../constants';
import { PlpContextProvider } from '../../PlpContext';
import './button.css';

/**
 * This interface will be rendered as a table in Storybook
 * Attribute-level comments will be rendered as part of the "description" column
 * Attribute-types determine the type of control: boolean = toggle, string = text input, enum = select
 */
interface ProductCardExampleProps {
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * Button contents
   */
  label: string;
}

// Note Description here will be parsed into the story description
/**
 * A Product Card UI Component
 */
export default function ProductCardExample({
  backgroundColor,
  label,
  ...props
}: ProductCardExampleProps) {
  return (
    <PlpContextProvider apiKey={DEMO_API_KEY}>
      <ProductCard {...props} />
    </PlpContextProvider>
  );
}
