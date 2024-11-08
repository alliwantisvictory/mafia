import { VStack } from '@channel.io/bezier-react'
import * as Styled from './Vote.styled'
import { useEffect, useState } from 'react'
import { setSize } from '../../utils/wam'
import styled from 'styled-components'
import Yes from '/src/assets/images/yes.png'
import No from '/src/assets/images/no.png'
import NoWhite from '/src/assets/images/no-white.png'
import YesWhite from '/src/assets/images/yes-white.png'

const DeathVote = () => {
  useEffect(() => {
    setSize(400, 380)
  }, [])

  const [selected, setSelected] = useState<'live' | 'die'>()

  return (
    <VStack
      spacing={40}
      align="center"
      marginVertical={12}
    >
      <Styled.TitleText>
        이 플레이어는 <Styled.Text color="red">마피아 </Styled.Text>일까요?
      </Styled.TitleText>
      <Container>
        <VoteButton onClick={() => setSelected('live')}>
          <ImageWrapper color={selected === 'live' ? '#537CE3' : 'white'}>
            <img src={selected === 'live' ? YesWhite : Yes} />
          </ImageWrapper>
          <Text>살린다</Text>
        </VoteButton>
        <VoteButton onClick={() => setSelected('die')}>
          <ImageWrapper color={selected === 'die' ? '#BE3A3A' : 'white'}>
            <img src={selected === 'die' ? NoWhite : No} />
          </ImageWrapper>
          <Text>죽인다</Text>
        </VoteButton>
      </Container>
      <Styled.VoteButton color="red">확인</Styled.VoteButton>
    </VStack>
  )
}

export default DeathVote

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 64px;
`

const VoteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  border: none;
  background-color: transparent;
  cursor: pointer;
`
const ImageWrapper = styled.div<{ color: string }>`
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 16px rgba(37, 37, 37, 0.2);
`
const Text = styled.span`
  font-size: 14px;
  font-weight: 600;
`
