import { VStack } from '@channel.io/bezier-react'
import * as Styled from './Vote.styled'
import Vote from './components/Vote'
import { CancelIcon } from '@channel.io/bezier-icons'
import { useEffect } from 'react'
import { setSize } from '../../utils/wam'

const DoctorVote = () => {
  useEffect(() => {
    setSize(448, 472)
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
        누구를 <Styled.Text color="blue">치료 </Styled.Text>할까요?
      </Styled.TitleText>
      <Vote color="blue" />
      <Styled.VoteButton color="blue">확인</Styled.VoteButton>
    </VStack>
  )
}

export default DoctorVote
