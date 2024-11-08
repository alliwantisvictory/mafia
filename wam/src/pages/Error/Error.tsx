import { useEffect } from 'react'
import { setSize } from '../../utils/wam'

import * as Styled from './Error.styled'
import { Button } from '@channel.io/bezier-react'
import { CancelIcon } from '@channel.io/bezier-icons'

function Error() {
  useEffect(() => {
    setSize(400, 126)
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
      <Styled.heading>이런!</Styled.heading>
      <Styled.subtitle>지금은 사용할 수 없는 기능이예요</Styled.subtitle>
    </Styled.Wrapper>
  )
}

export default Error
