import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { MdAdd } from 'react-icons/md';
import { useVideoDataDispatch, useNextId } from '../VideoDataContext';

const AddVideoButton = styled.button`
  background: #38d9a9;
  &:hover {
    background: #63e6be;
  }

  &:active {
    background: #20c997;
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
export default function AddVideo() {
  const [open, setOpen] = useState(false);
  const dispatch = useVideoDataDispatch();
  const nextId = useNextId();

  let files = [];

  const onToggle = () => {
    setOpen(!open);
  };

  const onChange = (e) => {
    files = [];
    let i = 0;
    for (i = 0; i < e.target.files.length; ++i) {
      console.log(e.target.files[i]);
      files = files.concat(e.target.files[i]);
    }
    console.log(files);
    console.log(typeof files);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let inputData = [];
    // eslint-disable-next-line array-callback-return
    files.map((file) => {
      inputData = inputData.concat({
        id: nextId.current,
        filename: file.name,
        newfilename: null,
        filepath: file.path,
        file_object: file,
        check: true,
      });
      nextId.current += 1;
      console.log(nextId.current);
    });
    console.log(inputData);
    dispatch({
      type: 'ADD',
      data: inputData,
    });
    setOpen(false);
  };

  return (
    <>
      {open && (
        <InsertFormPositioner>
          <InsertForm onSubmit={onSubmit}>
            <Input
              id="input"
              type="file"
              multiple
              onChange={onChange}
              accept="video/*"
            />
            <Submit type="submit" />
          </InsertForm>
        </InsertFormPositioner>
      )}
      <AddVideoButton open={open} onClick={onToggle}>
        <MdAdd />
      </AddVideoButton>
    </>
  );
}
