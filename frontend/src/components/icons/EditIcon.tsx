import { SVGProps } from 'react';

export const EditIcon = ({
  width = 24,
  height = 24,
  className,
}: SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
}) => {
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
        d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm2.244-17.184L6,14.061v3.939h3.939l8.244-8.244c.526-.526.816-1.226.816-1.97s-.29-1.443-.816-1.97c-1.053-1.053-2.887-1.053-3.939,0Zm-4.719,11.184h-2.525v-2.525l5.598-5.598,2.525,2.525-5.598,5.598Zm7.951-7.951l-1.646,1.646-2.525-2.525,1.646-1.646c.676-.676,1.85-.676,2.525,0,.338.338.523.786.523,1.263s-.186.925-.523,1.263Z"
      />
    </svg>
  );
};
