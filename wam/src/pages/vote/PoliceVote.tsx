import { VStack } from '@channel.io/bezier-react'
import * as Styled from './Vote.styled'
import Vote from './components/Vote'
import { CancelIcon } from '@channel.io/bezier-icons'
import { useEffect } from 'react'
import { setSize } from '../../utils/wam'

const PoliceVote = () => {
  useEffect(() => {
    setSize(448, 320)
  }, [])

  return (
    <VStack
      spacing={40}
      align="center"
    >
      <Styled.CancelIconWrapper>
        <CancelIcon />
      </Styled.CancelIconWrapper>
      <Styled.TitleText>
        누가 <Styled.Text color="blue">마피아 </Styled.Text>일까요?
      </Styled.TitleText>
      <Vote color="blue" />
    </VStack>
  )
}

export default PoliceVote
