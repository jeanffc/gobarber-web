import React, { useCallback, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logo from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Name required'),
          email: Yup.string()
            .required('E-mail required')
            .email('Enter a valid email address'),
          password: Yup.string()
            .required('Password required')
            .min(6, 'At least 6 digits'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);

        await api.post('users', data);

        addToast({
          type: 'success',
          title: 'Success',
          description: 'You can login to GoBarber',
        });

        setLoading(false);

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          setLoading(false);

          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Error',
          description:
            'An error occurred while registering, check your details',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Sign up</h1>

            <Input name="name" icon={FiUser} type="text" placeholder="Name" />
            <Input
              name="email"
              icon={FiMail}
              type="text"
              placeholder="E-mail"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />

            <Button loading={loading} type="submit">
              Register
            </Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Back to login
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
