import { useMemo, useState } from 'react'
import * as Styled from '../Vote.styled'
import Confirm from '/src/assets/images/confirm.png'
import { getWamData } from '../../../utils/wam'

export type ColorType = 'red' | 'blue'

interface Player {
  id: string
  callerId: string
  username: string
  profileUrl: string
}

interface Props {
  color: ColorType
}

const Vote = ({ color }: Props) => {
  // @ts-expect-error error
  const players = useMemo<Player[]>(() => getWamData('players'), [])
  const [selected, setSelected] = useState<string>()

  return (
    <Styled.VoteItemWrapper>
      {players.map((player: Player) => (
        <VoteItem
          selected={selected === player.id}
          onClick={() => setSelected(player.id)}
          color={color}
          player={player}
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
  player: Player
}

const VoteItem = ({ selected, onClick, color, player }: VoteItemProps) => {
  return (
    <Styled.VoteWrapper onClick={onClick}>
      <Styled.VoteImage>
        <img src={player.profileUrl} />
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
      <Styled.VoteName>{player.username}</Styled.VoteName>
    </Styled.VoteWrapper>
  )
}
