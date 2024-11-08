import { useCallback, useMemo, useState } from 'react'
import * as Styled from '../Vote.styled'
import Confirm from '/src/assets/images/confirm.png'
import { callFunction, getWamData } from '../../../utils/wam'

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
  const appId = useMemo(() => getWamData('appId') ?? '', [])
  const name = useMemo(() => getWamData('name') ?? '', [])

  // @ts-expect-error error
  const players = useMemo<Player[]>(() => getWamData('players'), [])
  const [selected, setSelected] = useState<string>()

  const handleSend = useCallback(
    async (name: string): Promise<void> => {
      switch (name) {
        case 'CIVILIAN_VOTE':
          await callFunction(appId, 'civilianVote', {
            input: {
              vote: selected,
            },
          })
          window.ChannelIOWam.close()
          break
        case 'DEATH_VOTE':
          await callFunction(appId, 'deathVote', {
            input: {
              vote: selected,
            },
          })
          window.ChannelIOWam.close()
          break
        case 'DOCTOR_VOTE':
          await callFunction(appId, 'doctorVote', {
            input: {
              vote: selected,
            },
          })
          window.ChannelIOWam.close()
          break
        case 'POLICE_VOTE':
          await callFunction(appId, 'policeVote', {
            input: {
              vote: selected,
            },
          })
          window.ChannelIOWam.close()
          break
        default:
          // NOTE: should not reach here
          console.error('Invalid message sender')
      }
    },
    [appId, selected]
  )

  return (
    <>
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
      <Styled.VoteButton
        color={color}
        onClick={() => handleSend(name)}
      >
        확인
      </Styled.VoteButton>
    </>
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
