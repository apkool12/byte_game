"use client";

import { memo } from "react";
import styled from "@emotion/styled";

const Button = styled.button<{ $background?: string }>`
  display: block;
  width: 180px;
  transform: translateY(8px);

  padding: 8px 12px;
  font-family: var(--font-game-of-squids);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #fff;
  border-radius: 30px;
  border: none;
  background: linear-gradient(90deg, #f3406c 0%, #000 100%);
  box-shadow: 0 2px 4px 0 rgba(255, 77, 77, 0.1);
  cursor: pointer;
`;

interface ActionButtonProps {
  children: string;
  onClick: () => void;
  disabled?: boolean;
  /** 버튼 배경 (색상 또는 gradient). 예: "#e63946" 또는 "linear-gradient(90deg, #e63946, #c1121f)" */
  background?: string;
}

function ActionButton({
  children,
  onClick,
  disabled,
  background,
}: ActionButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      $background={background}
    >
      {children}
    </Button>
  );
}

export default memo(ActionButton);
