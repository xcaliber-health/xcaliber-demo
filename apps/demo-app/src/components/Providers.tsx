// Type Imports
import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'
import { PluginManagerProvider } from './PluginManagerProvider'

// Util Imports
import { getDemoName, getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const demoName = getDemoName()
  const systemMode = getSystemMode()

  return (
    <PluginManagerProvider>
      <VerticalNavProvider>
        <SettingsProvider settingsCookie={settingsCookie} mode={mode} demoName={demoName}>
          <ThemeProvider direction={direction} systemMode={systemMode}>
            {children}
          </ThemeProvider>
        </SettingsProvider>
      </VerticalNavProvider>
    </PluginManagerProvider>
  )
}

export default Providers
