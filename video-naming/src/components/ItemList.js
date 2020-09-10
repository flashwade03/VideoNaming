import React from 'react';
import styled from 'styled-components';
import VideoItem from './VideoItem';
import { useVideoData } from '../VideoDataContext';

const ItemListBlock = styled.div`
  flex: 1;
  padding: 20px 32px;
  padding-bottom: 48px;
  overflow-y: auto;
`;

export default function ItemList() {
  const { videos } = useVideoData();

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
