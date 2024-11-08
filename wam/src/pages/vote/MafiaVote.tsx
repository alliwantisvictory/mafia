import { VStack } from '@channel.io/bezier-react'
import * as Styled from './Vote.styled'
import Vote from './components/Vote'
import { useEffect } from 'react'
import { setSize } from '../../utils/wam'

const MafiaVote = () => {
  useEffect(() => {
    setSize(448, 472)
  }, [])

  return (
    <VStack
      spacing={40}
      align="center"
    >
      <Styled.TitleText>누구를 죽일까요?</Styled.TitleText>
      <Vote color="red" />
      <Styled.VoteButton color="red">확인</Styled.VoteButton>
    </VStack>
  )
}

export default MafiaVote
