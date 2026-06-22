import { cn } from '#/lib/cn'

import { HomeSVG as HomeSVGDesktop } from './Desktop'
import { HomeSVGMobile } from './Mobile'

const ResponsiveHomeSVG = (props) => {
  return (
    <>
      <HomeSVGMobile
        {...props}
        className={cn(
          'absolute top-0 left-0 w-full h-auto md:hidden',
          props.className,
        )}
      />
      <HomeSVGDesktop
        {...props}
        className={cn(
          'absolute top-0 left-1/2 hidden h-full w-auto -translate-x-1/2 md:block',
          props.className,
        )}
      />
    </>
  )
}

export default ResponsiveHomeSVG
