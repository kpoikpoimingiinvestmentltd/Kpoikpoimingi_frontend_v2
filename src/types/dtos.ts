import { z } from "zod";
import {
	LoginDto,
	RefreshTokenDto,
	PaginationDto,
	CreateNextOfKinDto,
	CreateGuarantorDto,
	CreateEmploymentDetailsDto,
	PropertyQuantityDto,
	CreatePropertyInterestRequestDto,
	MediaKeysDto,
	CreateCustomerDto,
	CreateCustomerInternalDto,
	PropertyQuantitySimpleDto,
	CreateFullPaymentDto,
	UpdateVATDto,
	UpdateInterestDto,
	UpdatePenaltyInterestDto,
	GenerateReceiptDto,
	SubCategoryDto,
	CreateCategoryDto,
	UpdateCategoryDto,
} from "../schemas/dtos";

export type LoginDtoType = z.infer<typeof LoginDto>;
export type RefreshTokenDtoType = z.infer<typeof RefreshTokenDto>;
export type PaginationDtoType = z.infer<typeof PaginationDto>;
export type CreateNextOfKinDtoType = z.infer<typeof CreateNextOfKinDto>;
export type CreateGuarantorDtoType = z.infer<typeof CreateGuarantorDto>;
export type CreateEmploymentDetailsDtoType = z.infer<typeof CreateEmploymentDetailsDto>;
export type PropertyQuantityDtoType = z.infer<typeof PropertyQuantityDto>;
export type CreatePropertyInterestRequestDtoType = z.infer<typeof CreatePropertyInterestRequestDto>;
export type MediaKeysDtoType = z.infer<typeof MediaKeysDto>;
export type CreateCustomerDtoType = z.infer<typeof CreateCustomerDto>;
export type CreateCustomerInternalDtoType = z.infer<typeof CreateCustomerInternalDto>;
export type PropertyQuantitySimpleDtoType = z.infer<typeof PropertyQuantitySimpleDto>;
export type CreateFullPaymentDtoType = z.infer<typeof CreateFullPaymentDto>;
export type UpdateVATDtoType = z.infer<typeof UpdateVATDto>;
export type UpdateInterestDtoType = z.infer<typeof UpdateInterestDto>;
export type UpdatePenaltyInterestDtoType = z.infer<typeof UpdatePenaltyInterestDto>;
export type GenerateReceiptDtoType = z.infer<typeof GenerateReceiptDto>;
export type SubCategoryDtoType = z.infer<typeof SubCategoryDto>;
export type CreateCategoryDtoType = z.infer<typeof CreateCategoryDto>;
export type UpdateCategoryDtoType = z.infer<typeof UpdateCategoryDto>;
