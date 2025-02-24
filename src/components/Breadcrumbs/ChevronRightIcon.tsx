import * as React from 'react';
import { SVGProps } from 'react';

function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={8}
      height={8}
      viewBox='0 0 8 8'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}>
      <path
        d='m3.033.85 2.993 2.993a.223.223 0 0 1 0 .315L3.034 7.15'
        stroke='#000'
        strokeOpacity={0.3}
        strokeWidth={1.2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default ChevronRightIcon;
