import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { MdAdd } from 'react-icons/md';
import { useUserConfigDispatch } from '../VideoDataContext';

const AddVideoButton = styled.button`
  background: #f9ff5f;
  &:hover {
    background: #fcffb7;
  }

  &:active {
    background: #d6df00;
  }

  z-index: 5;
  cursor: pointer;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  left: 50%;
  bottom: 0%;
  transform: translate(-50%, 50%);

  font-size: 150px;
  color: #000;
  border-radius: 40px;
  border: none;
  outline: none;

  transition: 0.125s all ease-in;

  ${(props) =>
    props.open &&
    css`
      background: #ff6b6b;
      &:hover {
        background: #ff8787;
      }

      &:active {
        background: #fa5252;
      }

      transform: translate(-50%, 50%) rotate(45deg);
    `};
`;

const InsertFormPositioner = styled.div`
  width: 100%;
  bottom: 0%;
  left: 0;
  position: absolute;
`;

const InsertForm = styled.form`
  background: #f8f9fa;
  width: 100%;
  padding: 32px;
  padding-bottom: 72px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-top: 1px solid #e9ecef;
  text-align: center;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  outline: none;
  font-size: 18px;
  box-sizing: border-box;
`;

const Submit = styled.input`
  padding: 12px;
  margin-left: 15px;
  font-size: 18px;
  background: #38d9a9;
  border-radius: 4px;
  border: 1px solid #dee2e6;

  &:hover {
    background: #63e6be;
  }

  &:active {
    background: #20c997;
  }
`;
export default function AddData() {
  const [open, setOpen] = useState(false);
  const dataDispatch = useUserConfigDispatch();

  let newGameStr;
  let newResolutionStr;

  const onToggle = () => {
    setOpen(!open);
  };

  const onChangeGameText = (e) => {
    newGameStr = e.target.value;
  };

  const onSubmitNewGame = (e) => {
    e.preventDefault();
    dataDispatch({
      type: 'ADD_GAME',
      game: newGameStr,
    });
    newGameStr = null;
  };

  const onChangeResolutionText = (e) => {
    newResolutionStr = e.target.value;
  };

  const onSubmitNewResolution = (e) => {
    e.preventDefault();
    dataDispatch({
      type: 'ADD_RESOLUTION',
      resolution: newResolutionStr,
    });
    newResolutionStr = null;
  };

  return (
    <>
      {open && (
        <InsertFormPositioner>
          <InsertForm onSubmit={onSubmitNewGame}>
            <label>
              New Game : &nbsp;&nbsp;
              <Input id="text" onChange={onChangeGameText} />
              <Submit type="submit" />
            </label>
          </InsertForm>
          <InsertForm onSubmit={onSubmitNewResolution}>
            <label>
              New Resolutions : &nbsp;&nbsp;
              <Input id="text" onChange={onChangeResolutionText} />
              <Submit type="submit" />
            </label>
          </InsertForm>
        </InsertFormPositioner>
      )}
      <AddVideoButton open={open} onClick={onToggle}>
        <MdAdd />
      </AddVideoButton>
    </>
  );
}
