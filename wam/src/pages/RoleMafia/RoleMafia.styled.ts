import styled from 'styled-components'

export const subtitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 100%;
  text-align: center;
  color: #252525;
  margin: 0;
`
export const primaryHeading = styled.span`
  font-size: 24px;
  font-weight: 700;
  line-height: 100%;
  text-align: center;
  color: #be3a3a;
`
export const secondaryHeading = styled.span`
  font-size: 24px;
  font-weight: 700;
  line-height: 100%;
  text-align: center;
  color: #537ce3;
`
export const roleImage = styled.div`
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 16px rgba(37, 37, 37, 0.2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
export const otherImage = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 16px rgba(37, 37, 37, 0.2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
export const primaryButton = styled.button`
  width: 64px;
  height: 28px;
  background-color: #be3a3a;
  border-radius: 10px;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0px 0px 16px rgba(37, 37, 37, 0.2);
  cursor: pointer;
`

export const secondaryButton = styled.button`
  width: 64px;
  height: 28px;
  background-color: #537ce3;
  border-radius: 10px;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0px 0px 16px rgba(37, 37, 37, 0.2);
  cursor: pointer;
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 0;
`
