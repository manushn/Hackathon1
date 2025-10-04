import React from 'react'

function ClientProtectionRoute({children}) {
  const Token = sessionStorage.getItem('Token');

  if (!Token) {
    
    return <Navigate to="/verifyaccount" replace />;
    
  }

  return children;
};


export default ClientProtectionRoute
