import { SVGProps } from 'react';

export const BinIcon = ({
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
        d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm3-16.5c0-.827-.673-1.5-1.5-1.5h-3c-.827,0-1.5.673-1.5,1.5v1.5h-3v1h1v7.5c0,1.378,1.121,2.5,2.5,2.5h5c1.379,0,2.5-1.122,2.5-2.5v-7.5h1v-1h-3v-1.5Zm-5,0c0-.276.225-.5.5-.5h3c.275,0,.5.224.5.5v1.5h-4v-1.5Zm6,10c0,.827-.673,1.5-1.5,1.5h-5c-.827,0-1.5-.673-1.5-1.5v-7.5h8v7.5Z"
      />
    </svg>
  );
};
