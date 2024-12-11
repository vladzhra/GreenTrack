const swaggerUi = require('swagger-ui-express');

const swaggerDoc = {
    openapi: '3.0.0',
    info: {
        title: 'Smart Waste Management API',
        version: '1.0.0',
        description: 'API for managing waste collection bins',
    },
    paths: {
        '/api/bins': {
            get: {
                summary: 'Get all bins',
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Bin',
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: 'Add bin data',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Bin',
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Bin',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Bin: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                    },
                    fillLevel: {
                        type: 'number',
                    },
                    location: {
                        type: 'string',
                    },
                },
                required: ['id', 'fillLevel', 'location'],
            },
        },
    },
}

module.exports = { swaggerUi, specs: swaggerDoc };