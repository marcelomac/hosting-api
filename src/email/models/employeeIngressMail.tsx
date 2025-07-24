import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import parse from 'html-react-parser';

interface EmployeeMailProps {
  employeeName: string;
  genre: string;
  resources: string[];
}

export async function EmployeeIngressMail({
  employeeName,
  genre,
  resources,
}: EmployeeMailProps) {
  return (
    <Html>
      <Head />
      <Preview>Orientações e credenciais de acesso aos recursos de TI</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Row>
              <Column>
                <Img
                  style={headerBlue}
                  src={
                    'https://react-email-demo-dr9excyry-resend.vercel.app/static/google-play-header.png'
                  }
                  width="305"
                  height="28"
                  alt="Cabeçalho de página azul"
                />
                <Img
                  style={sectionLogo}
                  src={`https://www.cmsj.sc.gov.br/news/2024/07/2024071318532417209076040f1d80.png`}
                  width="200"
                  height="70"
                  alt="Logo da Câmara Municipal de São José"
                />
              </Column>
            </Row>
          </Section>

          <Section style={paragraphContent}>
            <Hr style={hr} />
            <Text style={heading}>BOAS VINDAS E INFORMAÇÕES IMPORTANTES</Text>
            <Text style={paragraph}>
              <strong>
                {`${employeeName}, seja bem-vind${genre} à Câmara Municipal de São José!`}
              </strong>
            </Text>

            <Text style={paragraph}>
              Esperamos que sua trajetória conosco seja repleta de sucesso e
              realizações. Para facilitar sua integração e proporcionar um
              entendimento mais profundo sobre a Câmara Municipal de São José,
              recomendamos que acesse nosso portal oficial através do link{' '}
              <Link href="https://www.cmsj.sc.gov.br" style={link}>
                www.cmsj.sc.gov.br.{' '}
              </Link>
              No site, você encontrará informações úteis sobre a história da
              Câmara, sua estrutura organizacional, notícias atualizadas, leis,
              regimento interno, detalhes sobre os vereadores e muito mais.
            </Text>

            <Text style={paragraph}>
              Além disso, recomendamos fortemente que você dedique algum tempo
              para conhecer a nossa{' '}
              <Link
                href="https://www.cmsj.sc.gov.br/proposicoes/pesquisa/0/1/0/30768"
                style={link}
              >
                Política de Segurança de Tecnologia da Informação.{' '}
              </Link>
              Esta resolução estabelece boas práticas referentes à utilização de
              equipamentos, softwares, contas de e-mails institucionais (quando
              for o caso) e demais temas relacionados aos recursos de TI da
              Câmara Municipal de São José.
            </Text>

            <Hr style={hr} />
          </Section>

          <Section style={paragraphContent}>
            <Text style={heading}>
              SUAS CREDENCIAIS DE ACESSO E ORIENTAÇÕES INICIAIS
            </Text>
            <Text style={paragraph}>
              Abaixo estão as suas credenciais de acesso à nossa rede de
              computadores e aos demais recursos de TI.
            </Text>

            <Text style={paragraph}>
              <strong>Atenção!</strong> É muito importante que você guarde essas
              informações em um local seguro e não as compartilhe com ninguém.
            </Text>
          </Section>

          {resources.map((resource, index) => {
            return (
              <Section key={index} style={paragraphContent}>
                <Text style={paragraph}>{parse(resource)}</Text>
              </Section>
            );
          })}

          <Section style={paragraphContent}>
            <Text style={paragraph}>
              Qualquer dúvida ou necessidade, estamos à disposição para
              ajudá-lo.
            </Text>
            <Text style={{ ...paragraph, fontSize: '20px' }}>
              Equipe de Tecnologia da Informação
            </Text>
          </Section>

          <Section style={containerContact}>
            <Row>
              <Text style={paragraph}>Conecte-se às nossas redes sociais</Text>
            </Row>
            <Row
              align="left"
              style={{
                width: '84px',
                float: 'left',
              }}
            >
              <Column style={{ paddingRight: '4px' }}>
                <Link href="https://www.facebook.com/camarasj">
                  <Img
                    width="28"
                    height="28"
                    src={`https://img.icons8.com/?size=100&id=13912&format=png&color=000000`}
                  />
                </Link>
              </Column>
              <Column style={{ paddingRight: '4px' }}>
                <Link href="https://www.twitter.com/camarasaojose">
                  <Img
                    width="24"
                    height="24"
                    src={`https://img.icons8.com/?size=100&id=phOKFKYpe00C&format=png&color=000000`}
                  />
                </Link>
              </Column>
              <Column style={{ paddingRight: '4px' }}>
                <Link href="https://www.instagram.com/camarasaojose">
                  <Img
                    width="28"
                    height="28"
                    src={`https://img.icons8.com/?size=100&id=32323&format=png&color=000000`}
                  />
                </Link>
              </Column>
              <Column style={{ paddingRight: '4px' }}>
                <Link href="https://www.youtube.com/channel/UC7mpF6uy0MkwvE5jYPkWuug">
                  <Img
                    width="28"
                    height="28"
                    src={`https://img.icons8.com/?size=100&id=19318&format=png&color=000000`}
                  />
                </Link>
              </Column>
            </Row>
            <Row>
              <Img
                style={footer}
                width="540"
                height="48"
                src={`https://react-email-demo-dr9excyry-resend.vercel.app/static/google-play-footer.png`}
              />
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#dbddde',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const sectionLogo = {
  padding: '0 40px',
};

const headerBlue = {
  marginTop: '-1px',
};

const container = {
  margin: '30px auto',
  backgroundColor: '#fff',
  borderRadius: 5,
  overflow: 'hidden',
};

const containerContact = {
  backgroundColor: '#f0fcff',
  borderRadius: '5px',
  overflow: 'hidden',
  paddingLeft: '20px',
};

const heading = {
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: '700',
  color: '#004dcf',
};

const paragraphContent = {
  padding: '0 40px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '22px',
  color: '#3c4043',
};

const link = {
  ...paragraph,
  color: '#004dcf',
};

const hr = {
  borderColor: '#e8eaed',
  margin: '20px 0',
};

const footer = {
  maxWidth: '100%',
};
