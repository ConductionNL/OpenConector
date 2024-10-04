<?php

namespace OCA\OpenConnector\Action;

use Exception;
use OCA\OpenConnector\Service\SynchronizationService;
use OCA\OpenConnector\Db\SynchronizationMapper;
use OCA\OpenConnector\Db\SynchronizationContractMapper;

/**
 * This action handles the synchronization of data from the source to the target.
 *
 * @package OCA\OpenConnector\Cron
 */
class SynchronizationAction
{
    private SynchronizationService $synchronizationService;
    private SynchronizationMapper $synchronizationMapper;
    private SynchronizationContractMapper $synchronizationContractMapper;
    public function __construct(
        SynchronizationService $synchronizationService,
        SynchronizationMapper $synchronizationMapper,
        SynchronizationContractMapper $synchronizationContractMapper,
    ) {
        $this->synchronizationService = $synchronizationService;
        $this->synchronizationMapper = $synchronizationMapper;
        $this->synchronizationContractMapper = $synchronizationContractMapper;
    }

	/**
	 * Executes the synchronization process based on the provided arguments.
	 * This method checks for a valid synchronization ID, processes a synchronization contract if provided,
	 * or performs a general synchronization action. It returns a stack trace of operations performed.
	 *
	 * @todo Make this method more generic to handle different synchronization processes.
	 * @todo Implement proper error handling when 'synchronizationId' is missing or invalid.
	 * @todo Improve handling for testing purposes and synchronization contract logic.
	 *
	 * @param array $argument An array of arguments that can include 'synchronizationId' and 'synchronizationContractId'.
	 *
	 * @return array Returns an array containing the stack trace of actions performed and any warnings or messages.
	 *
	 * @throws Exception Throws an exception if the synchronization process fails or encounters an error.
	 */
    public function run(array $argument): array
	{
        //@todo: for testing purposes 
        if (!isset($argument['synchronizationId'])) {
            $argument['synchronizationId'] = 1;
        }

        $response = [];

        // if we do not have a synchronization Id then everything is wrong
        $response['stackTrace'][] = 'Check for a valid synchronization ID';
        if (!isset($argument['synchronizationId'])) {
            // @todo: implement error handling
            $response['level'] = 'WARNING';
            $response['message'] = 'No synchronization ID provided';
            return $response;
        }

        // We are going to allow for a single synchronization contract to be processed at a time
        if (isset($argument['synchronizationContractId']) && is_int((int) $argument['synchronizationContractId'])) {
            $synchronizationContract = $this->synchronizationContractMapper->find((int) $argument['synchronizationContractId']);
            $this->callService->synchronizeContract($synchronization);
            return $response;
        }

        // Let's find a synchronysation
        $response['stackTrace'][] = 'Getting synchronization';
        $synchronization = $this->synchronizationMapper->find((int) $argument['synchronizationId']);
        if (!$synchronization){
            $response['level'] = 'WARNING';
            $response['message'] = 'No synchronization found';
            return $response;
        }

        // Doing the synchronization
        $response['stackTrace'][] = 'Doing the synchronization';
        $objects = $this->synchronizationService->synchronize($synchronization);

        $response['stackTrace'][] = 'Synchronized '.count($objects).' successfully';

        // Let's report back about what we have just done
        return $response;
    }

}
