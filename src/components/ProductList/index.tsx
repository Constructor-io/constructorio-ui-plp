import React from 'react';
import { Item } from '../../types';
import ProductCard from '../ProductCard';
import './ProductList.css';

/**
 * Props for the ProductList component.
 */
interface ProductListProps {
  // Items
  items?: Array<Item>;
}

/**
 * Renders the product list items
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} [props.searchResults] - The initial search query.
 * @returns {JSX.Element} The rendered search results.
 * @throws {Error} Throws an error if the component is not rendered within CioPlpContext.
 */
export default function ProductList(props: ProductListProps) {
  const { items } = props;
  return (
    <>
      {items?.length ? (
        <div className='cio-results'>
          {items.map((item) => (
            <ProductCard item={item} />
          ))}
        </div>
      ) : (
        "Can't find matching items. Please try something else"
      )}
    </>
  );
}
