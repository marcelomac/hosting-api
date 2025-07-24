import { Text } from '@react-email/components';
import * as React from 'react';

export function SoftcamResource() {
  const user = 'johnd';
  const password = 'xyz456';
  return (
    <>
      <Text style={heading}>Sistema Softcam</Text>
      <Text style={paragraph}>
        usuário: <strong>{user} </strong>
        senha: <strong>{password}</strong>
      </Text>
    </>
  );
}

const heading = {
  fontSize: '14px',
  lineHeight: '26px',
  fontWeight: '700',
  color: '#004dcf',
};

const paragraph = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#3c4043',
};
