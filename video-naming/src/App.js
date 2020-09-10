import React, { useState, useCallback } from 'react';
import './App.css';
import { createGlobalStyle } from 'styled-components';
import DataTemplate from './components/DataTemplate';
import Head from './components/Head';
import ItemList from './components/ItemList';
import AddVideo from './components/AddVideo';
import VideoDataProvider from './VideoDataContext';
import DataEditor from './components/DataEditor';
import AddData from './components/AddData';

window.ipcRenderer = window.require('electron').ipcRenderer;

const GlobalStyle = createGlobalStyle`
  body {
    background: #e9ecef;
  }
`;

function App() {
  window.ipcRenderer.send('loadDataSet');
  const [edit, setEdit] = useState(false);
  const onClickEditor = useCallback(() => {
    console.log('Click!');
    setEdit(!edit);
  });

  return (
    <VideoDataProvider>
      <GlobalStyle />
      <DataTemplate>
        <Head onClickEditor={onClickEditor}>
          광고 영상 이름 변경해주는 무언가임. 옆에서 이름부터 입력하셔
        </Head>
        {(edit && (
          <>
            <DataEditor />
            <AddData />
          </>
        )) || (
          <>
            <ItemList />
            <AddVideo />
          </>
        )}
      </DataTemplate>
    </VideoDataProvider>
  );
}

export default App;
