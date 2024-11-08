import styled from 'styled-components'
import { ColorType } from './components/Vote'

export const Wrapper = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  box-sizing: border-box;
  padding-top: 12px;
`

export const CancelIconWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`

export const Text = styled.span<{ color: ColorType }>`
  font-size: 24px;
  color: ${({ color }) => (color === 'red' ? '#be3a3a' : '#537ce7')};
`

export const TitleText = styled.h1`
  font-size: 14px;
  color: #252525;
`

export const VoteWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  border: none;
  background-color: transparent;
  cursor: pointer;
`

export const VoteImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: none;
  position: relative;
  box-shadow: 0px 0px 16px rgba(37, 37, 37, 0.2);
`

export const SelectedIcon = styled.div<{ color: ColorType }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ color }) =>
    color === 'red' ? 'rgba(190, 58, 58, 0.8)' : 'rgba(83, 124, 227, 0.8)'};
  border-radius: 80%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const VoteName = styled.div`
  font-size: 14px;
  color: #252525;
  font-weight: 600;
`
export const VoteItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-direction: column;
`
export const VoteItemColumn = styled.div`
  display: flex;
  gap: 40px;
`

export const VoteButton = styled.button<{ color: ColorType }>`
  width: 68px;
  height: 32px;
  background-color: ${({ color }) => (color === 'red' ? '#be3a3a' : '#537ce7')};
  border-radius: 10px;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 16px rgba(37, 37, 37, 0.2);
  cursor: pointer;
`
