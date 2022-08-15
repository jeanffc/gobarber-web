import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';
import 'react-day-picker/lib/style.css';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';

import logo from '../../assets/logo.svg';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Section,
  ProviderContainer,
} from './styles';

interface Provider {
  _id: string;
  avatar_url: string;
  name: string;
  email: string;
}

const Providers: React.FC = () => {
  const { user, signOut } = useAuth();

  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    api
      .get(`/providers`)
      .then(response => {
        setProviders(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Link to="/dashboard">
            <img src={logo} alt="GoBarber" />
          </Link>
          <Profile>
            <img src={user.avatar_url} alt={user.name} />

            <div>
              <span>Bem-vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Barbers</h1>

          <Section>
            {providers.length === 0 && <p>No provider</p>}

            {providers.map(provider => (
              <ProviderContainer key={`provider-${provider._id}`}>
                <div>
                  <img src={provider.avatar_url} alt={provider.name} />
                  <strong>{provider.name}</strong>
                </div>
              </ProviderContainer>
            ))}
          </Section>
        </Schedule>
      </Content>
    </Container>
  );
};

export default Providers;
