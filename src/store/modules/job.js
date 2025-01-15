import { defineStore } from 'pinia'
import { Job } from '../../entities/index.js'
import { importExportStore } from '../../store/store.js'
import _ from 'lodash'

export const useJobStore = defineStore(
	'job', {
		state: () => ({
			jobItem: false,
			jobTest: false,
			jobRun: false,
			jobList: [],
			jobLog: false,
			jobLogs: [],
			jobArgumentKey: null,
		}),
		actions: {
			setJobItem(jobItem) {
				this.jobItem = jobItem && new Job(jobItem)
				console.info('Active job item set to ' + jobItem)
			},
			setJobTest(jobTest) {
				this.jobTest = jobTest
				console.info('Job test set to ' + jobTest)
			},
			setJobRun(jobRun) {
				this.jobRun = jobRun
				console.info('Job run set to ' + jobRun)
			},
			setJobList(jobList) {
				this.jobList = jobList.map(
					(jobItem) => new Job(jobItem),
				)
				console.info('Job list set to ' + jobList.length + ' items')
			},
			setJobLogs(jobLogs) {
				this.jobLogs = jobLogs
				console.info('Job logs set to ' + jobLogs.length + ' items')
			},
			setJobArgumentKey(jobArgumentKey) {
				this.jobArgumentKey = jobArgumentKey
				console.info('Active job argument key set to ' + jobArgumentKey)
			},
			/* istanbul ignore next */ // ignore this for Jest until moved into a service
			async refreshJobList(search = null) {
				// @todo this might belong in a service?
				let endpoint = '/index.php/apps/openconnector/api/jobs'
				if (search !== null && search !== '') {
					endpoint = endpoint + '?_search=' + search
				}
				return fetch(endpoint, {
					method: 'GET',
				})
					.then(
						(response) => {
							response.json().then(
								(data) => {
									this.setJobList(data.results)
								},
							)
						},
					)
					.catch(
						(err) => {
							console.error(err)
						},
					)
			},
			// New function to get a single job
			async getJob(id) {
				const endpoint = `/index.php/apps/openconnector/api/jobs/${id}`
				try {
					const response = await fetch(endpoint, {
						method: 'GET',
					})
					const data = await response.json()
					this.setJobItem(data)
					return data
				} catch (err) {
					console.error(err)
					throw err
				}
			},
			// New function to get source logs
			async refreshJobLogs() {
				const endpoint = `/index.php/apps/openconnector/api/jobs-logs/${this.jobItem.id}`
				try {
					const response = await fetch(endpoint, {
						method: 'GET',
					})
					const data = await response.json()
					this.setJobLogs(data)
					return data
				} catch (err) {
					console.error(err)
					throw err
				}
			},
			// Delete a job
			deleteJob() {
				if (!this.jobItem || !this.jobItem.id) {
					throw new Error('No job item to delete')
				}

				console.info('Deleting job...')

				const endpoint = `/index.php/apps/openconnector/api/jobs/${this.jobItem.id}`

				return fetch(endpoint, {
					method: 'DELETE',
				})
					.then((response) => {
						this.refreshJobList()
					})
					.catch((err) => {
						console.error('Error deleting job:', err)
						throw err
					})
			},
			// Test a job
			testJob() {
				if (!this.jobItem) {
					throw new Error('No job item to test')
				}
				console.info('Testing job...')

				const endpoint = `/index.php/apps/openconnector/api/jobs-test/${this.jobItem.id}`

				return fetch(endpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					// body: JSON.stringify(testJobItem),
					body: JSON.stringify([]),
				})
					.then((response) => response.json())
					.then((data) => {
						this.setJobTest(data)
						console.info('Job tested')
						// Refresh the job list
						this.refreshJobLogs()
					})
					.catch((err) => {
						console.error('Error testing job:', err)
						this.refreshJobLogs()
						throw err
					})
			},
			// Run a job
			async runJob(id) {
				if (!id) {
					throw new Error('No job item to run')
				}
				console.info('Running job...')

				const endpoint = `/index.php/apps/openconnector/api/jobs-test/${id}`

				const response = await fetch(endpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify([]),
				})

				const data = await response.json()
				this.setJobRun(data)
				console.info('Job run')
				// Refresh the job list
				this.refreshJobLogs()

				return { response, data }
			},
			// Create or save a job from store
			async saveJob(jobItem) {
				if (!jobItem) {
					throw new Error('No job item to save')
				}

				console.info('Saving job...')

				const isNewJob = !jobItem.id
				const endpoint = isNewJob
					? '/index.php/apps/openconnector/api/jobs'
					: `/index.php/apps/openconnector/api/jobs/${jobItem.id}`
				const method = isNewJob ? 'POST' : 'PUT'

				// Create a copy of the job item and remove empty properties
				const jobToSave = _.cloneDeep(jobItem)
				Object.keys(jobToSave).forEach(key => {
					if (jobToSave[key] === '' || (Array.isArray(jobToSave[key]) && !jobToSave[key].length) || key === 'created' || key === 'updated') {
						delete jobToSave[key]
					}
				})

				// Remove the version field
				delete jobToSave.version

				const response = await fetch(
					endpoint,
					{
						method,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(jobToSave),
					},
				)

				console.info('Job saved')

				const data = await response.json()
				const entity = new Job(data)

				this.setJobItem(entity)
				this.refreshJobList()

				return { response, data, entity }
			},
			// Export a job
			exportJob(jobItem) {
				if (!jobItem) {
					throw new Error('No job item to export')
				}
				importExportStore.exportFile(
					jobItem.id,
					'job',
				)
					.then(({ download }) => {
						download()
					})
					.catch((err) => {
						console.error('Error exporting job:', err)
						throw err
					})
			},
		},
	},
)
