'use client';

import { useCallback } from 'react';
import styled from '@emotion/styled';

const Field = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.1em;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 2px solid #2d2d2d;
  color: #fff;
  font-size: 1rem;
  padding: 10px 0;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-bottom-color: #e63946;
  }
`;

export interface LoginFormValues {
  name: string;
  inviteCode: string;
}

interface InputFormProps {
  values: LoginFormValues;
  onChange: (values: LoginFormValues) => void;
}

export default function InputForm({ values, onChange }: InputFormProps) {
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...values, name: e.target.value });
    },
    [values, onChange]
  );

  const handleCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...values, inviteCode: e.target.value });
    },
    [values, onChange]
  );

  return (
    <>
      <Field>
        <Label htmlFor="name">NAME</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={values.name}
          onChange={handleNameChange}
          autoComplete="name"
        />
      </Field>
      <Field>
        <Label htmlFor="inviteCode">INVITE CODE</Label>
        <Input
          id="inviteCode"
          type="text"
          placeholder="Enter invite code"
          value={values.inviteCode}
          onChange={handleCodeChange}
          autoComplete="off"
        />
      </Field>
    </>
  );
}
