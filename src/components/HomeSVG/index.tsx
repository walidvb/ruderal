import { cn } from '#/lib/cn'

import { HomeSVG as HomeSVGDesktop } from './Desktop'
import { HomeSVGMobile } from './Mobile'

const ResponsiveHomeSVG = (props) => {
  return (
    <>
      <HomeSVGMobile {...props} className={cn(props.className, 'md:hidden')} />
      <HomeSVGDesktop
        {...props}
        className={cn(props.className, 'hidden md:block')}
      />
    </>
  )
}

export default ResponsiveHomeSVG
