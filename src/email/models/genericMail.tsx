import { Body, Head, Html, Preview, Text } from '@react-email/components';
import * as React from 'react';
import parse from 'html-react-parser';

interface GenericMailProps {
  preview?: string;
  body: string;
}

export async function GenericMail({ preview, body }: GenericMailProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview} </Preview>
      <Body style={main}>
        <Text style={paragraph}>{parse(body)}</Text>
      </Body>
    </Html>
  );
}

const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '22px',
  color: '#3c4043',
};
