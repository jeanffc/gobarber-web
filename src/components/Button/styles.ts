import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  button {
    background: #ff9000;
    color: #312e38;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    margin-top: 16px;
    width: 100%;
    height: 56px;
    transition: 0.2s;

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`;
