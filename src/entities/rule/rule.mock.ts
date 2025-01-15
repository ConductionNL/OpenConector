import { Rule } from './rule'
import { TRule } from './rule.types'

/**
 * Mock rule data for testing purposes
 * @return {TRule[]} Array of mock rule data
 */
export const mockRuleData = (): TRule[] => [
	{
		id: '1',
		uuid: '5137a1e5-b54d-43ad-abd1-4b5bff5fcd3f',
		name: 'System Backup Rule',
		description: 'Rule for system backup process',
		action: 'create',

		timing: 'before',
		conditions: [
			{
				if: [{ var: 'data.type' }, 'backup'],
			},
		],
		type: 'script',
		configuration: {
			script: 'backup.js',
		},
		order: 1,
		created: '2023-01-01T00:00:00Z',
		updated: '2023-01-01T00:00:00Z',
	},
	{
		id: '2',
		uuid: '4c3edd34-a90d-4d2a-8894-adb5836ecde8',
		name: 'Weekly Report Rule',
		description: 'Rule for generating weekly reports',
		action: 'read',
		timing: 'after',
		conditions: [
			{
				if: [{ var: 'data.type' }, 'report'],
			},
		],
		type: 'mapping',
		configuration: {
			mappings: {
				source: 'target',
			},
		},
		order: 2,
		created: '2023-01-01T00:00:00Z',
		updated: '2023-01-01T00:00:00Z',
	},
]

/**
 * Creates Rule instances from mock data
 * @param {TRule[]} data - Optional mock rule data to use
 * @return {Rule[]} Array of Rule instances
 */
export const mockRule = (data: TRule[] = mockRuleData()): Rule[] => data.map(item => new Rule(item))
