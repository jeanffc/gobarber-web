import React, { useCallback, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import enCA from 'date-fns/locale/en-CA';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { FiArrowLeft } from 'react-icons/fi';
import 'react-day-picker/lib/style.css';

import { useAuth } from '../../hooks/auth';

import Button from '../../components/Button';

import {
  Container,
  Content,
  ContentSchedule,
  Section,
  Calender,
  SelectHourButton,
} from './styles';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

const Schedule: React.FC = () => {
  const { user } = useAuth();
  const [selectedHour, setSelectedHour] = useState('08');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const history = useHistory();

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Day' dd 'of' MMMM", {
      locale: enCA,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: enCA,
    });
  }, [selectedDate]);

  const handleHourChange = useCallback((hour: string) => {
    setSelectedHour(hour);
  }, []);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        provider_id: '62fa6887c5e6fab497188d9c', // TODO: update provider id dynamically
        user_id: user._id,
        date: '2022-08-15T19:08:00.000+00:00', // TODO: update date dynamically
      };

      // await api.post('appointments', data);
      console.log(data);
      console.log(selectedDate);

      addToast({
        type: 'success',
        title: 'Success',
        description: 'Congratulations!',
      });

      // history.push('/');
    } catch (error) {
      console.log(error);

      addToast({
        type: 'error',
        title: 'Error',
        description: 'An error occurred while schedulling, check your details',
      });
    }

    setLoading(false);
  };

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <ContentSchedule>
          <h1>Select a Date</h1>
          <p>
            {isToday(selectedDate) && <span>Today</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          <Section>
            <strong>Morning</strong>
            <SelectHourButton
              selected={selectedHour === '08'}
              onClick={() => handleHourChange('08')}
            >
              08:00
            </SelectHourButton>
            <SelectHourButton
              selected={selectedHour === '09'}
              onClick={() => handleHourChange('09')}
            >
              09:00
            </SelectHourButton>
            <SelectHourButton
              selected={selectedHour === '10'}
              onClick={() => handleHourChange('10')}
            >
              10:00
            </SelectHourButton>
            <SelectHourButton
              selected={selectedHour === '11'}
              onClick={() => handleHourChange('11')}
            >
              11:00
            </SelectHourButton>
          </Section>

          <Section>
            <strong>Afternoon</strong>
            <SelectHourButton
              selected={selectedHour === '13'}
              onClick={() => handleHourChange('13')}
            >
              13:00
            </SelectHourButton>
            <SelectHourButton
              selected={selectedHour === '14'}
              onClick={() => handleHourChange('14')}
            >
              14:00
            </SelectHourButton>
          </Section>

          <Section>
            <Button loading={loading} onClick={handleSubmit}>
              Save Schedule
            </Button>
          </Section>
        </ContentSchedule>

        <Calender>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
          />
        </Calender>
      </Content>
    </Container>
  );
};

export default Schedule;
