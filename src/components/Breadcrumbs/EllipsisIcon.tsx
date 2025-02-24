import * as React from 'react';
import { SVGProps } from 'react';

function EllipsisIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={14}
      height={4}
      viewBox='0 0 14 4'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}>
      <circle cx={1.5} cy={2} r={1.5} fill='#000' fillOpacity={0.8} />
      <circle cx={7} cy={2} r={1.5} fill='#000' fillOpacity={0.8} />
      <circle cx={12.5} cy={2} r={1.5} fill='#000' fillOpacity={0.8} />
    </svg>
  );
}

export default EllipsisIcon;
