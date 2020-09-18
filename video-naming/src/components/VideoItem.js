import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Select from 'react-select';
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

  .result {
    display: block;
    background: red;
  }
`;
const UpperInputGroup = styled.div`
  display: flex;
`;

const UnderInputGroup = styled.div`
  display: flex;
  margin-bottom: 10px;
  label + span {
    margin-left: 10px;
  }
`;

const GameSelect = styled.div`
  margin: 10px;
  width: 250px;
  .select-label {
    font-size: 20px;
  }
`;

const TagSelect = styled.div`
  margin: 10px;
  width: 150px;
  .select-label {
    font-size: 20px;
  }
`;

let game = '';
let resolution = '';
let date = '';
let tags = '';
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
    tags = '';
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

    if (tags !== '') {
      ret += '-' + tags;
    }

    if (extra !== '') {
      ret += '-' + extra;
    }
    console.log(ret);
    setNewName(ret);
  };

  const onSetGame = (event) => {
    game = event.value;
    mergeNameElements();
    console.log(newName);
  };

  const onSetResolution = (event) => {
    resolution = event.value;
    mergeNameElements();
    console.log(resolution);
  };

  const onSetDate = (event) => {
    const _date = event.target.value.replace(/-/gi, '').substring(2);

    date = _date;
    mergeNameElements();
    console.log(newName);
  };

  const onSetTag = (event) => {
    console.log(event);
    tags = '';
    event.map((tag) => {
      if (tags === '') tags += tag.value;
      else tags += `@${tag.value}`;
    });
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
            <UpperInputGroup>
              <GameSelect>
                <label className="select-label">
                  Game:
                  <Select
                    name="game"
                    options={userConfig.games.map((game) => {
                      return { value: game, label: game };
                    })}
                    onChange={onSetGame}
                  />
                </label>
              </GameSelect>
              <TagSelect>
                <label className="select-label">
                  Resolution:
                  <Select
                    name="resolution"
                    options={userConfig.resolutions.map((resolution) => {
                      return { value: resolution, label: resolution };
                    })}
                    onChange={onSetResolution}
                  />
                </label>
              </TagSelect>
              <TagSelect>
                <label className="select-label">
                  date:
                  <br />
                  <input type="date" onChange={onSetDate} height="38px" />
                </label>
              </TagSelect>

              <TagSelect>
                <label className="select-label">
                  tag:
                  <Select
                    isMulti
                    name="tag"
                    options={userConfig.tags.map((tag) => {
                      return { value: tag, label: tag };
                    })}
                    onChange={onSetTag}
                  />
                </label>
              </TagSelect>
            </UpperInputGroup>
            <UnderInputGroup>
              <label>
                extra :
                <input type="text" onChange={onSetExtra} />
              </label>
              <span>Creator: {userConfig.username}</span>
            </UnderInputGroup>

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
