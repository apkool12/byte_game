"use client";

import { useCallback } from "react";
import styled from "@emotion/styled";

const Field = styled.div`
  margin-bottom: 36px;
`;

const Label = styled.label`
  display: block;
  font-size: 8px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.1em;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  background:
    linear-gradient(
        90deg,
        rgba(119, 119, 119, 0.6) 0%,
        rgba(33, 33, 33, 0.6) 100%
      )
      bottom / 100% 1px no-repeat,
    transparent;
  color: #fff;
  font-size: 1rem;
  font-family: var(--font-pretendard-light);
  font-weight: 300;
  padding: 10px 0;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    background:
      linear-gradient(90deg, #e63946 0%, #c1121f 100%) bottom / 100% 2px
        no-repeat,
      transparent;
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
    [values, onChange],
  );

  const handleCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...values, inviteCode: e.target.value });
    },
    [values, onChange],
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
