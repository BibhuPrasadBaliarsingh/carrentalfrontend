const sizeClasses = {
  sm: {
    image: 'h-9 w-9 rounded-lg',
    text: 'text-[0.6rem] sm:text-xl text-white',
  },
  md: {
    image: 'h-10 w-10 rounded-lg',
    text: 'text-[0.66rem] sm:text-sm lg:text-base text-white',
  },
  lg: {
    image: 'h-14 w-14 rounded-xl',
    text: 'text-[0.9rem] sm:text-base lg:text-lg text-white',
  },
}

export default function Logo({ className = '', size = 'md' }) {
  const sizeClass = sizeClasses[size] ?? sizeClasses.md

  return (
    <span
      className={`group/logo inline-flex items-center gap-2 transition duration-300 ease-out hover:scale-[1.02] motion-reduce:transform-none sm:whitespace-nowrap ${className}`}
      aria-label="Speed Toyz Cars"
    >
      <img
        src="/logo.jpeg"
        alt=""
        aria-hidden="true"
        className={`${sizeClass.image} shrink-0 object-cover transition-shadow duration-300 group-hover/logo:shadow-[0_0_14px_rgba(239,68,68,0.35)]`}
      />
      <span
        className={`font-logo ${sizeClass.text} uppercase leading-[1.1] tracking-[0.06em] transition-[filter] duration-300 group-hover/logo:drop-shadow-[0_0_7px_rgba(255,255,255,0.3)] sm:leading-none sm:tracking-[0.08em]`}
        style={{ whiteSpace: 'normal' }}
      >
        SPEED TOYZ CARS
      </span>
    </span>
  )
}
