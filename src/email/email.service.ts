import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { PrismaService } from 'src/prisma/prisma.service';
import { render } from '@react-email/render';
import { EmployeeIngressMail } from './models/employeeIngressMail';
import { GenericMail } from './models/genericMail';
import { debugLog } from 'src/helpers/utils/debugLog';
import { SysLogService } from 'src/syslog/syslog.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { formatISO, parseISO } from 'date-fns';
import { promises as fs } from 'fs';
import { join } from 'path';
import { UpdateEmailDto } from './dto/update-email.dto';
import { fixDateType } from 'src/helpers/database/fixDateType';
import { SettingService } from 'src/setting/setting.service';
import { MovimentService } from 'src/moviment/moviment.service';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

interface EmployeeMailProps {
  employeeName: string;
  genre: string;
  resources: string[];
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly baseDirectory = '/assets/images';
  constructor(
    private prismaService: PrismaService,
    private movimentService: MovimentService,
    private sysLogService: SysLogService,
    private settingService: SettingService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ACCOUNT, // SMTP username
        pass: process.env.EMAIL_PASSWORD, // SMTP password
      },
    });
    // this.transporter = nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT, // SMTP port
    //   secure: process.env.EMAIL_SECURE === 'true' ? true : false, // true for 465, false for other ports
    //   auth: {
    //     user: process.env.EMAIL_ACCOUNT, // SMTP username
    //     pass: process.env.EMAIL_PASSWORD, // SMTP password
    //   },
    // });
  }

  create(createEmailDto: CreateEmailDto) {
    if (createEmailDto.sentAt) {
      createEmailDto.sentAt = formatISO(parseISO(createEmailDto.sentAt));
    }
    try {
      return this.prismaService.email.create({
        data: createEmailDto,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findEmailById(id: string) {
    const response = await this.prismaService.email.findUniqueOrThrow({
      where: { id },
      include: {
        Moviment: true,
      },
    });

    return response;
  }

  async getEmailByStatus(status: string): Promise<CreateEmailDto[]> {
    const emails = await this.prismaService.email.findMany({
      where: {
        status: status,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // const fixedEmails = fixDateType(emails);
    const fixedEmails = emails.map((email) => {
      return {
        ...email,
        sentAt: formatISO(new Date(email.sentAt)),
        createdAt: formatISO(new Date(email.createdAt)),
      };
    });

    return fixedEmails;
  }

  async findAll() {
    const where = {
      include: {
        Moviment: {
          include: {
            Employee: true,
          },
        },
      },
    };

    const response = await this.prismaService.email.findMany(where);
    return response;
  }

  update(id: string, updateEmailDto: UpdateEmailDto) {
    if (updateEmailDto.sentAt) {
      updateEmailDto.sentAt = formatISO(parseISO(updateEmailDto.sentAt));
    }

    return this.prismaService.email.update({
      where: { id },
      data: updateEmailDto,
    });
  }

  remove(id: string) {
    return this.prismaService.email.delete({
      where: { id },
    });
  }

  async getImage(filename: string): Promise<Buffer> {
    const filePath = join(this.baseDirectory, filename);

    return fs.readFile(filePath);
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
    cc?: string,
    cco?: string,
  ): Promise<nodemailer.SentMessageInfo> {
    try {
      // console.log('this.transporter: ', this.transporter);

      const mailOptions: nodemailer.SendMailOptions = {
        from: `${process.env.EMAIL_DISPLAY_NAME} <${process.env.EMAIL_ACCOUNT}>`, // sender address
        to: to, // list of receivers
        cc: cc,
        bcc: cco,
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
      };
      this.transporter.sendMail(mailOptions);
      await this.sysLogService.createSysLog({
        action: `Envio de e-mail`,
        message: `Para: ${to}`,
        file: 'email.service.ts',
      });
    } catch (error) {
      debugLog('error: ', error);
      await this.sysLogService.createSysLog({
        action: `Envio de e-mail para ${to}`,
        message: `Error: ${error.message}`,
        file: 'email.service.ts',
      });
      return null;
    }
  }

  async sendCreatedMail(
    id: string,
    to: string,
    subject: string,
    text: string,
    html?: string,
    scriptId?: string,
    cc?: string,
    cco?: string,
  ): Promise<nodemailer.SentMessageInfo> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: `${process.env.EMAIL_DISPLAY_NAME} <${process.env.EMAIL_ACCOUNT}>`, // sender address
        to: to, // list of receivers
        cc: cc,
        bcc: cco,
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
      };
      this.transporter.sendMail(mailOptions);

      await this.update(id, { status: 'Enviado' });

      if (scriptId) {
        await this.prismaService.script.update({
          where: {
            id: scriptId,
          },
          data: {
            status: 'Concluído',
          },
        });

        /**
         * Alterar o statu da movimentação para 'Concluído':  */
        const { movimentId } = await this.prismaService.email.findUnique({
          where: {
            id: id,
          },
          select: {
            movimentId: true,
          },
        });

        await this.movimentService.updateStatus(movimentId, 'Concluído');
      }
    } catch (error) {
      debugLog('error: ', error);
      await this.sysLogService.createSysLog({
        action: `Envio de e-mail para ${to}`,
        message: `Error: ${error.message}`,
        file: 'email.service.ts',
      });
      return null;
    }
  }

  /**
   * Objetivos:
   *  1) buscar todos os scripts com:
   *    - script.movimentId == movimentId
   *    - script.status = 'Concluído'
   *    - filtrar os scripts cujo templateId esteja marcado com 'send_email_employee'
   *
   *  2) gerar e enviar o email
   *    - to: buscar o email do funcionário
   *    - buscar o template do email
   *    - buscar os recursos do template
   *    - renderizar o email
   *    - enviar o email
   */
  async createMailToEmployeeByMoviment(movimentIds: string[]) {
    let emailData: EmployeeMailProps;
    try {
      // Para cada movimentId passado, buscar os scripts concluídos
      movimentIds.map(async (movimentId) => {
        const scripts = await this.prismaService.script.findMany({
          where: {
            movimentId,
          },
          include: {
            Template: true,
          },
          orderBy: {
            number: 'asc',
          },
        });

        /**
         * Filtra para verificar se todos os scripts do movimento estão com status
         * 'Concluído', 'Executando' e/ou 'Cancelado'
         */
        const concludedScripts = scripts.filter((script) =>
          ['Concluído', 'Executando', 'Cancelado'].includes(script.status),
        );

        // Prossegue somente se todos os scripts do movimento estiverem no filtro
        if (scripts.length != concludedScripts.length) {
          return;
        }

        /**
         * E-MAILS PARA SERVIDORES:
         * Filtra novamente retornando somente os scripts com status 'Concluído' ou 'Executando' e cujo
         * Template esteja marcado com ('send_email' = true)
         */
        const filteredEmployeedScripts = concludedScripts.filter((script) => {
          return (
            ['Concluído', 'Executando'].includes(script.status) &&
            script.Template.sendEmail
          );
        });

        const promises = [];
        if (filteredEmployeedScripts.length > 0) {
          // Buscar dados do servidor (employee) vinculado à movimentação
          const moviment = await this.prismaService.moviment.findUnique({
            where: {
              id: movimentId,
            },
            include: {
              Employee: true,
            },
          });

          if (!moviment) {
            return;
          }

          const employeeName = moviment.Employee.name.split(' ')[0]; // primeiro nome do funcionário
          const employeeEmail = moviment.Employee.email;
          const emailContents = filteredEmployeedScripts
            .map((script) => {
              if (script.emailContent) return script.emailContent;
            })
            .filter((content) => content !== undefined);

          emailData = {
            employeeName,
            genre: moviment.Employee.sex === 'Masculino' ? 'o' : 'a',
            resources: emailContents,
          };

          const html = render(await EmployeeIngressMail(emailData));
          const to = employeeEmail;
          const subject = 'Boas-vindas e credenciais de acesso';
          const text = '';

          const alreadyExists = await this.prismaService.email.findFirst({
            where: {
              movimentId: movimentId,
              to: to,
            },
          });

          if (!alreadyExists) {
            const promise = await this.prismaService.email.create({
              data: {
                movimentId: movimentId,
                scriptId: '',
                to: to,
                cc: '',
                cco: '',
                subject: subject,
                preview: subject,
                text: text,
                html: await html,
                status: 'Pendente',
                uniqueKey: movimentId + '-' + to,
              },
            });

            promises.push(promise);
          }
        }

        Promise.all(promises)
          .then(async (emails) => emails.filter((email) => email !== undefined))
          .then(async (emails) => {
            return await this.prismaService.email.createManyAndReturn({
              data: emails,
              skipDuplicates: true,
            });
          });
      });
    } catch (error) {
      debugLog('error: ', error);
      await this.sysLogService.createSysLog({
        action: 'Criação de e-mails por movimentação',
        message: `Error: ${error.message}`,
        file: 'email.service.ts',
      });
    }
  }

  async createMailToThirdByMoviment(movimentIds: string[]) {
    try {
      // Para cada movimentId passado, buscar os scripts
      movimentIds.map(async (movimentId) => {
        const scripts = await this.prismaService.script.findMany({
          where: {
            movimentId,
          },
          include: {
            Template: true,
          },
        });

        /**
         * EMAILS PARA TERCEIROS
         * Filtra retornando somente os scripts com status 'Pendente' e tipo "E-mail para Terceiros"
         */
        const thirdFilteredScripts = scripts.filter((script) => {
          return (
            script.status === 'Pendente' &&
            script.scriptType === 'E-mail para Terceiros'
          );
        });

        if (thirdFilteredScripts.length > 0) {
          const promises = thirdFilteredScripts.map(async (script) => {
            // Buscar os dados do template
            let scriptContent = script.scriptContent.replace(
              /(\r\n|\n|\r)/gm,
              '',
            );
            scriptContent = JSON.parse(scriptContent);

            if (
              scriptContent['to'] &&
              scriptContent['subject'] &&
              scriptContent['body']
            ) {
              const preview = scriptContent['preview']
                ? (scriptContent['preview'] as string)
                : '';
              const to = scriptContent['to'] as string;
              const cc = scriptContent['cc'] as string;
              const cco = scriptContent['cco'] as string;
              const subject = scriptContent['subject'] as string;
              const body = scriptContent['body'] as string;
              const html = await render(await GenericMail({ preview, body }));
              const text = '';
              const uniqueKey = movimentId + '-' + to;

              return {
                movimentId: movimentId,
                scriptId: script.id,
                preview: preview,
                to: to,
                cc: cc,
                cco: cco,
                subject: subject,
                text: text,
                html: html,
                status: 'Pendente',
                uniqueKey: uniqueKey,
              };
            }
          });

          const createdEmails = await Promise.all(promises)
            .then(async (emails) =>
              emails.filter((email) => email !== undefined),
            )
            .then(async (emails) => {
              return await this.prismaService.email.createManyAndReturn({
                data: emails,
                skipDuplicates: true,
              });
            });

          const setting = await this.settingService.getAllSetting();
          if (setting.scriptExecuteEmailSendAfterCreate) {
            createdEmails.map((email) => {
              return this.sendEmailById([email.id]);
            });
          }
        }
      });
    } catch (error) {
      debugLog('error: ', error);
      await this.sysLogService.createSysLog({
        action: 'Criação de e-mails por movimentação',
        message: `Error: ${error.message}`,
        file: 'email.service.ts',
      });
    }
  }

  async sendEmailById(emailIds: string[]) {
    try {
      const emails = await this.prismaService.email.findMany({
        where: { id: { in: emailIds } },
      });

      //where: { id: 'clz0qw61g000pvs1o9zf936my' },
      if (emails.length === 0) {
        return;
      }

      const fixedEmails = emails.map(
        (email) => fixDateType(email) as CreateEmailDto,
      );

      fixedEmails.map(async (email) => {
        if (email) {
          const { id, to, subject, text, html, scriptId, cc, cco } = email;
          await this.sendCreatedMail(
            id,
            to,
            subject,
            text,
            html,
            scriptId,
            cc,
            cco,
          );
        }
      });
    } catch (error) {
      debugLog('error: ', error);
      await this.sysLogService.createSysLog({
        action: `Envio de e-mail.`,
        message: `Error: ${error.message}`,
        file: 'email.service.ts',
      });
    }
  }

  /**
   * Objetivos:
   *  1) buscar todos os scripts com:
   *    - script.status = 'Pendente'
   *    - filtrar os scripts cujo templateId sejam do tipo 'E-mail para terceiros'
   *
   *  2) gerar e enviar o email
   *    - buscar os dados (to, subject, body) do template
   *    - renderizar o email
   *    - enviar o email
   *    - atualizar o status do script para 'Concluído'
   */
  async sendMailToThirdByPendingScriptStatus(): Promise<string[]> {
    try {
      const scripts = await this.prismaService.script.findMany({
        where: {
          status: 'Pendente',
          scriptType: 'E-mail para Terceiros',
        },
      });

      // Prossegue somente se existirem scripts nas condições especificadas
      if (scripts.length === 0) {
        return;
      }

      const preview =
        'E-mail automático enviado pela Câmara Municipal de São José';

      scripts.map(async (script) => {
        // Buscar os dados do template
        let scriptContent = script.scriptContent.replace(/(\r\n|\n|\r)/gm, '');
        scriptContent = JSON.parse(scriptContent);
        const to = scriptContent['to'] as string;
        const subject = scriptContent['subject'] as string;
        const body = scriptContent['body'] as string;
        const html = render(await GenericMail({ preview, body }));
        const text = '';

        if (!to) {
          return;
        }

        this.sendMail(to, subject, text, await html);
      });

      // Retorna os ids dos scripts de emails enviados
      return scripts.map((script) => script.id);
    } catch (error) {
      debugLog('error: ', error);
      await this.sysLogService.createSysLog({
        action: 'Envio de e-mail para terceiros',
        message: `Error: ${error.message}`,
        file: 'email.service.ts',
      });
    }
  }
}
