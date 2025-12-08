
import React from 'react';
import { Navigate } from 'react-router-dom';

// This file is deprecated in favor of features/cinplace/pages/CinPlaceListPage.tsx
// Redirecting to the new route structure just in case this component is imported directly elsewhere
const CinPlace = () => {
  return <Navigate to="/app/cinplace" replace />;
};

export default CinPlace;
