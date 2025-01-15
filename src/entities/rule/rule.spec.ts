import { Rule } from './rule'
import { mockRuleData } from './rule.mock'

describe('Rule Entity', () => {
	it('create Rule entity with full data', () => {
		const rule = new Rule(mockRuleData()[0])

		expect(rule).toBeInstanceOf(Rule)
		expect(rule).toEqual(mockRuleData()[0])

		expect(rule.validate().success).toBe(true)
	})

	it('create Rule entity with partial data', () => {
		const rule = new Rule(mockRuleData()[1])

		expect(rule).toBeInstanceOf(Rule)
		expect(rule).toEqual(mockRuleData()[1])

		expect(rule.validate().success).toBe(true)
	})
})
