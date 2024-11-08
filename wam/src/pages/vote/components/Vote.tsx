import { useMemo, useState } from 'react'
import * as Styled from '../Vote.styled'
import Hamster from '/src/assets/images/hamster.png'
import Confirm from '/src/assets/images/confirm.png'
import { getWamData } from '../../../utils/wam'

export type ColorType = 'red' | 'blue'

interface Player {
  id: string
  callerId: string
}

interface Props {
  color: ColorType
}

const Vote = ({ color }: Props) => {
  const players: Player[] = useMemo(
    () => JSON.parse(getWamData('players') ?? '[]'),
    []
  )
  const [selected, setSelected] = useState<string>()

  return (
    <Styled.VoteItemWrapper>
      {players.map((player) => (
        <VoteItem
          selected={selected === player.id}
          onClick={() => setSelected(player.id)}
          color={color}
        />
      ))}
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
