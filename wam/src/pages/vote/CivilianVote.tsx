import { CancelIcon } from '@channel.io/bezier-icons'
import * as Styled from './Vote.styled'
import Vote from './components/Vote'
import { useEffect } from 'react'
import { setSize } from '../../utils/wam'
import { Button } from '@channel.io/bezier-react'

const CivilianVote = () => {
  useEffect(() => {
    setSize(448, 472)
  }, [])

  return (
    <Styled.Wrapper>
      <Styled.CancelIconWrapper>
        <Button
          colorVariant="monochrome-dark"
          styleVariant="tertiary"
          leftContent={CancelIcon}
          onClick={() => window.ChannelIOWam.close()}
        />
      </Styled.CancelIconWrapper>
      <Styled.TitleText>
        누가 <Styled.Text color="red">마피아 </Styled.Text>일까요?
      </Styled.TitleText>
      <Vote color="red" />
    </Styled.Wrapper>
  )
}

export default CivilianVote
