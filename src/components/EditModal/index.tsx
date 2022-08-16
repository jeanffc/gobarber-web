import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

import { format, isToday } from 'date-fns';
import enCA from 'date-fns/locale/en-CA';
import Modal from 'react-modal';
import Button from '../Button';
import {
  CloseButton,
  Content,
  Calender,
  ContentSchedule,
  Section,
  SelectHourButton,
} from './styles';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import { useHistory, Link } from 'react-router-dom';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { Appointments } from '../../pages/Dashboard';

const customStyles = {
  content: {
    background: '#312e38',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '40px',
    borderRadius: '20px',
  },
};

Modal.setAppElement('#root');

interface EditModalProps {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialDate: Date;
  appointment: Appointments;
}

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

const EditModal: React.FC<EditModalProps> = ({
  modalIsOpen,
  setModalIsOpen,
  initialDate,
  appointment,
}) => {
  const [selectedHour, setSelectedHour] = useState(8);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
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

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: enCA,
    });
  }, [selectedDate]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const handleHourChange = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "MMMM dd", {
      locale: enCA,
    });
  }, [selectedDate]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        date: new Date(selectedDate.setHours(selectedHour, 0, 0)),
      };

      await api.put(`/appointments/${appointment._id}`, data);

      addToast({
        type: 'success',
        title: 'Success',
        description: 'Appointment successfully updated!',
      });

      history.push('/');
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'An error occurred while schedulling, check your details',
      });
    }
  };

  useEffect(() => {
    setSelectedHour(new Date(appointment.date).getHours());
    setSelectedDate(initialDate);
  }, [modalIsOpen]);

  return (
    <Modal
      isOpen={modalIsOpen}
      style={customStyles}
      contentLabel="Edit Appointment"
      onRequestClose={() => setModalIsOpen(false)}
    >
      <CloseButton onClick={() => setModalIsOpen(false)}>
        <AiFillCloseCircle color="#f4ede8" />
      </CloseButton>
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
              selected={selectedHour === 8}
              onClick={() => handleHourChange(8)}
            >
              08:00
            </SelectHourButton>
            <SelectHourButton
              selected={selectedHour === 9}
              onClick={() => handleHourChange(9)}
            >
              09:00
            </SelectHourButton>
            <SelectHourButton
              selected={selectedHour === 10}
              onClick={() => handleHourChange(10)}
            >
              10:00
            </SelectHourButton>
            <SelectHourButton
              selected={selectedHour === 11}
              onClick={() => handleHourChange(11)}
            >
              11:00
            </SelectHourButton>
          </Section>

          <Section>
            <strong>Afternoon</strong>
            <SelectHourButton
              selected={selectedHour === 13}
              onClick={() => handleHourChange(13)}
            >
              13:00
            </SelectHourButton>
            <SelectHourButton
              selected={selectedHour === 14}
              onClick={() => handleHourChange(14)}
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
    </Modal>
  );
};

export default EditModal;
