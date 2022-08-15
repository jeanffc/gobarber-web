import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import enCA from 'date-fns/locale/en-CA';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';
import Header from '../../components/Header';
import Button from '../../components/Button';

import {
  Container,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calender,
} from './styles';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointments {
  _id: string;
  date: string;
  hourFormatted?: string;
  dateFormatted?: string;
  user: {
    _id: string;
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appointments[]>([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user._id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth(),
        },
      })
      // .get(`/providers/${user._id}/month-availability`)
      .then(response => {
        if (response.data) {
          setMonthAvailability(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [currentMonth, user._id]);

  useEffect(() => {
    api
      .get<Appointments[]>(`/appointments/user/${user._id}`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth(),
          day: selectedDate.getDate(),
        },
      })
      // .get<Appointments[]>(`/appointments/user/${user._id}`)
      .then(response => {
        if (response.data) {
          const appointmentsFormatted = response.data.map(appointment => {
            return {
              ...appointment,
              hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
              dateFormatted: format(parseISO(appointment.date), 'yyyy-MM-dd'),
            };
          });

          setAppointments(appointmentsFormatted);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [selectedDate, user._id]);

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
    return format(selectedDate, "'Day' dd 'de' MMMM", {
      locale: enCA,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: enCA,
    });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

  return (
    <Container>
      <Header />

      <Content>
        <Schedule>
          <h1>Schedules</h1>
          <p>
            {isToday(selectedDate) && <span>Today</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Next</strong>
              <div>
                <img
                  src={
                    nextAppointment.user.avatar_url ||
                    'https://gravatar.com/avatar/36511d6bb8cb15087c061866537a0297?s=400&d=robohash&r=x'
                  }
                  alt={nextAppointment.user.name}
                />

                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                  <span>{nextAppointment.dateFormatted}</span>
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Morning</strong>

            {morningAppointments.length === 0 && <p>No morning appointments</p>}

            {morningAppointments.map(appointment => (
              <Appointment key={appointment._id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={
                      appointment.user.avatar_url ||
                      'https://gravatar.com/avatar/36511d6bb8cb15087c061866537a0297?s=400&d=robohash&r=x'
                    }
                    alt={appointment.user.name}
                  />
                  <div>
                    <strong>{appointment.user.name}</strong>
                    <span>{appointment.dateFormatted}</span>
                  </div>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Afternoon</strong>

            {afternoonAppointments.length === 0 && (
              <p>No afternoon appointments</p>
            )}

            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment._id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={
                      appointment.user.avatar_url ||
                      'https://gravatar.com/avatar/36511d6bb8cb15087c061866537a0297?s=400&d=robohash&r=x'
                    }
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                  <span>{appointment.dateFormatted}</span>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>

        <Calender>
          <Link to="/providers">
            <Button>New Schedule</Button>
          </Link>

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
            // months={[
            //   'Janeiro',
            //   'Fevereiro',
            //   'Março',
            //   'Abril',
            //   'Maio',
            //   'Junho',
            //   'Julho',
            //   'Agosto',
            //   'Setembro',
            //   'Outubro',
            //   'Novembro',
            //   'Dezembro',
            // ]}
          />
        </Calender>
      </Content>
    </Container>
  );
};

export default Dashboard;
