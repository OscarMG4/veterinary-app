interface PawIconProps {
  className?: string
  size?: number
}

export function PawIcon({ className, size = 24 }: PawIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <ellipse cx="12" cy="17" rx="4.2" ry="3.5" />
      <circle cx="7" cy="11" r="2.2" />
      <circle cx="10.5" cy="8" r="2" />
      <circle cx="13.5" cy="8" r="2" />
      <circle cx="17" cy="11" r="2.2" />
    </svg>
  )
}
