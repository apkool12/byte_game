'use client';

import styled from '@emotion/styled';

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const Shape = styled.div<{ shape: 'circle' | 'triangle' | 'square' }>`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #e63946 0%, #ff6b6b 100%);
  box-shadow: 0 4px 12px rgba(230, 57, 70, 0.4);
  border-radius: ${({ shape }) => (shape === 'circle' ? '50%' : shape === 'triangle' ? '0' : '4px')};
  clip-path: ${({ shape }) =>
    shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'};
`;

export default function HeaderShapes() {
  return (
    <Wrap>
      <Shape shape="circle" />
      <Shape shape="triangle" />
      <Shape shape="square" />
    </Wrap>
  );
}
