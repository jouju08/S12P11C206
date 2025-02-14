import React from 'react';

const LoadingText = ({ loading }) => {
  if (loading === -1) {
    return null;
  } else if (loading === 0) {
    return <span>🔄</span>;
  } else if (loading === 1) {
    return <span>✅</span>;
  }
  return null;
};

export default LoadingText;
