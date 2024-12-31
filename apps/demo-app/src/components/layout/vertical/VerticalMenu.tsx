'use client'

// MUI Imports
import { useEffect, useMemo, useState } from 'react'

import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import { Box, Typography } from '@mui/material'

import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'
import { usePluginManager } from '@/lib/plugin-context'

// Plugin Manager Import
import type { PluginRoute } from '@/types/plugin'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

// const menuData = [
//   {
//     title: 'Privacy Preservation',
//     icon: 'ri-add-box-fill',
//     href: '/de-identification'
//   },
//   {
//     title: 'Provider Directory',
//     icon: 'ri-home-smile-line',
//     href: '/provider-directory'
//   }
// ]

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()
  const pluginManager = usePluginManager()
  const [pluginRoutes, setPluginRoutes] = useState<PluginRoute[]>([])
  const [expandedPlugins, setExpandedPlugins] = useState<Set<string>>(new Set())

  // Get plugin routes and update when plugins change
  useEffect(() => {
    // Initial load
    setPluginRoutes(pluginManager.getRoutes())

    // Subscribe to route updates
    const unsubscribe = pluginManager.onPluginEvent('routes:update', ({ routes }: { routes: PluginRoute[] }) => {
      setPluginRoutes(routes)
    })

    return () => {
      unsubscribe()
    }
  }, [pluginManager])

  // Group plugin routes by their plugin name
  const groupedPluginRoutes = useMemo(() => {
    return pluginRoutes.reduce<Record<string, PluginRoute[]>>((acc, route) => {
      const plugin = pluginManager.getPluginForRoute(route.path);
      if (!plugin) return acc;

      if (!acc[plugin.name]) {
        acc[plugin.name] = [];
      }
      acc[plugin.name].push(route);
      return acc;
    }, {});
  }, [pluginRoutes, pluginManager]);

  // Toggle plugin expansion
  const togglePluginExpansion = (pluginName: string) => {
    setExpandedPlugins(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pluginName)) {
        newSet.delete(pluginName);
      } else {
        newSet.add(pluginName);
      }
      return newSet;
    });
  };

  // Vars
  const { transitionDuration } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: (container: any) => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container: any) => scrollMenu(container, true)
          })}
    >
      <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between'
        }}>
        <Menu
          popoutMenuOffset={{ mainAxis: 10 }}
          menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
          menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
        >
          {/* Core Menu Items */}
          {/* {menuData.map((item, index) => (
            <MenuItem 
              key={index} 
              href={item.href}
              icon={<i className={item.icon} />}
            >
              {item.title}
            </MenuItem>
          ))} */}

          {/* Plugin Menu Items */}
          {Object.entries(groupedPluginRoutes).map(([pluginName, routes]) => {
            const mainRoute = routes.find(r => r.path === `/${pluginName}`) || routes[0];
            const subRoutes = routes.filter(r => r.path !== `/${pluginName}`);
            const isExpanded = expandedPlugins.has(pluginName);

            return (
              <div key={pluginName}>
                <MenuItem
                  className="plugin-menu-item"
                  href={`/${pluginName}`}
                  icon={mainRoute.icon ? <mainRoute.icon /> : <i className='ri-puzzle-2-line' />}
                  onClick={(e: React.MouseEvent) => {
                    if (e.target instanceof HTMLElement && e.target.closest('.expand-icon')) {
                      e.preventDefault();
                      togglePluginExpansion(pluginName);
                    }
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{mainRoute.label || pluginName}</span>
                    <i 
                      className={`expand-icon ri-arrow-${isExpanded ? 'down' : 'right'}-s-line transition-transform duration-200 text-xl`}
                      style={{ marginLeft: 'auto', marginRight: '8px' }}
                    />
                  </div>
                </MenuItem>
                
                {isExpanded && subRoutes.map((route, index) => (
                  <MenuItem
                    key={`${pluginName}-${index}`}
                    href={route.path.slice(1)}
                    icon={route.icon ? <route.icon /> : <i className='ri-circle-line' />}
                    className="pl-4"
                  >
                    {route.label}
                  </MenuItem>
                ))}
              </div>
            );
          })}
        </Menu>

        {/* Settings Menu */}
        <Menu
          popoutMenuOffset={{ mainAxis: 10 }}
          menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
          menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
        >
          <MenuItem
            href='/plugin-manager'
            icon={<i className='ri-settings-5-line' />}
          >
            Plugin Manager
          </MenuItem>
        </Menu>
      </div>
    </ScrollWrapper>
  )
}

export default VerticalMenu
