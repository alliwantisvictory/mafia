import { useEffect, useMemo, useState } from 'react'
import { AppProvider, type ThemeName } from '@channel.io/bezier-react'

import { isMobile } from './utils/userAgent'
import { getWamData } from './utils/wam'
import Send from './pages/Send'
import MafiaVote from './pages/MafiaVote/MafiaVote'

function App() {
  return <MafiaVote />
  const [theme, setTheme] = useState<ThemeName>('light')
  const wamName = useMemo(() => getWamData('wamName'), [])

  useEffect(() => {
    const appearance = getWamData('appearance')
    setTheme(appearance === 'dark' ? 'dark' : 'light')
  }, [])

  const renderWam = () => {
    switch (wamName) {
      case 'wam_name':
        return <Send />
      case 'mafia':
        return <MafiaVote />
    }
  }

  return (
    <AppProvider themeName={theme}>
      <div style={{ padding: isMobile() ? '16px' : '0 24px 24px 24px' }}>
        {/* {renderWam()} */}
      </div>
    </AppProvider>
  )
}

export default App
