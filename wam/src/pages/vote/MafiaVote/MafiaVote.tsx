import { CancelIcon } from '@channel.io/bezier-icons'
import { VStack } from '@channel.io/bezier-react'
import * as Styled from '../Vote.styled'
import Vote from '../components/Vote'

const MafiaVote = () => {
  return (
    <VStack
      spacing={40}
      align="center"
    >
      <Styled.CancelIconWrapper>
        <CancelIcon />
      </Styled.CancelIconWrapper>
      <Styled.TitleText>
        누가 <Styled.MafiaText>마피아 </Styled.MafiaText>일까요?
      </Styled.TitleText>
      <Vote color="red" />
      <Styled.VoteButton color="red">확인</Styled.VoteButton>
    </VStack>
  )
}

export default MafiaVote
