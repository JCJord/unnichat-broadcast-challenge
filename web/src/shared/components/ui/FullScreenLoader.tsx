import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export const FullScreenLoader: React.FC = () => (
  <div className="min-h-screen bg-dark-bg flex items-center justify-center">
    <CircularProgress size={32} />
  </div>
);
