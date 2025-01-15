import { Event } from './event'
import { TEvent } from './event.types'

/**
 * Mock event data for testing purposes
 * @return {TEvent[]} Array of mock event data
 */
export const mockEventData = (): TEvent[] => [
	{
		id: '5137a1e5-b54d-43ad-abd1-4b5bff5fcd3f',
		name: 'System Backup Event',
		description: 'Triggers system backup process',
		eventType: 'system.backup',
		payload: { backupType: 'full' },
		priority: 1,
		timeout: 7200, // 2 hours in seconds
		isAsync: true,
		allowDuplicates: false,
		isEnabled: true,
		oneTime: false,
		scheduleAfter: '',
		userId: 'admin',
		eventGroupId: 'system-events',
		retentionPeriod: 3600,
		errorRetention: 86400,
		lastTriggered: '',
		nextTrigger: '',
		created: '',
		updated: '',
	},
	{
		id: '4c3edd34-a90d-4d2a-8894-adb5836ecde8',
		name: 'Weekly Report Generation',
		description: 'Generates weekly system reports',
		eventType: 'system.report',
		payload: { reportType: 'weekly' },
		priority: 2,
		timeout: 3600, // 1 hour in seconds
		isAsync: true,
		allowDuplicates: false,
		isEnabled: true,
		oneTime: false,
		scheduleAfter: '',
		userId: 'reporter',
		eventGroupId: 'reporting-events',
		retentionPeriod: 3600,
		errorRetention: 86400,
		lastTriggered: '',
		nextTrigger: '',
		created: '',
		updated: '',
	},
]

/**
 * Creates Event instances from mock data
 * @param {TEvent[]} data - Optional mock event data to use
 * @return {Event[]} Array of Event instances
 */
export const mockEvent = (data: TEvent[] = mockEventData()): Event[] => data.map(item => new Event(item))
