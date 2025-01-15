import { SafeParseReturnType, z } from 'zod'
import { TEvent } from './event.types.js'
import ReadonlyBaseClass from '../ReadonlyBaseClass.js'
import getValidISOstring from '../../services/getValidISOstring.js'

/**
 * Event entity class representing an event in the system
 * Implements TEvent interface and extends ReadonlyBaseClass for immutability
 */
export class Event extends ReadonlyBaseClass implements TEvent {

	public readonly id: string
	public readonly name: string
	public readonly description: string
	public readonly eventType: string
	public readonly payload: object
	public readonly priority: number
	public readonly timeout: number
	public readonly isAsync: boolean
	public readonly allowDuplicates: boolean
	public readonly isEnabled: boolean
	public readonly oneTime: boolean
	public readonly scheduleAfter: string
	public readonly userId: string
	public readonly eventGroupId: string
	public readonly retentionPeriod: number
	public readonly errorRetention: number
	public readonly lastTriggered: string
	public readonly nextTrigger: string
	public readonly created: string
	public readonly updated: string

	/**
	 * Creates a new Event instance
	 * @param event - The event data to initialize with
	 */
	constructor(event: TEvent) {
		const processedEvent: TEvent = {
			id: event.id || '',
			name: event.name || '',
			description: event.description || '',
			eventType: event.eventType || 'system.default',
			payload: event.payload || {},
			priority: event.priority || 1,
			timeout: event.timeout || 3600,
			isAsync: event.isAsync ?? true,
			allowDuplicates: event.allowDuplicates ?? false,
			isEnabled: event.isEnabled ?? true,
			oneTime: event.oneTime ?? false,
			scheduleAfter: event.scheduleAfter || '',
			userId: event.userId || '',
			eventGroupId: event.eventGroupId || '',
			retentionPeriod: event.retentionPeriod || 3600,
			errorRetention: event.errorRetention || 86400,
			lastTriggered: event.lastTriggered || '',
			nextTrigger: event.nextTrigger || '',
			created: getValidISOstring(event.created) ?? '',
			updated: getValidISOstring(event.updated) ?? '',
		}

		super(processedEvent)
	}

	/**
	 * Validates the event data against a schema
	 *
	 * @return {SafeParseReturnType<TEvent, unknown>} SafeParseReturnType containing validation results
	 */
	public validate(): SafeParseReturnType<TEvent, unknown> {
		const schema = z.object({
			id: z.string().uuid(),
			name: z.string().max(255),
			description: z.string().nullable(),
			eventType: z.string(),
			payload: z.record(z.unknown()).nullable(),
			priority: z.number().int().min(1).max(10),
			timeout: z.number().int().positive(),
			isAsync: z.boolean(),
			allowDuplicates: z.boolean(),
			isEnabled: z.boolean(),
			oneTime: z.boolean(),
			scheduleAfter: z.string().nullable(),
			userId: z.string().nullable(),
			eventGroupId: z.string().nullable(),
			retentionPeriod: z.number().int().positive(),
			errorRetention: z.number().int().positive(),
			lastTriggered: z.string().nullable(),
			nextTrigger: z.string().nullable(),
			created: z.string(),
			updated: z.string(),
		})

		return schema.safeParse({ ...this })
	}

}
