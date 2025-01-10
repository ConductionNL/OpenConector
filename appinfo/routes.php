<?php

return [
	'resources' => [
		'Endpoints' => ['url' => 'api/endpoints'],
		'Sources' => ['url' => 'api/sources'],
		'Mappings' => ['url' => 'api/mappings'],
		'Jobs' => ['url' => 'api/jobs'],
		'Synchronizations' => ['url' => 'api/synchronizations'],
		'Consumers' => ['url' => 'api/consumers'],
	],
	'routes' => [
		['name' => 'dashboard#page', 'url' => '/', 'verb' => 'GET'],
		['name' => 'sources#test', 'url' => '/api/source-test/{id}', 'verb' => 'POST'],
		['name' => 'sources#logs', 'url' => '/api/sources-logs/{id}', 'verb' => 'GET'],
		['name' => 'jobs#run', 'url' => '/api/jobs-test/{id}', 'verb' => 'POST'],
		['name' => 'jobs#logs', 'url' => '/api/jobs-logs/{id}', 'verb' => 'GET'],
		['name' => 'endpoints#test', 'url' => '/api/endpoints-test/{id}', 'verb' => 'POST'],
		['name' => 'endpoints#logs', 'url' => '/api/endpoints-logs/{id}', 'verb' => 'GET'],
		['name' => 'synchronizations#contracts', 'url' => '/api/synchronizations-contracts/{id}', 'verb' => 'GET'],
		['name' => 'synchronizations#logs', 'url' => '/api/synchronizations-logs/{id}', 'verb' => 'GET'],
		['name' => 'synchronizations#test', 'url' => '/api/synchronizations-test/{id}', 'verb' => 'POST'],
		['name' => 'synchronizations#run', 'url' => '/api/synchronizations-run/{id}', 'verb' => 'POST'],
		// Mapping endpoints
		['name' => 'mappings#test', 'url' => '/api/mappings/test', 'verb' => 'POST'],
		['name' => 'mappings#saveObject', 'url' => '/api/mappings/objects', 'verb' => 'POST'],
		['name' => 'mappings#getObjects', 'url' => '/api/mappings/objects', 'verb' => 'GET'],
		// Running endpoints - allow any path after /api/endpoints/
		['name' => 'endpoints#handlePath', 'postfix' => 'read', 'url' => '/api/endpoint/{_path}', 'verb' => 'GET', 'requirements' => ['_path' => '.+']],
		['name' => 'endpoints#handlePath', 'postfix' => 'update', 'url' => '/api/endpoint/{_path}', 'verb' => 'PUT', 'requirements' => ['_path' => '.+']],
		['name' => 'endpoints#handlePath', 'postfix' => 'create', 'url' => '/api/endpoint/{_path}', 'verb' => 'POST', 'requirements' => ['_path' => '.+']],
		['name' => 'endpoints#handlePath', 'postfix' => 'destroy', 'url' => '/api/endpoint/{_path}', 'verb' => 'DELETE', 'requirements' => ['_path' => '.+']],
		// Import & Export
		['name' => 'import#import', 'url' => '/api/import', 'verb' => 'POST'],
//		['name' => 'import#importUpdate', 'url' => '/api/import/{id}', 'verb' => 'PUT'],
		['name' => 'export#export', 'url' => '/api/export/{type}/{id}', 'verb' => 'GET'],
	],
];
