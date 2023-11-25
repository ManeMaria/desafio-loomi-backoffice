import {
  security,
  SwaggerContents,
  SwaggerSchemas,
  SwaggerTypes,
  defaultResponses,
  SwaggerResponse,
  SwaggerQuery,
} from '@/shared/infra/swagger/helpers';

export const reportTag = 'Report';


export const reportSchema = SwaggerSchemas.create('Report', [
  ['id', SwaggerTypes.uuid(true)],
  ['csvPath', SwaggerTypes.string(true)],
  ['created_at', SwaggerTypes.dateTime(true)],
  ['updated_at', SwaggerTypes.dateTime(true)],
]);

export const reportObject = SwaggerTypes.object(true, [
  ['id', SwaggerTypes.uuid(true)],
  ['csvPath', SwaggerTypes.string(true)],
  ['created_at', SwaggerTypes.dateTime(true)],
  ['updated_at', SwaggerTypes.dateTime(true)],
]);

export const reportPaths = {
  '/download-report': {
    post: {
      tags: [reportTag],
      summary: 'Create a new report',
      produces: ['application/json'],

      parameters: [
        ...SwaggerQuery.params(
          [
            ['startDate', SwaggerTypes.dateTime(false, '')],
            ['endDate', SwaggerTypes.dateTime(false, '')]

          ],
        ),
      ],
      security,
      responses: {
        ...SwaggerResponse.created(
          'Client created',
          SwaggerContents.applicationJson([], [], reportObject)
        ),
        ...defaultResponses,
      },
    },
  },

};
