import { shade } from 'polished';
import styled from 'styled-components';

export const Content = styled.main`
  max-width: 1120px;

  display: flex;
  flex-wrap: wrap;
  gap: 50px;
`;

export const ContentSchedule = styled.div`
  flex: 1;

  h1 {
    font-size: 36px;
  }

  p {
    margin-top: 32px;
    color: #ff9000;
    font-weight: 500;

    display: flex;
    align-items: center;

    span {
      display: flex;
      align-items: center;
    }

    span + span::before {
      content: '';
      width: 1px;
      height: 12px;
      background: #ff9000;
      margin: 0 8px;
    }
  }
`;

export const Section = styled.section`
  margin-top: 48px;

  > strong {
    color: #999591;
    font-size: 20px;
    line-height: 26px;
    display: block;
    border-bottom: 1px solid #3e3b47;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }

  > p {
    color: #999591;
    font-weight: 400;
  }
`;

interface SelectHourButtonProps {
  selected?: boolean;
}

export const SelectHourButton = styled.button<SelectHourButtonProps>`
  color: #f4ede8;
  font-weight: 500;
  border-radius: 4px;
  border: 0;
  margin-right: 10px;
  padding: 4px 10px;
  height: 28px;
  transition: 0.2s;

  &:hover {
    background: ${shade(0.2, '#3e3b47')};
  }

  background: ${props => (props.selected ? '#ff9000' : '#3e3b47')};
`;

export const Calender = styled.aside`
  width: 380px;

  .DayPicker {
    background: #28262e;
    border-radius: 10px;
  }

  .DayPicker-wrapper {
    padding-bottom: 0;
  }

  .DayPicker,
  .DayPicker-Month {
    width: 100%;
  }

  .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    margin: 16px;
  }

  .DayPicker-Day {
    width: 40px;
    height: 40px;
  }

  .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background: #3e3b47;
    border-radius: 10px;
    color: #fff;
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${shade(0.2, '#3e3b47')};
  }

  .DayPicker-Day--today {
    font-weight: normal;
  }

  .DayPicker-Day--disabled {
    color: #666360 !important;
    background: transparent !important;
  }

  .DayPicker-Day--selected {
    background: #ff9000 !important;
    border-radius: 10px;
    color: #232129 !important;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  color: #ffffff;
  border: 0;
`;
