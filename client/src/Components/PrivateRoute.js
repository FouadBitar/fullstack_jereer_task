import React from 'react';
import { Route, Navigate } from 'react-router-dom';

function PrivateRoute({ auth, children }) {
  return auth ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
