import React from 'react';
import styled from 'styled-components';

const DataTemplateBlock = styled.div`
  width: 960px;
  height: 540px;
  position: relative;
  display: flex;
  background: white;
  margin: 0 auto;
  margin-top: 32px;
  margin-bottom: 32px;
  border-radius: 16px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.04);
  flex-direction: column;
`;

export default function DataTemplate({ children }) {
  return <DataTemplateBlock>{children}</DataTemplateBlock>;
}
