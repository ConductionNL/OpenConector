import { defineStore } from 'pinia'
import { Event, TEvent } from '../../entities/index.js'

export const useEventStore = defineStore('event', {
	state: () => ({
		/** @type {Event} Current active event */
		eventItem: null,
		/** @type {object} Event test results */
		eventTest: null,
		/** @type {object} Event run results */
		eventRun: null,
		/** @type {Event[]} List of events */
		eventList: [],
		/** @type {object} Current event log */
		eventLog: null,
		/** @type {Array} Event logs collection */
		eventLogs: [],
		/** @type {string} Current event argument key */
		eventArgumentKey: null,
	}),
	actions: {
		/**
		 * Sets the current active event
		 * @param {TEvent | Event} eventItem - Event data to set
		 * @return {void}
		 */
		setEventItem(eventItem) {
			this.eventItem = eventItem && new Event(eventItem)
			console.info('Active event item set to ' + eventItem)
		},

		/**
		 * Sets the event test status
		 * @param {object} eventTest - Test status to set
		 * @return {void}
		 */
		setEventTest(eventTest) {
			this.eventTest = eventTest
			console.info('Event test set to ' + eventTest)
		},

		/**
		 * Sets the event run status
		 * @param {object} eventRun - Run status to set
		 * @return {void}
		 */
		setEventRun(eventRun) {
			this.eventRun = eventRun
			console.info('Event run set to ' + eventRun)
		},

		/**
		 * Sets the list of events
		 * @param {Array<TEvent | Event>} eventList - Array of event data
		 * @return {void}
		 */
		setEventList(eventList) {
			this.eventList = eventList.map(
				(eventItem) => new Event(eventItem),
			)
			console.info('Event list set to ' + eventList.length + ' items')
		},

		/**
		 * Sets the event logs
		 * @param {Array} eventLogs - Array of event logs
		 * @return {void}
		 */
		setEventLogs(eventLogs) {
			this.eventLogs = eventLogs
			console.info('Event logs set to ' + eventLogs.length + ' items')
		},

		/**
		 * Sets the current event argument key
		 * @param {string} eventArgumentKey - Argument key to set
		 * @return {void}
		 */
		setEventArgumentKey(eventArgumentKey) {
			this.eventArgumentKey = eventArgumentKey
			console.info('Active event argument key set to ' + eventArgumentKey)
		},

		/**
		 * Refreshes the event list from the API
		 * @param {string} search - Optional search query
		 * @return {Promise} Fetch promise
		 */
		async refreshEventList(search = null) {
			let endpoint = '/index.php/apps/openconnector/api/events'
			if (search !== null && search !== '') {
				endpoint = endpoint + '?_search=' + search
			}
			try {
				const response = await fetch(endpoint)
				const data = await response.json()
				this.setEventList(data.results)
				return data
			} catch (err) {
				console.error('Error refreshing event list:', err)
				throw err
			}
		},

		/**
		 * Gets a single event by ID
		 * @param {string} id - Event ID
		 * @return {Promise} Fetch promise
		 */
		async getEvent(id) {
			const endpoint = `/index.php/apps/openconnector/api/events/${id}`
			try {
				const response = await fetch(endpoint)
				const data = await response.json()
				this.setEventItem(data)
				return data
			} catch (err) {
				console.error('Error getting event:', err)
				throw err
			}
		},

		/**
		 * Refreshes event logs for the current event
		 * @return {Promise} Fetch promise
		 */
		async refreshEventLogs() {
			if (!this.eventItem?.id) {
				throw new Error('No event item selected')
			}
			const endpoint = `/index.php/apps/openconnector/api/events-logs/${this.eventItem.id}`
			try {
				const response = await fetch(endpoint)
				const data = await response.json()
				this.setEventLogs(data)
				return data
			} catch (err) {
				console.error('Error refreshing event logs:', err)
				throw err
			}
		},

		/**
		 * Deletes the current event
		 * @param {string} id - Event ID to delete
		 * @return {Promise} Fetch promise
		 */
		async deleteEvent(id) {
			if (!id) {
				throw new Error('No event ID provided to delete')
			}

			console.info('Deleting event...')
			const endpoint = `/index.php/apps/openconnector/api/events/${id}`

			const response = await fetch(endpoint, { method: 'DELETE' })

			if (response.ok) this.setEventItem(null)
			this.refreshEventList()

			return response
		},

		/**
		 * Tests the current event
		 * @return {Promise} Fetch promise
		 */
		async testEvent() {
			if (!this.eventItem?.id) {
				throw new Error('No event item to test')
			}

			console.info('Testing event...')
			const endpoint = `/index.php/apps/openconnector/api/events-test/${this.eventItem.id}`

			try {
				const response = await fetch(endpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify([]),
				})
				const data = await response.json()
				this.setEventTest(data)
				await this.refreshEventLogs()
				return data
			} catch (err) {
				console.error('Error testing event:', err)
				await this.refreshEventLogs()
				throw err
			}
		},

		/**
		 * Runs an event by ID
		 * @param {string} id - Event ID to run
		 * @return {Promise} Fetch promise
		 */
		async runEvent(id) {
			if (!id) {
				throw new Error('No event ID provided to run')
			}

			console.info('Running event...')
			const endpoint = `/index.php/apps/openconnector/api/events-run/${id}`

			try {
				const response = await fetch(endpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify([]),
				})
				const data = await response.json()
				this.setEventRun(data)
				await this.refreshEventLogs()
				return { response, data }
			} catch (err) {
				console.error('Error running event:', err)
				await this.refreshEventLogs()
				throw err
			}
		},

		/**
		 * Saves or creates an event
		 * @param {TEvent | Event} eventItem - Event data to save
		 * @return {{ response: Response, data: TEvent, entity: Event }} Fetch promise
		 */
		async saveEvent(eventItem) {
			if (!eventItem) {
				throw new Error('No event item to save')
			}

			console.info('Saving event...')
			const isNewEvent = !eventItem.id
			const endpoint = isNewEvent
				? '/index.php/apps/openconnector/api/events'
				: `/index.php/apps/openconnector/api/events/${eventItem.id}`
			const method = isNewEvent ? 'POST' : 'PUT'

			// Clean up the event data before saving
			const eventToSave = { ...eventItem }
			Object.keys(eventToSave).forEach(key => {
				if (eventToSave[key] === ''
					|| (Array.isArray(eventToSave[key]) && !eventToSave[key].length)
					|| key === 'created'
					|| key === 'updated') {
					delete eventToSave[key]
				}
			})

			const response = await fetch(endpoint, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(eventToSave),
			})

			const data = await response.json()
			const entity = new Event(data)

			this.setEventItem(entity)
			this.refreshEventList()

			return { response, data, entity }
		},
	},
})
