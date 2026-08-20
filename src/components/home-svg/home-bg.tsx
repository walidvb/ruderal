/**
 * Plain noise background behind the animated artwork. Always covers the full
 * viewport, independent of the artwork's own size/position.
 */
export function HomeBg() {
  return (
    <svg
      className="fixed inset-0 h-screen w-screen"
      viewBox="0 0 1280 832"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="1280" height="832" fill="#F5F5F5" filter="url(#home-bg-noise)" />
      <defs>
        <filter
          id="home-bg-noise"
          x="0"
          y="0"
          width="1280"
          height="832"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.5 0.5"
            stitchTiles="stitch"
            numOctaves="3"
            result="noise"
            seed="5380"
          />
          <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA
              type="discrete"
              tableValues="0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
            />
          </feComponentTransfer>
          <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
          <feComponentTransfer in="alphaNoise" result="coloredNoise2">
            <feFuncA
              type="discrete"
              tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 "
            />
          </feComponentTransfer>
          <feComposite operator="in" in2="shape" in="coloredNoise2" result="noise2Clipped" />
          <feFlood floodColor="#F3FECC" result="color1Flood" />
          <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
          <feFlood floodColor="#EEEEEE" result="color2Flood" />
          <feComposite operator="in" in2="noise2Clipped" in="color2Flood" result="color2" />
          <feMerge result="effect1_noise_0_1">
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
            <feMergeNode in="color2" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
