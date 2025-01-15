import { setActivePinia, createPinia } from 'pinia'
import { useRuleStore } from './rule.js'
import { Rule, mockRule } from '../../entities/index.js'

describe('Rule Store', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('sets rule item correctly', () => {
		const store = useRuleStore()
		store.setRuleItem(mockRule()[0])

		expect(store.ruleItem).toBeInstanceOf(Rule)
		expect(store.ruleItem).toEqual(mockRule()[0])
		expect(store.ruleItem.validate().success).toBe(true)
	})

	it('sets rule list correctly', () => {
		const store = useRuleStore()
		store.setRuleList(mockRule())

		expect(store.ruleList).toHaveLength(mockRule().length)

		store.ruleList.forEach((item, index) => {
			expect(item).toBeInstanceOf(Rule)
			expect(item).toEqual(mockRule()[index])
			expect(item.validate().success).toBe(true)
		})
	})
})
