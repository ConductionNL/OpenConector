<?php

return [
	'resources' => [
		'Endpoints' => ['url' => 'api/endpoints'],
		'Sources' => ['url' => 'api/sources'],
		'Mappings' => ['url' => 'api/mappings'],
		'Jobs' => ['url' => 'api/jobs'],
		'Synchronizations' => ['url' => 'api/synchronizations'],
	],
	'routes' => [
		['name' => 'dashboard#page', 'url' => '/', 'verb' => 'GET'],
		['name' => 'sources#test', 'url' => '/api/source-test/{id}', 'verb' => 'POST'],
		['name' => 'sources#logs', 'url' => '/api/sources-logs/{id}', 'verb' => 'GET'],
		['name' => 'jobs#run', 'url' => '/api/jobs-test/{id}', 'verb' => 'POST'],
		['name' => 'jobs#logs', 'url' => '/api/jobs-logs/{id}', 'verb' => 'GET'],
	],
];
