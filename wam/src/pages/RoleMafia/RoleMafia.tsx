import { useEffect, useMemo } from 'react'

import { getWamData, setSize } from '../../utils/wam'

import mafia from '../../assets/images/mafia.png'

import * as Styled from './RoleMafia.styled'
import { VStack } from '@channel.io/bezier-react'

function RoleMafia() {
  useEffect(() => {
    setSize(400, 504)
  }, [])

  const name = useMemo(() => getWamData('name') ?? '', [])
  const imgUrl = useMemo(() => getWamData('imgUrl') ?? '', [])

  return (
    <Styled.Wrapper>
      <Styled.subtitle>
        당신은 <Styled.primaryHeading>마피아</Styled.primaryHeading> 입니다
      </Styled.subtitle>
      <Styled.roleImage>
        <img src={mafia} />
      </Styled.roleImage>
      <Styled.subtitle>당신의 동료는</Styled.subtitle>
      <VStack spacing={8}>
        <Styled.otherImage>
          <img src={imgUrl} />
        </Styled.otherImage>
        <Styled.subtitle>{name}</Styled.subtitle>
      </VStack>
      <Styled.primaryButton onClick={() => window.ChannelIOWam.close()}>
        확인
      </Styled.primaryButton>
    </Styled.Wrapper>
  )
}

export default RoleMafia
