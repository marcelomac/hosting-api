import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-department.dto';

/**
 * A função PartialType() retorna um tipo (classe) com todas as propriedades do tipo
 * de entrada (create), PORÉM DEFINIDAS COMO OPCIONAIS.
 * Isso permite passar apenas as propriedades que precisam ser atualizadas, ou seja, as
 * propriedades obrigatórias em create não são mais obrigatórias em update. *
 */
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
