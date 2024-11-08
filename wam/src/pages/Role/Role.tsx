import { useEffect, useMemo } from 'react'

import { getWamData, setSize } from '../../utils/wam'

import mafia from '../../assets/images/mafia.png'
import police from '../../assets/images/police.png'
import doctor from '../../assets/images/doctor.png'
import citizen from '../../assets/images/citizen.png'

import * as Styled from './Role.styled'

function Role() {
  useEffect(() => {
    setSize(400, 436)
  }, [])

  const role = useMemo(() => getWamData('role') ?? '', [])

  let roleName = ''
  let RoleHeading = Styled.secondaryHeading
  let RoleButton = Styled.secondaryButton
  let roleImageSrc = ''

  switch (role) {
    case 'MAFIA':
      roleName = '마피아'
      RoleHeading = Styled.primaryHeading
      RoleButton = Styled.primaryButton
      roleImageSrc = mafia
      break
    case 'DOCTOR':
      roleName = '의사'
      roleImageSrc = doctor
      break
    case 'POLICE':
      roleName = '경찰'
      roleImageSrc = police
      break
    case 'CITIZEN':
      roleName = '시민'
      roleImageSrc = citizen
      break
    default:
      roleName = '직업이 아직 부여되지 않았습니다.'
      break
  }

  return (
    <Styled.Wrapper>
      <Styled.subtitle>
        당신은 <RoleHeading>{roleName}</RoleHeading> 입니다
      </Styled.subtitle>
      <Styled.roleImage>
        <img
          src={roleImageSrc}
          alt={roleName}
        />
      </Styled.roleImage>
      <RoleButton onClick={() => window.ChannelIOWam.close()}>확인</RoleButton>
    </Styled.Wrapper>
  )
}

export default Role
