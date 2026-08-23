import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto';


interface ApiStandardResponseOptions {
  isArray?: boolean;
  description?: string;
}

//<---------- ApiStandardResponse -------------->
export const ApiStandardResponse = <TModel extends Type<unknown>>(
  model: TModel,
  options: ApiStandardResponseOptions = {},
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, model),
    ApiOkResponse({
      description: options.description ?? 'Berhasil',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: options.isArray
                ? { type: 'array', items: { $ref: getSchemaPath(model) } }
                : { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};
