'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'

// import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import Logo from '../shared/Logo'
import useVerticalNav from '@/@menu/hooks/useVerticalNav'

const NavbarContent = () => {

  const verticalNavOptions = useVerticalNav();

  const { isCollapsed, isHovered } = verticalNavOptions


  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* <ModeDropdown /> */}
        {(isCollapsed && !isHovered) && (<Logo />)}
      </div>
      <div className='flex items-center'>
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
