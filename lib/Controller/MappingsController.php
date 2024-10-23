<?php

namespace OCA\OpenConnector\Controller;

use OCA\OpenConnector\Service\ObjectService;
use OCA\OpenConnector\Service\SearchService;
use OCA\OpenConnector\Service\MappingService;
use OCA\OpenConnector\Db\Mapping;
use OCA\OpenConnector\Db\MappingMapper;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IAppConfig;
use OCP\IRequest;

class MappingsController extends Controller
{
    /**
     * Constructor for the MappingsController
     *
     * @param string $appName The name of the app
     * @param IRequest $request The request object
     * @param IAppConfig $config The app configuration object
     */
    public function __construct(
        $appName,
        IRequest $request,
        private readonly IAppConfig $config,
        private readonly MappingMapper $mappingMapper,
        private readonly MappingService $mappingService
    )
    {
        parent::__construct($appName, $request);
    }

    /**
     * Returns the template of the main app's page
     * 
     * This method renders the main page of the application, adding any necessary data to the template.
     *
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @return TemplateResponse The rendered template response
     */
    public function page(): TemplateResponse
    {           
        return new TemplateResponse(
            'openconnector',
            'index',
            []
        );
    }
    
    /**
     * Retrieves a list of all mappings
     * 
     * This method returns a JSON response containing an array of all mappings in the system.
     *
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @return JSONResponse A JSON response containing the list of mappings
     */
    public function index(ObjectService $objectService, SearchService $searchService): JSONResponse
    {
        $filters = $this->request->getParams();
        $fieldsToSearch = ['name', 'description'];

        $searchParams = $searchService->createMySQLSearchParams(filters: $filters);
        $searchConditions = $searchService->createMySQLSearchConditions(filters: $filters, fieldsToSearch:  $fieldsToSearch);
        $filters = $searchService->unsetSpecialQueryParams(filters: $filters);

        return new JSONResponse(['results' => $this->mappingMapper->findAll(limit: null, offset: null, filters: $filters, searchConditions: $searchConditions, searchParams: $searchParams)]);
    }

    /**
     * Retrieves a single mapping by its ID
     * 
     * This method returns a JSON response containing the details of a specific mapping.
     *
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param string $id The ID of the mapping to retrieve
     * @return JSONResponse A JSON response containing the mapping details
     */
    public function show(string $id): JSONResponse
    {
        try {
            return new JSONResponse($this->mappingMapper->find(id: (int) $id));
        } catch (DoesNotExistException $exception) {
            return new JSONResponse(data: ['error' => 'Not Found'], statusCode: 404);
        }
    }

    /**
     * Creates a new mapping
     * 
     * This method creates a new mapping based on POST data.
     *
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @return JSONResponse A JSON response containing the created mapping
     */
    public function create(): JSONResponse
    {
        $data = $this->request->getParams();

        foreach ($data as $key => $value) {
            if (str_starts_with($key, '_')) {
                unset($data[$key]);
            }
        }
        
        if (isset($data['id'])) {
            unset($data['id']);
        }
        
        return new JSONResponse($this->mappingMapper->createFromArray(object: $data));
    }

    /**
     * Updates an existing mapping
     * 
     * This method updates an existing mapping based on its ID.
     *
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param string $id The ID of the mapping to update
     * @return JSONResponse A JSON response containing the updated mapping details
     */
    public function update(int $id): JSONResponse
    {
        $data = $this->request->getParams();

        foreach ($data as $key => $value) {
            if (str_starts_with($key, '_')) {
                unset($data[$key]);
            }
        }
        if (isset($data['id'])) {
            unset($data['id']);
        }
        return new JSONResponse($this->mappingMapper->updateFromArray(id: (int) $id, object: $data));
    }

    /**
     * Deletes a mapping
     * 
     * This method deletes a mapping based on its ID.
     *
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param string $id The ID of the mapping to delete
     * @return JSONResponse An empty JSON response
     */
    public function destroy(int $id): JSONResponse
    {
        $this->mappingMapper->delete($this->mappingMapper->find((int) $id));

        return new JSONResponse([]);
    }

    /**
     * Tests a mapping
     * 
     * This method tests a mapping with provided input data and optional schema validation.
     *
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @return JSONResponse A JSON response containing the test results
     *
     * @example
     * Request:
     * {
     *     "inputObject": "{\"name\":\"John Doe\",\"age\":30,\"email\":\"john@example.com\"}",
     *     "mapping": "{\"fullName\":\"{{name}}\",\"userAge\":\"{{age}}\",\"contactEmail\":\"{{email}}\"}",
     *     "schema": "user_schema_id",
     *     "validation": true
     * }
     *
     * Response:
     * {
     *     "resultObject": {
     *         "fullName": "John Doe",
     *         "userAge": 30,
     *         "contactEmail": "john@example.com"
     *     },
     *     "isValid": true,
     *     "validationErrors": []
     * }
     */
    public function test(): JSONResponse
    {
        $data = $this->request->getParams();
        
        // Extract necessary data from the request
        if (!isset($data['inputObject']) || !isset($data['mapping'])) {
            throw new \InvalidArgumentException('Both inputObject and mapping are required');
        }
        
        $inputObject = json_decode($data['inputObject'], true);
        if ($inputObject === null && json_last_error() !== JSON_ERROR_NONE) {
            throw new \InvalidArgumentException('Invalid JSON for inputObject: ' . json_last_error_msg());
        }
        
        $mapping = json_decode($data['mapping'], true);
        if ($mapping === null && json_last_error() !== JSON_ERROR_NONE) {
            throw new \InvalidArgumentException('Invalid JSON for mapping: ' . json_last_error_msg());
        }

        // Get the schema if provided and see if it needs to be validated
        if (isset($data['schema']) && !empty($data['schema'])) {
            $schemaId = $data['schema'];
            $schema = $this->objectService->getObject($schemaId);
        }
        else {
            $schema = false;
        }
        if (isset($data['validation']) && !empty($data['validation'])) {
            $validation = $data['validation'];
        }
        else {
            $validation = false;
        }

        $mappingObject = new Mapping();
        $mappingObject->hydrates($mapping);

        // Perform the mapping
        try {
            $resultObject = $this->mappingService->map(mapping: $mapping, input: $inputObject);
        } catch (\Exception $e) {
            return new JSONResponse([
                'error' => 'Mapping error',
                'message' => $e->getMessage()
            ], 400);
        }

        // Validate against schema if provided
        $isValid = true;
        $validationErrors = [];
        if ($schema !== false && $validation !== false) {
            // Implement schema validation logic here
            // For now, we'll just assume it's always valid
            $isValid = true;
        }

        return new JSONResponse([
            'resultObject' => $resultObject,
            'isValid' => $isValid,
            'validationErrors' => $validationErrors
        ]);
    }
}