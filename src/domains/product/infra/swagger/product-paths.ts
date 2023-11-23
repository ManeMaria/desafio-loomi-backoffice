import {
  security,
  SwaggerContents,
  SwaggerPath,
  SwaggerSchemas,
  SwaggerTypes,
  SwaggerQuery,
  defaultFilterParams,
  defaultResponses,
  SwaggerResponse,
} from '@/shared/infra/swagger/helpers';

export const productTag = 'Product';

// Uncomment the next lines if you need
/*
* export const entityIncludedIntoProductObject = SwaggerTypes.object(false, [
*   ['id', SwaggerTypes.uuid(true)],
*   ['name', SwaggerTypes.string(true)],
* ]);
*/

export const productSchema = SwaggerSchemas.create('Product', [
  ['id', SwaggerTypes.uuid(true)],
  ['name', SwaggerTypes.string(true)],
  ['description', SwaggerTypes.string(true)],
  ['cost', SwaggerTypes.integer(true)],
  ['quantity', SwaggerTypes.integer(true)],
  ['enabled', SwaggerTypes.boolean(true)],
  // ['included_entity_name', SwaggerTypes.array(false, entityIncludedIntoProductObject, 100)],
  ['createdAt', SwaggerTypes.dateTime(true)],
  ['updatedAt', SwaggerTypes.dateTime(true)],
]);

export const productObject = SwaggerTypes.object(true, [
  ['id', SwaggerTypes.uuid(true)],
  ['name', SwaggerTypes.string(true)],
  ['description', SwaggerTypes.string(true)],
  ['cost', SwaggerTypes.integer(true)],
  ['quantity', SwaggerTypes.integer(true)],
  ['enabled', SwaggerTypes.boolean(true)],
  // ['included_entity_name', SwaggerTypes.array(false, entityIncludedIntoProductObject, 100)],
  ['createdAt', SwaggerTypes.dateTime(true)],
  ['updatedAt', SwaggerTypes.dateTime(true)],
]);

export const productPaths = {
  '/products': {
    get: {
      tags: [productTag],
      summary: 'Get Products',
      produces: ['application/json'],
      parameters: [
        ...SwaggerQuery.params([
          ['name', SwaggerTypes.string()],
          ['description', SwaggerTypes.string()],
          ['cost', SwaggerTypes.integer()],
          ['quantity', SwaggerTypes.integer()],
          ['enabled', SwaggerTypes.boolean()],
          ['createdAt', SwaggerTypes.dateTime()],
          ['updatedAt', SwaggerTypes.dateTime()],
        ]),
        ...defaultFilterParams,
      ],
      security,
      responses: {
        ...SwaggerResponse.ok(
          'Products found',
          SwaggerContents.applicationJson([
            ['items', SwaggerTypes.array(true, productObject, 100)],
            ['totalItemsListed', SwaggerTypes.integer()],
            ['totalItems', SwaggerTypes.integer()],
          ]),
        ),
        ...defaultResponses,
      },
    },
    post: {
      tags: [productTag],
      summary: 'Create a new product',
      produces: ['application/json'],
      requestBody: {
        content: SwaggerContents.applicationJson(
          [
            ['name', SwaggerTypes.string(true)],
            ['description', SwaggerTypes.string(true)],
            ['cost', SwaggerTypes.integer(true)],
            ['quantity', SwaggerTypes.integer(true)],
            ['enabled', SwaggerTypes.boolean()],

          ],
        ),
      },
      security,
      responses: {
        ...SwaggerResponse.created(
          'Product created',
          SwaggerContents.applicationJson([], [], productObject)
        ),
        ...defaultResponses,
      },
    },
  },
  '/products/{id}': {
    get: {
      tags: [productTag],
      summary: 'Get a Product',
      produces: ['application/json'],
      parameters: SwaggerPath.paths([['id', SwaggerTypes.uuid(), true]]),
      security,
      responses: {
        ...SwaggerResponse.ok(
          'Product found',
          SwaggerContents.applicationJson([], [], productObject)
        ),
        ...SwaggerResponse.notFound('Product not found'),
        ...defaultResponses,
      },
    },
    patch: {
      tags: [productTag],
      summary: 'Update a Product by id',
      produces: ['application/json'],
      parameters: SwaggerPath.paths([['id', SwaggerTypes.uuid(), true]]),
      requestBody: {
        content: SwaggerContents.applicationJson(
          [
            ['name', SwaggerTypes.string()],
            ['description', SwaggerTypes.string()],
            ['cost', SwaggerTypes.integer()],
            ['quantity', SwaggerTypes.integer()],
          ],
        ),
      },
      security,
      responses: {
        ...SwaggerResponse.ok(
          'Product updated',
          SwaggerContents.applicationJson([], [], productObject),
        ),
        ...SwaggerResponse.notFound('Product not found'),
        ...defaultResponses,
      },
    },
    delete: {
      tags: [productTag],
      summary: 'Delete a Product by id',
      produces: ['application/json'],
      parameters: SwaggerPath.paths([['id', SwaggerTypes.uuid(), true]]),
      security,
      responses: {
        ...SwaggerResponse.noContent(),
        ...SwaggerResponse.notFound('Product not found'),
        ...defaultResponses,
      },
    },
  },
};
