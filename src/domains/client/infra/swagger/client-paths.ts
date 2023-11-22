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

export const clientTag = 'Client';

// Uncomment the next lines if you need
/*
* export const entityIncludedIntoClientObject = SwaggerTypes.object(false, [
*   ['id', SwaggerTypes.uuid(true)],
*   ['name', SwaggerTypes.string(true)],
* ]);
*/

export const clientSchema = SwaggerSchemas.create('Client', [
  ['id', SwaggerTypes.uuid(true)],
  ['name', SwaggerTypes.string(true)],
  ['contact', SwaggerTypes.string(true)],
  ['address', SwaggerTypes.string(true)],
  // ['included_entity_name', SwaggerTypes.array(false, entityIncludedIntoClientObject, 100)],
  ['created_at', SwaggerTypes.dateTime(true)],
  ['updated_at', SwaggerTypes.dateTime(true)],
]);

export const clientObject = SwaggerTypes.object(true, [
  ['id', SwaggerTypes.uuid(true)],
  ['name', SwaggerTypes.string(true)],
  ['contact', SwaggerTypes.string(true)],
  ['address', SwaggerTypes.string(true)],
  // ['included_entity_name', SwaggerTypes.array(false, entityIncludedIntoClientObject, 100)],
  ['created_at', SwaggerTypes.dateTime(true)],
  ['updated_at', SwaggerTypes.dateTime(true)],
]);

export const clientPaths = {
  '/clients': {
    get: {
      tags: [clientTag],
      summary: 'Get Clients',
      produces: ['application/json'],
      parameters: [
        ...SwaggerQuery.params([
          ['name', SwaggerTypes.string(false, 'César Damasceno')],
          ['contact', SwaggerTypes.string(false, '5511999999999')],
          ['address', SwaggerTypes.string(false, 'Avenida Carandiru')],
          ['enabled', SwaggerTypes.boolean(false)],
        ]),
        ...defaultFilterParams,
      ],
      security,
      responses: {
        ...SwaggerResponse.ok(
          'Clients found',
          SwaggerContents.applicationJson([
            ['items', SwaggerTypes.array(true, clientObject, 100)],
            ['totalItemsListed', SwaggerTypes.integer()],
            ['totalItems', SwaggerTypes.integer()],
          ]),
        ),
        ...defaultResponses,
      },
    },
    post: {
      tags: [clientTag],
      summary: 'Create a new client',
      produces: ['application/json'],
      requestBody: {
        content: SwaggerContents.applicationJson(
          [
            ['name', SwaggerTypes.string(true, 'César Damasceno')],
            ['contact', SwaggerTypes.string(true, '5511999999999')],
            ['address', SwaggerTypes.string(true, 'Avenida Carandiru')],
          ],
        ),
      },
      responses: {
        ...SwaggerResponse.created(
          'Client created',
          SwaggerContents.applicationJson([], [], clientObject)
        ),
        ...defaultResponses,
      },
    },
  },
  '/clients/{id}': {
    get: {
      tags: [clientTag],
      summary: 'Get a Client',
      produces: ['application/json'],
      parameters: SwaggerPath.paths([['id', SwaggerTypes.uuid(), true]]),
      security,
      responses: {
        ...SwaggerResponse.ok(
          'Client found',
          SwaggerContents.applicationJson([], [], clientObject)
        ),
        ...SwaggerResponse.notFound('Client not found'),
        ...defaultResponses,
      },
    },
    patch: {
      tags: [clientTag],
      summary: 'Update a Client by id',
      produces: ['application/json'],
      parameters: SwaggerPath.paths([['id', SwaggerTypes.uuid(), true]]),
      requestBody: {
        content: SwaggerContents.applicationJson(
          [
            ['name', SwaggerTypes.string(false, 'César Damasceno')],
            ['contact', SwaggerTypes.string(false, '5511999999999')],
            ['address', SwaggerTypes.string(false, 'Avenida Carandiru')],
          ],
        ),
      },
      security,
      responses: {
        ...SwaggerResponse.ok(
          'Client updated',
          SwaggerContents.applicationJson([], [], clientObject),
        ),
        ...SwaggerResponse.notFound('Client not found'),
        ...defaultResponses,
      },
    },
    delete: {
      tags: [clientTag],
      summary: 'Delete a Client by id',
      produces: ['application/json'],
      parameters: SwaggerPath.paths([['id', SwaggerTypes.uuid(), true]]),
      security,
      responses: {
        ...SwaggerResponse.noContent(),
        ...SwaggerResponse.notFound('Client not found'),
        ...defaultResponses,
      },
    },
  },
};
