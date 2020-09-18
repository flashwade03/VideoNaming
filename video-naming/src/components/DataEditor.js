import React from 'react';
import styled from 'styled-components';
import ConfigItem from './ConfigItem';
import ConfigItem2 from './ConfigItem2';
import ConfigItem3 from './ConfigItem3';
import { useUserConfig, useUserConfigDispatch } from '../VideoDataContext';

const DataListBlock = styled.div`
  flex: 1;
  padding: 20px 32px;
  padding-bottom: 48px;
  overflow-y: auto;

  h1 {
    font-size: 24px;
  }
`;

export default function DataEditor({ children }) {
  const userConfig = useUserConfig();

  return (
    <DataListBlock>
      <h1>Games</h1>
      {userConfig.games.map((game) => (
        <ConfigItem key={game} name={game} />
      ))}
      <h1>Resolution</h1>
      {userConfig.resolutions.map((resolution) => (
        <ConfigItem2 key={resolution} name={resolution} />
      ))}
      <h1>Tags</h1>
      {userConfig.tags.map((tag) => (
        <ConfigItem3 key={tag} name={tag} />
      ))}
    </DataListBlock>
  );
}
