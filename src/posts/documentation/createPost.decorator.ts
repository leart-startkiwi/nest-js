import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CreatePostDocumentation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Creates a new blog post',
    }),
    ApiResponse({
      status: 201,
      description:
        'You get a 201 response if your post is created successfully',
    }),
  );
}
