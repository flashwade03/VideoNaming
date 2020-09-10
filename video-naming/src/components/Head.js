import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  useUserConfig,
  useUserConfigDispatch,
  useVideoData,
  useVideoDataDispatch,
} from '../VideoDataContext';

const HeadBlock = styled.div`
  padding: 48px 32px 24px 32px;
  border-bottom: 1px solid #e9ecef;

  h1 {
    float: left;
    font-size: 24px;
  }

  .form-group {
    display: flex;
    float: right;
    height: 100%;
    align-items: center;
    flex-direction: column;
  }
`;

const EditButtonGroup = styled.div`
  display: flex;
`;

const EditButtonBlock = styled.div`
  background: #38d9a9;
  &:hover {
    background: #63e6be;
  }

  &:active {
    background: #20c997;
  }

  border: 1px solid #38d9b0;
  margin-top: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 15px;
  color: #000;

  & + & {
    margin-left: 10px;
    background: #ff5733;
    &:hover {
      background: #ff7833;
    }

    &:active {
      background: #ff6833;
    }
  }

  ${(props) =>
    !props.edit &&
    props.savebutton &&
    css`
      visibility: hidden;
    `};
`;

export default function Head({ children, onClickEditor }) {
  const [value, setValue] = useState('');
  const userConfig = useUserConfig();
  const userConfigDispatch = useUserConfigDispatch();
  const videos = useVideoData();
  const videoDispatch = useVideoDataDispatch();

  let configData;
  if (userConfig.games.length === 0) {
    console.log('empty');
    configData = JSON.parse(localStorage.getItem('storedData'));
  }

  if (configData) {
    userConfigDispatch({
      type: 'SET_CONFIG',
      games: configData.games,
      resolutions: configData.resolutions,
    });
  }

  const onChange = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
    userConfigDispatch({
      type: 'SET_USER',
      username: value,
    });
  };

  const onClick = () => {
    onClickEditor();
    userConfigDispatch({
      type: 'TOGGLE',
    });
  };

  const onClickChangeAll = () => {
    window.ipcRenderer.send('changeMultipleFiles', JSON.stringify(videos));
    // eslint-disable-next-line array-callback-return
    videos.videos.map((video) => {
      if (video.check && video.newfilename !== null) {
        videoDispatch({
          type: 'FINISHED_CHANGE_FILE_NAME',
          id: video.id,
        });
      }
    });
  };

  const onClickDataSave = () => {
    console.log(userConfig.edit);
    if (userConfig.edit) {
      console.log(1);
      const dataObject = {
        games: userConfig.games,
        resolutions: userConfig.resolutions,
      };
      const dataJSONStr = JSON.stringify(dataObject);
      console.log(dataJSONStr);
      localStorage.setItem('storedData', dataJSONStr);
      console.log(2);
      window.ipcRenderer.send('saveDataSet');
    }
  };

  return (
    <HeadBlock>
      <h1>{(userConfig.username && userConfig.username) || children}</h1>
      <div className="form-group">
        <form onSubmit={onSubmit}>
          <label>
            Who?&nbsp;
            <input type="text" onChange={onChange} />
          </label>
        </form>
        <EditButtonGroup>
          <EditButtonBlock onClick={onClick}>Data Edit</EditButtonBlock>
          <EditButtonBlock
            savebutton
            edit={userConfig.edit}
            onClick={onClickDataSave}
          >
            Save Data
          </EditButtonBlock>
        </EditButtonGroup>
        <EditButtonBlock className="run_button" onClick={onClickChangeAll}>
          Change All Videos
        </EditButtonBlock>
      </div>
    </HeadBlock>
  );
}
