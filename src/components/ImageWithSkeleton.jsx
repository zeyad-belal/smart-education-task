import React, { useState } from 'react';
import { Skeleton } from 'antd';

export default function ImageWithSkeleton({ src, alt, style, className }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', ...style }} className={className}>
      {!loaded && (
        <Skeleton.Image
          active
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          display: loaded ? 'block' : 'none',
          objectFit: 'cover',
          borderRadius: 8
        }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}