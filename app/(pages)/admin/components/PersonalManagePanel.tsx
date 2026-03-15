"use client";

import { useState, useCallback } from "react";
import styled from "@emotion/styled";

const Field = styled.div`
  margin-bottom: 36px;
  width: 100%;
  max-width: 280px;
`;

const Label = styled.label`
  display: block;
  font-size: 8px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.1em;
  margin-bottom: 8px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
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

const SearchIcon = styled.span`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotFound = styled.p`
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin: 32px 0 0;
  text-align: center;
  background: linear-gradient(
    90deg,
    #e0e0e0 0%,
    #ff8fa3 40%,
    #e63946 70%,
    #9e4141 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
`;

export default function PersonalManagePanel() {
  const [name, setName] = useState("");

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  return (
    <>
      <Field>
        <Label htmlFor="admin-name-search">NAME</Label>
        <InputRow>
          <Input
            id="admin-name-search"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={handleChange}
            autoComplete="name"
          />
          <SearchIcon aria-hidden>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </SearchIcon>
        </InputRow>
      </Field>
      <NotFound>NOT FOUND</NotFound>
    </>
  );
}
