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
import { OrderStatus } from '@/domains/order/entities';

export const orderTag = 'Order';


export const clientIntoOrderObject = SwaggerTypes.object(false, [
  ['id', SwaggerTypes.uuid(true)],
  ['name', SwaggerTypes.string(true)],
  ['contact', SwaggerTypes.string(true)],
  ['address', SwaggerTypes.string(true)],

]);


export const orderSchema = SwaggerSchemas.create('Order', [
  ['id', SwaggerTypes.uuid(true)],
  ['clientId', SwaggerTypes.uuid(true)],
  ['status', SwaggerTypes.enum(true, Object.values(OrderStatus))],
  ['totalOrder', SwaggerTypes.integer(true)],
  ['client', clientIntoOrderObject],
  ['createdAt', SwaggerTypes.dateTime(true)],
  ['updatedAt', SwaggerTypes.dateTime(true)],
]);

export const orderObject = SwaggerTypes.object(true, [
  ['id', SwaggerTypes.uuid(true)],
  ['clientId', SwaggerTypes.uuid(true)],
  ['status', SwaggerTypes.enum(true, Object.values(OrderStatus))],
  ['totalOrder', SwaggerTypes.integer(true)],
  ['client', clientIntoOrderObject],
  ['createdAt', SwaggerTypes.dateTime(true)],
  ['updatedAt', SwaggerTypes.dateTime(true)],
]);

export const orderPaths = {
  '/orders': {
    get: {
      tags: [orderTag],
      summary: 'Get Orders',
      produces: ['application/json'],
      parameters: [
        ...SwaggerQuery.params([
          ['clientId', SwaggerTypes.uuid(false)],
          ['status', SwaggerTypes.enum(false, Object.values(OrderStatus))],
        ]),
        ...defaultFilterParams,
      ],
      security,
      responses: {
        ...SwaggerResponse.ok(
          'Orders found',
          SwaggerContents.applicationJson([
            ['items', SwaggerTypes.array(true, orderObject, 100)],
            ['totalItemsListed', SwaggerTypes.integer()],
            ['totalItems', SwaggerTypes.integer()],
          ]),
        ),
        ...defaultResponses,
      },
    },
    post: {
      tags: [orderTag],
      summary: 'Create a new order',
      produces: ['application/json'],
      requestBody: {
        content: SwaggerContents.applicationJson([
          ['clientId', SwaggerTypes.uuid(true)],
          ['status', SwaggerTypes.enum(true, Object.values(OrderStatus))],
          ['totalOrder', SwaggerTypes.integer(true)],
        ],
        ),
      },
      security,
      responses: {
        ...SwaggerResponse.created(
          'Order created',
          SwaggerContents.applicationJson([], [], orderObject)
        ),
        ...defaultResponses,
      },
    },
  },
  '/orders/{id}': {
    get: {
      tags: [orderTag],
      summary: 'Get a Order',
      produces: ['application/json'],
      parameters: SwaggerPath.paths([['id', SwaggerTypes.uuid(), true]]),
      security,
      responses: {
        ...SwaggerResponse.ok(
          'Order found',
          SwaggerContents.applicationJson([], [], orderObject)
        ),
        ...SwaggerResponse.notFound('Order not found'),
        ...defaultResponses,
      },
    },
    patch: {
      tags: [orderTag],
      summary: 'Update a Order by id',
      produces: ['application/json'],
      parameters: SwaggerPath.paths([['id', SwaggerTypes.uuid(), true]]),
      requestBody: {
        content: SwaggerContents.applicationJson(
          [
            ['status', SwaggerTypes.enum(false, Object.values(OrderStatus))],
            ['createdAt', SwaggerTypes.dateTime()],
          ],
        ),
      },
      security,
      responses: {
        ...SwaggerResponse.ok(
          'Order updated',
          SwaggerContents.applicationJson([], [], orderObject),
        ),
        ...SwaggerResponse.notFound('Order not found'),
        ...defaultResponses,
      },
    },
    delete: {
      tags: [orderTag],
      summary: 'Delete a Order by id',
      produces: ['application/json'],
      parameters: SwaggerPath.paths([['id', SwaggerTypes.uuid(), true]]),
      security,
      responses: {
        ...SwaggerResponse.noContent(),
        ...SwaggerResponse.notFound('Order not found'),
        ...defaultResponses,
      },
    },
  },
};
