import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="icon icon-tabler icons-tabler-outline icon-tabler-brand-meta"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M12 10.174C13.766 7.39 15.315 6 16.648 6c2 0 3.263 2.213 4 5.217.704 2.869.5 6.783-2 6.783-1.114 0-2.648-1.565-4.148-3.652a27.627 27.627 0 0 1-2.5-4.174zM12 10.174C10.234 7.39 8.685 6 7.352 6c-2 0-3.263 2.213-4 5.217-.704 2.869-.5 6.783 2 6.783C6.466 18 8 16.435 9.5 14.348c1-1.391 1.833-2.783 2.5-4.174z" />
  </svg>
)
export default SvgComponent
