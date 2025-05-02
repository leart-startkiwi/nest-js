import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function GetUsersDocumentation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Fetches a list of registered users on the application',
    }),
    ApiResponse({
      status: 200,
      description: 'Users fetched successfully based on the query',
    }),
    ApiQuery({
      name: 'limit',
      type: 'number',
      required: false,
      description: 'The number of entries returned per query',
      example: 10,
    }),
    ApiQuery({
      name: 'page',
      type: 'number',
      required: false,
      description:
        'The position of the page number that you want the API to return',
      example: 1,
    }),
  );
}
