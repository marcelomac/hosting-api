import { getMiddleInitialsOfName } from 'src/helpers/utils/getMiddleInitialsOfName';
import { CreateMovimentFullDto } from 'src/moviment/dto/create-moviment-full.dto';
import * as dotenv from 'dotenv';

dotenv.config();

export function getScriptsValue(
  powerShellVar: string,
  moviment: CreateMovimentFullDto,
): string {
  switch (powerShellVar) {
    case '%ldap_domain%':
      return process.env.LDAP_DOMAIN;
    case '%employee_login%':
      return moviment.Employee.login;
    case '%employee_password%':
      return moviment.Employee.password;
    case '%employee_fullname%':
      return moviment.Employee.name;
    case '%employee_firstname%':
      return moviment.Employee.name.split(' ')[0];
    case '%employee_initials%':
      return getMiddleInitialsOfName(moviment.Employee.name);
    case '%employee_surname%':
      return moviment.Employee.name.split(' ')[
        moviment.Employee.name.split(' ').length - 1
      ];
    case '%employee_cpf%':
      return moviment.Employee.cpf;
    case '%employee_phone%':
      return moviment.Employee.phone;
    case '%employee_email%':
      return moviment.Employee.email;
    case '%employee_sex%':
      return moviment.Employee.sex;
    case '%employee_birthdate%':
      return moviment.Employee.birthdate;
    case '%relationship_name%':
      return moviment.Relationship.name;
    case '%relationship_description%':
      return moviment.Relationship.description;
    case '%department_name%':
      return moviment.Department.name;
    case '%department_description%':
      return moviment.Department.description;
    case '%department_folderPath%':
      return moviment.Department.folderPath;
    case '%department_ldapGroupName%':
      return moviment.Department.ldapGroupName;
    case '%department_ldapGroupOU%':
      return moviment.Department.ldapGroupOU;
    case '%department_phone%':
      return moviment.Department.phone;
    case '%company_name%':
      return process.env.LDAP_COMPANY;
    case '%ldap_users_ou%':
      return process.env.LDAP_USERS_OU;
  }
}
