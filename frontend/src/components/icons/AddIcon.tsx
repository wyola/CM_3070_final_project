import { SVGProps } from 'react';

export const AddIcon = ({
  width = 24,
  height = 24,
  className,
}: SVGProps<SVGSVGElement> & { width?: number; height?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      className={className}
    >
      <path
        fill="currentColor"
        d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm.5-11.5h4.5v1h-4.5v4.5h-1v-4.5h-4.5v-1h4.5v-4.5h1v4.5Z"
      />
    </svg>
  );
};
