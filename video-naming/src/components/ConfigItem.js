import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { MdDoNotDisturbOn } from 'react-icons/md';
import { useUserConfig, useUserConfigDispatch } from '../VideoDataContext';

const CheckSquare = styled.div`
  width: 24px;
  height: 24px;
  color: red;
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

const ConfigItemBlock = styled.div`
  display: flex;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;

  &:hover {
    background: orange;
  }
`;

export default function ConfigItem({ name }) {
  const userDispatch = useUserConfigDispatch();

  const onClickDelete = () => {
    userDispatch({
      type: 'REMOVE_GAME',
      game: name,
    });
  };

  return (
    <ConfigItemBlock>
      <CheckSquare onClick={onClickDelete}>
        <MdDoNotDisturbOn />
      </CheckSquare>
      <Text>{name}</Text>
    </ConfigItemBlock>
  );
}
