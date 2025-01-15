import { Event } from './event'
import { mockEventData } from './event.mock'

describe('Event Entity', () => {
	it('create Event entity with full data', () => {
		const event = new Event(mockEventData()[0])

		expect(event).toBeInstanceOf(Event)
		expect(event).toEqual(mockEventData()[0])

		expect(event.validate().success).toBe(true)
	})

	it('create Event entity with partial data', () => {
		const event = new Event(mockEventData()[1])

		expect(event).toBeInstanceOf(Event)
		expect(event).toEqual(mockEventData()[1])

		expect(event.validate().success).toBe(true)
	})
})
