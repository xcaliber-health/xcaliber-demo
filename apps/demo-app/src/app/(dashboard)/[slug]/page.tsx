'use client'

import { useParams } from 'next/navigation'

import { SessionProvider } from 'next-auth/react'

// import DeIdentification from '../../../views/de-identification'
import DeIdentification from '@xcaliber/privacy-preservation/DeIdentificationComponent'
import ProviderDirectory from '../../../views/provider-directory'
import ComingSoon from '../../../views/ComingSoon'
import PluginManager from '../../../views/plugin-manager/page'
import { PluginProvider } from '../../../lib/plugin-context'
import { pluginManager } from '../../../lib/plugin-manager'
import { registerPlugins } from '../../../lib/register-plugins'

// Initialize plugins on first load
registerPlugins().catch(console.error)

type BuiltInRoutes = {
  'de-identification': () => JSX.Element
  'provider-directory': () => JSX.Element
  'plugin-manager': () => JSX.Element
}

export default function Page() {
  const params = useParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug

  // Get all plugin routes
  const pluginRoutes = pluginManager.getRoutes()
  
  // Find matching plugin route
  const matchingRoute = pluginRoutes.find(route => {
    return slug === route.path.slice(1);
  });

  // If we found a matching plugin route and the plugin is enabled
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

  // Handle built-in routes
  const builtInRoutes: BuiltInRoutes = {
    'de-identification': () => <DeIdentification />,
    'provider-directory': () => (
      <SessionProvider refetchOnWindowFocus={false}>
        <ProviderDirectory />
      </SessionProvider>
    ),
    'plugin-manager': () => <PluginManager />
  }

  // Wrap all components with PluginProvider to ensure plugin context is available
  return (
    <PluginProvider pluginManager={pluginManager}>
      {(slug && slug in builtInRoutes) ? (
        builtInRoutes[slug as keyof BuiltInRoutes]()
      ) : (
        <ComingSoon />
      )}
    </PluginProvider>
  )
}
