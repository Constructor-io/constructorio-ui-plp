import React from 'react';
import StoryPreview from './StoryPreview';

export default function KitchenSinkDecorator(Story: any) {
  return (
    <div>
      <StoryPreview Component={Story} />
    </div>
  );
}
