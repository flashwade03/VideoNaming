import React from 'react';
import styled from 'styled-components';
import VideoItem from './VideoItem';
import {
  useVideoData,
  useVideoDataDispatch,
  useNextId,
} from '../VideoDataContext';

const ItemListBlock = styled.div`
  flex: 1;
  padding: 20px 32px;
  padding-bottom: 48px;
  overflow-y: auto;
`;

let dragging = false;

export default function ItemList() {
  const { videos } = useVideoData();
  const dispatch = useVideoDataDispatch();
  const nextId = useNextId();

  document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!dragging) return;

    let inputData = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const f of event.dataTransfer.files) {
      if (f.type !== 'video/mp4') continue;
      inputData = inputData.concat({
        id: nextId.current,
        filename: f.name,
        newfilename: null,
        filepath: f.path,
        file_object: f,
        check: true,
      });
      nextId.current += 1;
    }
    console.log(inputData);
    dispatch({
      type: 'ADD',
      data: inputData,
    });

    dragging = false;
  });

  document.addEventListener('dragenter', (event) => {
    dragging = true;
  });

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  return (
    <ItemListBlock>
      {videos.map((video) => (
        <VideoItem
          key={video.id}
          id={video.id}
          text={video.filename}
          newfilename={video.newfilename}
          filePath={video.filepath}
          fileObject={video.file_object}
          check={video.check}
        />
      ))}
    </ItemListBlock>
  );
}
