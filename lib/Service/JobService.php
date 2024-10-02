<?php

namespace OCA\OpenConnector\Service;


use OCA\OpenConnector\Cron\ActionTask;
use OCA\OpenConnector\Db\Job;
use OCA\OpenConnector\Db\JobMapper;
use OCP\BackgroundJob\IJobList;
use OCP\IDBConnection;

class JobService
{
    private IJobList $jobList;
    private JobMapper $jobMapper;
    private IDBConnection $connection;

    public function __construct( IJobList $jobList, JobMapper $jobMapper, ActionTask $actionTask, IDBConnection $connection) {

        $this->jobList = $jobList;
        $this->jobMapper = $jobMapper;
        $this->actionTask = $actionTask;
        $this->connection = $connection;
    }

    public function scheduleJob(Job $job): Job
    {
        // Lets first check if the job should be disabled
        if ($job->getIsEnabled() === false || $job->getJobListId()) {

            // @todo fix this (call to protected method)
            //$this->jobList->removeById($job->getJobListId());
            //$job->setJobListId(null);
            return $this->jobMapper->update($job);
        }

        // lets not update the job if it's already scheduled @todo we should
        if($job->getJobListId()) {
            return $job;
        }

        // Oke this is a new job lets schedule it
        $arguments = $job->getArguments();
        $arguments['jobId'] = $job->getId();

        if(!$job->getScheduleAfter()) {
            $iJob = $this->jobList->add($this->actionTask::class, $arguments);
        } else {
            $runAfter = $job->getScheduleAfter()->getTimestamp();
            $iJob = $this->jobList->scheduleAfter($this->actionTask::class, $runAfter, $arguments);
        }

        // Set the job list id
        $job->setJobListId($this->getJobListId($this->actionTask::class));
        // Save the job to the database
        return $this->jobMapper->update($job);
    }

    /**
	 * This function will get the job list id of the last job in the list
     * 
     * Why the NC job list dosn't support a better way to get the last job in the list is beyond me :')
     * https://github.com/nextcloud/server/blob/master/lib/private/BackgroundJob/JobList.php#L134
	 *
	 * @param IJob|class-string<IJob> $job
	 * @param mixed $argument
	 */
	public function getJobListId($job): int|null {
		$class = ($job instanceof IJob) ? get_class($job) : $job;

		$query = $this->connection->getQueryBuilder();
		$query->select('id')
			->from('jobs')
			->where($query->expr()->eq('class', $query->createNamedParameter($class)))
			->orderBy('id', 'DESC')
			->setMaxResults(1);

		$result = $query->executeQuery();
		$row = $result->fetch();
		$result->closeCursor();

		return $row['id'] ?? null;
	}

}