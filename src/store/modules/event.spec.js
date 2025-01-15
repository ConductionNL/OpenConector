import { setActivePinia, createPinia } from 'pinia'
import { useEventStore } from './event.js'
import { Event, mockEvent } from '../../entities/index.js'

describe('Event Store', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('sets event item correctly', () => {
		const store = useEventStore()
		store.setEventItem(mockEvent()[0])

		expect(store.eventItem).toBeInstanceOf(Event)
		expect(store.eventItem).toEqual(mockEvent()[0])
		expect(store.eventItem.validate().success).toBe(true)
	})

	it('sets event list correctly', () => {
		const store = useEventStore()
		store.setEventList(mockEvent())

		expect(store.eventList).toHaveLength(mockEvent().length)

		store.eventList.forEach((item, index) => {
			expect(item).toBeInstanceOf(Event)
			expect(item).toEqual(mockEvent()[index])
			expect(item.validate().success).toBe(true)
		})
	})
})
