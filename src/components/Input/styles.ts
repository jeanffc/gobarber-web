import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
  isFielled: boolean;
}

export const Container = styled.div<ContainerProps>`
  color: #666360;
  background: #232129;
  border-radius: 10px;
  border: 2px solid #232129;
  width: 100%;
  padding: 16px;
  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  ${props =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}

  ${props =>
    props.isFielled &&
    css`
      color: #ff9000;
    `}


  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #f4ede8;

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 16px;
  }
`;
