import * as React from "react"
import { SVGProps } from "react"
const EyeClose = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        {...props}
    >
        <path stroke="none" d="M0 0h24v24H0z" />
        <path d="M21 9c-2.4 2.667-5.4 4-9 4-3.6 0-6.6-1.333-9-4M3 15l2.5-3.8M21 14.976 18.508 11.2M9 17l.5-4M15 17l-.5-4" />
    </svg>
)
export default EyeClose