const swaggerUi = require('swagger-ui-express');

const swaggerDoc = {
    openapi: '3.0.0',
    info: {
        title: 'Smart Waste Management API',
        version: '1.0.0',
        description: 'API for managing waste collection bins and user authentication',
    },
    tags: [
        {
            name: 'Bins',
            description: 'Operations related to waste bins',
        },
        {
            name: 'Users',
            description: 'Operations related to user management',
        },
        {
            name: 'Authentification',
            description: 'Operations related to user authentification',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        '/api/auth/register': {
            post: {
                tags: ['Authentification'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserRegister',
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'User successfully registered',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'User already exists',
                    },
                },
            },
        },
        '/api/auth/login': {
            post: {
                tags: ['Authentification'],
                summary: 'User login',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserLogin',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        token: {
                                            type: 'string',
                                            description: 'JWT token',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Invalid email or password',
                    },
                },
            },
        },
        '/api/bins': {
            get: {
                tags: ['Bins'],
                summary: 'Get all bins',
                responses: {
                    '200': {
                        description: 'List of bins retrieved successfully',
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
                tags: ['Bins'],
                summary: 'Create a new bin',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/BinCreate',
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Bin created successfully',
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
        '/api/bins/{id}': {
            get: {
                tags: ['Bins'],
                summary: 'Get a bin by ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                        description: 'ID of the bin to retrieve',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Bin retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Bin',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Bin not found',
                    },
                },
            },
            put: {
                tags: ['Bins'],
                summary: 'Update a bin by ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                        description: 'ID of the bin to update',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/BinUpdate',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Bin updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Bin',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Bin not found',
                    },
                },
            },
            delete: {
                tags: ['Bins'],
                summary: 'Delete a bin by ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                        description: 'ID of the bin to delete',
                    },
                ],
                responses: {
                    '204': {
                        description: 'Bin deleted successfully',
                    },
                    '404': {
                        description: 'Bin not found',
                    },
                },
            },
        },
        '/api/users': {
            get: {
                tags: ['Users'],
                summary: 'Get all users',
                responses: {
                    '200': {
                        description: 'List of users',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/User',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/users/{id}': {
            get: {
                tags: ['Users'],
                summary: 'Get user by ID',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                        description: 'ID of the user to retrieve',
                    },
                ],
                responses: {
                    '200': {
                        description: 'User retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'User not found',
                    },
                },
            },
            put: {
                tags: ['Users'],
                summary: 'Update a user by ID',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                        description: 'ID of the user to update',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserUpdate',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'User updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'User not found',
                    },
                },
            },
            delete: {
                tags: ['Users'],
                summary: 'Delete a user by ID',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                        description: 'ID of the user to delete',
                    },
                ],
                responses: {
                    '204': {
                        description: 'User deleted successfully',
                    },
                    '404': {
                        description: 'User not found',
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
                    name: {
                        type: 'string',
                    },
                    address: {
                        type: 'string',
                    },
                    fillLevel: {
                        type: 'number',
                        description: 'Fill level percentage (0-100)',
                    },
                    latitude: {
                        type: 'number',
                        format: 'float',
                    },
                    longitude: {
                        type: 'number',
                        format: 'float',
                    },
                },
                required: ['name', 'address', 'latitude', 'longitude'],
            },
            BinCreate: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                    },
                    address: {
                        type: 'string',
                    },
                    fillLevel: {
                        type: 'number',
                        description: 'Fill level percentage (0-100)',
                    },
                    latitude: {
                        type: 'number',
                        format: 'float',
                    },
                    longitude: {
                        type: 'number',
                        format: 'float',
                    },
                },
                required: ['name', 'address', 'latitude', 'longitude'],
            },
            BinUpdate: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                    },
                    address: {
                        type: 'string',
                    },
                    fillLevel: {
                        type: 'number',
                    },
                    latitude: {
                        type: 'number',
                    },
                    longitude: {
                        type: 'number',
                    },
                },
            },
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                    },
                    username: {
                        type: 'string',
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                    },
                },
                required: ['id', 'username', 'email'],
            },
            UserRegister: {
                type: 'object',
                properties: {
                    username: {
                        type: 'string',
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                    },
                },
                required: ['username', 'email', 'password'],
            },
            UserLogin: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                    },
                },
                required: ['email', 'password'],
            },
            UserUpdate: {
                type: 'object',
                properties: {
                    username: {
                        type: 'string',
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                    },
                },
            },
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

module.exports = { swaggerUi, specs: swaggerDoc };
