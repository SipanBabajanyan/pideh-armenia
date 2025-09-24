'use client'

import MobileHeader from './MobileHeader'
import DesktopHeader from './DesktopHeader'

export default function Header() {
  return (
    <>
      {/* Mobile Header - показывается только на мобильных устройствах */}
      <div className="md:hidden">
        <MobileHeader />
      </div>
      
      {/* Desktop Header - показывается только на десктопе */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>
    </>
  )
}