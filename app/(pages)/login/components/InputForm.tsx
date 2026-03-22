"use client";

import { useCallback, useEffect, useRef } from "react";
import { LABEL_INVITE_CODE, LABEL_NAME } from "@/data/copy";
import { PLACEHOLDER_INVITE_CODE, PLACEHOLDER_NAME } from "@/data/placeholders";
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
  const nameInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const applyBodyFix = useCallback(() => {
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
  }, []);

  const removeBodyFix = useCallback(() => {
    const scrollY = Math.abs(parseInt(document.body.style.top || "0", 10));
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollY);
  }, []);

  const handleFocus = useCallback(() => {
    applyBodyFix();
  }, [applyBodyFix]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      const active = document.activeElement;
      const isOurInput =
        active === nameInputRef.current || active === codeInputRef.current;
      if (!isOurInput) removeBodyFix();
    }, 0);
  }, [removeBodyFix]);

  useEffect(() => {
    return () => removeBodyFix();
  }, [removeBodyFix]);

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
        <Label htmlFor="name">{LABEL_NAME}</Label>
        <Input
          ref={nameInputRef}
          id="name"
          type="text"
          placeholder={PLACEHOLDER_NAME}
          value={values.name}
          onChange={handleNameChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="name"
        />
      </Field>
      <Field>
        <Label htmlFor="inviteCode">{LABEL_INVITE_CODE}</Label>
        <Input
          ref={codeInputRef}
          id="inviteCode"
          type="text"
          placeholder={PLACEHOLDER_INVITE_CODE}
          value={values.inviteCode}
          onChange={handleCodeChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
        />
      </Field>
    </>
  );
}
