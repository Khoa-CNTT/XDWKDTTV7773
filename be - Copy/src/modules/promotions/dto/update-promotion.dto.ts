import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscountDto } from './create-promotion.dto';

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {}
