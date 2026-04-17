import React from 'react';
import { GoogleLogin, googleLogout, CredentialResponse } from '@react-oauth/google';

interface Props {
  onSuccess: (token: string) => void;
}

const GoogleLoginButton: React.FC<Props> = ({ onSuccess }) => {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
          onSuccess(credentialResponse.credential);
        }
      }}
      onError={() => {
        alert('Erro ao autenticar com Google');
      }}
    />
  );
};

export default GoogleLoginButton;
