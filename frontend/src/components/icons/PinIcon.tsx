import { SVGProps } from 'react';

export const PinIcon = ({
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
        d="M12,23.999l-.704-.595C9.094,21.541,1.909,15.076,1.909,10.091,1.909,4.527,6.436,0,12,0s10.091,4.527,10.091,10.091c0,4.985-7.185,11.45-9.387,13.313l-.704,.595ZM12,1C6.987,1,2.909,5.078,2.909,10.091c0,4.672,7.524,11.273,9.032,12.55l.059,.05,.059-.05c1.508-1.276,9.032-7.878,9.032-12.55,0-5.013-4.078-9.091-9.091-9.091Z"
      />
      <path
        fill="currentColor"
        d="M12,14c-2.206,0-4-1.794-4-4s1.794-4,4-4,4,1.794,4,4-1.794,4-4,4Zm0-7c-1.654,0-3,1.346-3,3s1.346,3,3,3,3-1.346,3-3-1.346-3-3-3Z"
      />
    </svg>
  );
};
