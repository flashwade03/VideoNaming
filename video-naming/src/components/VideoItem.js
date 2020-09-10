import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  MdPlayArrow,
  MdDelete,
  MdLaunch,
  MdEdit,
  MdStop,
  MdDone,
} from 'react-icons/md';
import { useUserConfig, useVideoDataDispatch } from '../VideoDataContext';

const CheckSquare = styled.div`
  width: 24px;
  height: 24px;
  border: 1px solid #ced4da;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  cursor: pointer;
  ${(props) =>
    props.check &&
    css`
      border: 1px solid #38d9a9;
      color: ##38d9a9;
    `};
`;

const Text = styled.div`
  display: flex;
  flex: 1;
  font-size: 21px;

  span {
    color: blue;
  }
`;

const Edit = styled.div`
  display: flex;
  &:hover {
    color: #dee2e6;
  }

  ${(props) =>
    props.edit &&
    css`
      color: red;
    `};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 24px;
  cursor: pointer;
  &:hover {
    color: #ff6b6b;
  }
  & + & {
    margin-left: 30px;
  }
`;

const VideoItemBlock = styled.div`
  display: flex;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;

  &:hover {
    background: orange;
    ${Button} {
      opacity: 1;
    }
  }

  ${(props) =>
    props.finish &&
    css`
      background: blue;
    `};
`;

const VideoPlayerBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RenameInputFormPositioner = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const RenameInputForm = styled.form`
  background: #f8f9fa;
  height: 100%;
  width: 100%;
  padding: 32px;
  padding-bottom: 32px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 15px;
  border-top: 1px solid #e9ecef;

  label {
    margin-right: 15px;

    & + & {
      maring-left: 20px;
    }
  }

  .result {
    display: block;
    background: red;
  }
`;

let game = '';
let resolution = '';
let date = '';
let isPlayScene = '';
let otherTags = '';
let extra = '';

export default function VideoItem({
  id,
  text,
  newfilename,
  filePath,
  fileObject,
  check,
}) {
  const [finish, setFinish] = useState(false);
  const [play, setPlay] = useState(false);
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState('');
  const videoDispatch = useVideoDataDispatch();
  const userConfig = useUserConfig();

  const onClickEdit = () => {
    setEdit(!edit);
    game = '';
    resolution = '';
    date = '';
    isPlayScene = '';
    otherTags = '';
    extra = '';
  };

  const onChangeFileName = () => {
    videoDispatch({
      type: 'MODITY',
      id,
      newfilename,
    });
    setFinish(false);
  };

  const onClickDownload = () => {
    if (text === newfilename) return;

    setEdit(false);
    setPlay(false);
    window.ipcRenderer.send(
      'changeSingleFile',
      fileObject.name,
      filePath,
      newfilename + '.mp4',
    );

    videoDispatch({
      type: 'FINISHED_CHANGE_FILE_NAME',
      id,
    });
    setFinish(true);
  };

  const onClickDelete = () => {
    setPlay(false);
    setEdit(false);
    videoDispatch({
      type: 'REMOVE',
      id,
    });
  };

  const onClickPlay = () => {
    setPlay(!play);
  };

  const onClickCheck = () => {
    videoDispatch({
      type: 'TOGGLE',
      id,
    });
  };

  const mergeNameElements = () => {
    let ret = '';
    if (game !== '') {
      ret += game + '-video';
    } else {
      ret += userConfig.games[0] + '-video';
    }

    if (resolution !== '') {
      ret += '-' + resolution;
    } else {
      ret += '-' + userConfig.resolutions[0];
    }

    if (date !== '') {
      ret += '-' + date;
    }

    if (userConfig.username !== '') {
      ret += '-' + userConfig.username;
    }

    if (isPlayScene) {
      ret += '-' + 'A1';
    }

    if (otherTags !== '') {
      if (isPlayScene) ret += otherTags;
      else ret += '-' + otherTags;
    }

    if (extra !== '') {
      ret += '-' + extra;
    }
    console.log(ret);
    setNewName(ret);
  };

  const onSetGame = (event) => {
    game = event.target.value;
    console.log(newName);
    mergeNameElements();
  };

  const onSetResolution = (event) => {
    resolution = event.target.value;
    console.log(resolution);
    mergeNameElements();
  };

  const onSetDate = (event) => {
    const _date = event.target.value.replace(/-/gi, '').substring(2);

    date = _date;
    mergeNameElements();
    console.log(newName);
  };

  const onSetPlayScene = (event) => {
    console.log(event.target.checked);
    isPlayScene = event.target.checked;
    mergeNameElements();
  };

  const onSetOtherTags = (event) => {
    otherTags = event.target.value;
    mergeNameElements();
  };

  const onSetExtra = (event) => {
    extra = event.target.value;
    mergeNameElements();
  };

  const onClickChangeName = () => {
    videoDispatch({
      type: 'MODIFY',
      id,
      newfilename: newName,
    });

    setEdit(false);
  };

  let URL = window.URL || window.webkitURL;
  let file = fileObject;
  let fileURL = URL.createObjectURL(file);

  return (
    <>
      {play && (
        <VideoPlayerBlock>
          <video width="640" height="480" autoPlay controls>
            <source src={fileURL} type="video/mp4" />
          </video>
        </VideoPlayerBlock>
      )}
      {edit && (
        <RenameInputFormPositioner>
          <RenameInputForm>
            <label>
              Game:
              <select name="games" autoComplete="true" onChange={onSetGame}>
                {userConfig.games.map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>
            </label>
            <label>
              resolution:
              <select
                name="resolution"
                autoComplete="true"
                onChange={onSetResolution}
              >
                {userConfig.resolutions.map((resolution) => (
                  <option key={resolution} value={resolution}>
                    {resolution}
                  </option>
                ))}
              </select>
            </label>
            <label>
              date:
              <input type="date" onChange={onSetDate} />
            </label>
            <label>
              play scene?
              <input type="checkbox" onChange={onSetPlayScene} />
            </label>
            <label>
              other tags:
              <input type="text" onChange={onSetOtherTags} />
            </label>
            <label>
              extra :
              <input type="text" onChange={onSetExtra} />
            </label>
            <span>Creator: {userConfig.username}</span>
            <span className="result">Result : {newName}</span>
            <Button onClick={onClickChangeName}>
              <MdDone />
            </Button>
          </RenameInputForm>
        </RenameInputFormPositioner>
      )}
      <VideoItemBlock finish={finish}>
        <CheckSquare check={check} onClick={onClickCheck}>
          {check && <MdDone />}
        </CheckSquare>
        <Text>
          {text}
          {newfilename && (
            <span>&nbsp;&nbsp;&nbsp;=====>&nbsp;&nbsp;&nbsp;{newfilename}</span>
          )}
          <Edit onClick={onClickEdit} edit={edit}>
            <MdEdit />
          </Edit>
        </Text>
        <Button onClick={onClickPlay}>
          {(play && <MdStop />) || <MdPlayArrow />}
        </Button>
        <Button onClick={onClickDownload}>
          <MdLaunch />
        </Button>
        <Button>
          <MdDelete onClick={onClickDelete} />
        </Button>
      </VideoItemBlock>
    </>
  );
}
