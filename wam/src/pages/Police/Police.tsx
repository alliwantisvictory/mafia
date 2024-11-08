import { useEffect, useMemo } from 'react'

import { getWamData, setSize } from '../../utils/wam'

import mafia from '../../assets/images/mafia.png'
import citizen from '../../assets/images/citizen.png'

import * as Styled from './Police.styled'

function Police() {
  useEffect(() => {
    setSize(400, 436)
  }, [])

  const isMafia = useMemo(() => getWamData('isMafia') ?? '', [])
  const player = useMemo(() => getWamData('player') ?? '플레이어', [])

  let RoleHeading = Styled.secondaryHeading
  let RoleButton = Styled.secondaryButton
  let isMafiaText = '아닙'
  let roleImageSrc = ''

  switch (isMafia) {
    case 'True':
      RoleHeading = Styled.primaryHeading
      RoleButton = Styled.primaryButton
      roleImageSrc = mafia
      isMafiaText = '맞습'
      break
    case 'False':
      roleImageSrc = citizen
      break
    default:
      break
  }

  return (
    <Styled.Wrapper>
      <Styled.subtitle>
        {player}는(은) <RoleHeading>마피아</RoleHeading>가 {isMafiaText}입니다
      </Styled.subtitle>
      <Styled.roleImage>
        <img src={roleImageSrc} />
      </Styled.roleImage>
      <RoleButton onClick={() => window.ChannelIOWam.close()}>확인</RoleButton>
    </Styled.Wrapper>
  )
}

export default Police
