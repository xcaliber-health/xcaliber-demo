'use client'

import { useParams } from 'next/navigation'
import { PluginProvider } from '../../../../lib/plugin-context'
import { pluginManager } from '../../../../lib/plugin-manager'
import { registerPlugins } from '../../../../lib/register-plugins'
import ComingSoon from '@/views/ComingSoon'

// Initialize plugins on first load
registerPlugins().catch(console.error)

export default function Page() {
  const params = useParams()
  const id = params.id as string

  // Get all plugin routes
  const pluginRoutes = pluginManager.getRoutes()

  // Find the patient chart details route
  const matchingRoute = pluginRoutes.find(route => route.path === '/patient-chart/[id]')

  // If we found the matching route and the plugin is enabled
  if (matchingRoute && pluginManager.getPluginForRoute(matchingRoute.path)) {
    const Component = matchingRoute.component

    return (
      <PluginProvider pluginManager={pluginManager}>
        <div className='m-4'>
          <Component />
        </div>
      </PluginProvider>
    )
  }

  return <ComingSoon />
}
