import { CancelIcon } from '@channel.io/bezier-icons'
import { VStack } from '@channel.io/bezier-react'
import * as Styled from './MafiaVote.styled'
import { useState } from 'react'

const MafiaVote = () => {
  const [selected, setSelected] = useState<number>()

  console.log(selected)

  return (
    <VStack
      spacing={40}
      align="center"
    >
      <Styled.TitleText>
        누가 <Styled.MafiaText>마피아 </Styled.MafiaText>일까요?
      </Styled.TitleText>
      <Styled.VoteItemWrapper>
        <Styled.VoteItemColumn>
          <VoteItem
            selected={selected === 0}
            onClick={() => setSelected(0)}
          />
          <VoteItem
            selected={selected === 1}
            onClick={() => setSelected(1)}
          />
          <VoteItem
            selected={selected === 2}
            onClick={() => setSelected(2)}
          />
        </Styled.VoteItemColumn>
        <Styled.VoteItemColumn>
          <VoteItem
            selected={selected === 4}
            onClick={() => setSelected(4)}
          />
          <VoteItem
            selected={selected === 5}
            onClick={() => setSelected(5)}
          />
          <VoteItem
            selected={selected === 6}
            onClick={() => setSelected(6)}
          />
        </Styled.VoteItemColumn>
      </Styled.VoteItemWrapper>
      <Styled.VoteButton>확인</Styled.VoteButton>
    </VStack>
  )
}

export default MafiaVote

interface VoteItemProps {
  selected: boolean
  onClick: () => void
}

const VoteItem = ({ selected, onClick }: VoteItemProps) => {
  return (
    <Styled.VoteWrapper onClick={onClick}>
      <Styled.VoteImage>
        <img src="/src/assets/images/hamster.png" />
        {selected && (
          <Styled.SelectedIcon>
            <img
              src="/src/assets/images/confirm.png"
              width={24}
              height={24}
            />
          </Styled.SelectedIcon>
        )}
      </Styled.VoteImage>
      <Styled.VoteName>원하진</Styled.VoteName>
    </Styled.VoteWrapper>
  )
}

{
  /* <ButtonGroup>
          <Button
            colorVariant="blue"
            styleVariant="primary"
            text="Send as a manager"
            onClick={async () => {
              await handleSend('manager')
              close()
            }}
          />
          <Button
            colorVariant="blue"
            styleVariant="primary"
            text="Send as a bot"
            onClick={async () => {
              await handleSend('bot')
              close()
            }}
          />
        </ButtonGroup> */
}
