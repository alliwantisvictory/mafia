import { useMemo } from 'react'
import { AppProvider } from '@channel.io/bezier-react'

import { isMobile } from './utils/userAgent'
import { getWamData } from './utils/wam'
import Send from './pages/Send'
import DeathVote from './pages/vote/DeathVote'
import CivilianVote from './pages/vote/CivilianVote'
import MafiaVote from './pages/vote/MafiaVote'
import DoctorVote from './pages/vote/DoctorVote'
import PoliceVote from './pages/vote/PoliceVote'
import Role from './pages/Role/Role'

function App() {
  const wamName = useMemo(() => getWamData('wamName'), [])
  const renderWam = () => {
    switch (wamName) {
      case 'wam_name':
        return <Send />
      case 'DEATH_VOTE':
        return <DeathVote />
      case 'CIVILIAN_VOTE':
        return <CivilianVote />
      case 'MAFIA_VOTE':
        return <MafiaVote />
      case 'DOCTOR_VOTE':
        return <DoctorVote />
      case 'POLICE_VOTE':
        return <PoliceVote />
      case 'ROLE':
        return <Role />
    }
  }

  return (
    <AppProvider>
      <div style={{ padding: isMobile() ? '16px' : '0 24px 24px 24px' }}>
        {renderWam()}
      </div>
    </AppProvider>
  )
}

export default App
