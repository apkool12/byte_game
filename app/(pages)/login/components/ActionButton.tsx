'use client';

import { memo } from 'react';
import styled from '@emotion/styled';

const Button = styled.button`
  width: 100%;
  padding: 16px 24px;
  font-family: var(--font-geist), sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #fff;
  background: linear-gradient(90deg, #e63946 0%, #c1121f 100%);
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  transition: transform 0.15s, box-shadow 0.15s;

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    box-shadow: 0 6px 24px rgba(230, 57, 70, 0.5);
  }
`;

interface ActionButtonProps {
  children: string;
  onClick: () => void;
  disabled?: boolean;
}

function ActionButton({ children, onClick, disabled }: ActionButtonProps) {
  return (
    <Button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}

export default memo(ActionButton);
