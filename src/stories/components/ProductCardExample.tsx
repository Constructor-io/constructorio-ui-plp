import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import React from 'react';
import ProductCard from '../../components/ProductCard';
import { DEMO_API_KEY } from '../../constants';
import { PlpContextProvider } from '../../PlpContext';
import { Item } from '../../types';

/**
 * This interface will be rendered as a table in Storybook
 * Attribute-level comments will be rendered as part of the "description" column
 * Attribute-types determine the type of control: boolean = toggle, string = text input, enum = select
 */
interface ProductCardExampleProps {
  /**
   * Constructor's Client. Required if not nesting component within `PlpContextProvider`.
   */
  cioClient?: ConstructorIO;
  /**
   * Constructor's Transformed API Item Object.
   */
  item: Item;
  /**
   * Function to format the price. Defaults to "$0.00".
   * Can also be set globally at the PlpContext level.
   */
  formatPrice?: (price: number) => string;
  /**
   * Function to retrieve the price. Defaults to `item.data.price`.
   * Can also be set globally at the PlpContext level.
   */
  getPrice?: (item: Item) => number;
  /**
   * Callback to run on add-to-cart event.
   * Can also be set globally at the PlpContext level.
   */
  onAddToCart?: (event: React.MouseEvent, item: Item) => void;
  /**
   * Callback to run on Product Card Click.
   * Can also be set globally at the PlpContext level.
   */
  onClick?: (event: React.MouseEvent, item: Item) => void;
}

/**
 * A Product Card UI Component
 */
export default function ProductCardExample({ ...props }: ProductCardExampleProps) {
  return (
    <PlpContextProvider apiKey={DEMO_API_KEY}>
      <ProductCard {...props} />
    </PlpContextProvider>
  );
}
