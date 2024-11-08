import { useState } from 'react'
import * as Styled from '../Vote.styled'
import Hamster from '/src/assets/images/hamster.png'
import Confirm from '/src/assets/images/confirm.png'

export type ColorType = 'red' | 'blue'

interface Props {
  color: ColorType
}

const Vote = ({ color }: Props) => {
  const [selected, setSelected] = useState<number>()

  return (
    <Styled.VoteItemWrapper>
      <Styled.VoteItemColumn>
        <VoteItem
          selected={selected === 0}
          onClick={() => setSelected(0)}
          color={color}
        />
        <VoteItem
          selected={selected === 1}
          onClick={() => setSelected(1)}
          color={color}
        />
        <VoteItem
          selected={selected === 2}
          onClick={() => setSelected(2)}
          color={color}
        />
      </Styled.VoteItemColumn>
      <Styled.VoteItemColumn>
        <VoteItem
          selected={selected === 4}
          onClick={() => setSelected(4)}
          color={color}
        />
        <VoteItem
          selected={selected === 5}
          onClick={() => setSelected(5)}
          color={color}
        />
        <VoteItem
          selected={selected === 6}
          onClick={() => setSelected(6)}
          color={color}
        />
      </Styled.VoteItemColumn>
    </Styled.VoteItemWrapper>
  )
}

export default Vote

interface VoteItemProps {
  selected: boolean
  onClick: () => void
  color: ColorType
}

const VoteItem = ({ selected, onClick, color }: VoteItemProps) => {
  return (
    <Styled.VoteWrapper onClick={onClick}>
      <Styled.VoteImage>
        <img src={Hamster} />
        {selected && (
          <Styled.SelectedIcon color={color}>
            <img
              src={Confirm}
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
