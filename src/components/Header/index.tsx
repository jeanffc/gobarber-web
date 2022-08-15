import React from 'react';
import { Link } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';
import logo from '../../assets/logo.svg';

import { HeaderContainer, HeaderContent, Profile } from './styles';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  console.log('user = ', user);
  return (
    <HeaderContainer>
      <HeaderContent>
        <img src={logo} alt="GoBarber" />

        <Profile>
          <img
            src={
              user.avatar_url ||
              'https://gravatar.com/avatar/36511d6bb8cb15087c061866537a0297?s=400&d=robohash&r=x'
            }
            alt={user.name}
          />

          <div>
            <span>Welcome,</span>
            <Link to="/profile">
              <strong>{user.name}</strong>
            </Link>
          </div>
        </Profile>

        <button type="button" onClick={signOut}>
          <FiPower />
        </button>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
