import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import 'react-day-picker/lib/style.css';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';

import {
  Container,
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
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Schedule>
          <h1>Select a Barber</h1>

          <Section>
            {providers.length === 0 && <p>No barbers</p>}

            {providers.map(provider => (
              <div key={`provider-${provider._id}`}>
                <Link to="/schedule">
                  <ProviderContainer>
                    <div>
                      <img
                        src={
                          provider.avatar_url ||
                          'https://gravatar.com/avatar/36511d6bb8cb15087c061866537a0297?s=400&d=robohash&r=x'
                        }
                        alt={provider.name}
                      />
                      <strong>{provider.name}</strong>
                    </div>
                  </ProviderContainer>
                </Link>
              </div>
            ))}
          </Section>
        </Schedule>
      </Content>
    </Container>
  );
};

export default Providers;
