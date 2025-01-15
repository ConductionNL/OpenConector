import { defineStore } from 'pinia'
import { Rule, TRule } from '../../entities/index.js'
import { importExportStore } from '../../store/store.js'

export const useRuleStore = defineStore('rule', {
	state: () => ({
		/** @type {Rule} Current active rule */
		ruleItem: null,
		/** @type {Rule[]} List of rules */
		ruleList: [],
		/** @type {object} Rule test results */
		ruleTest: null,
		/** @type {object} Rule run results */
		ruleRun: null,
		/** @type {Array} Rule logs */
		ruleLogs: [],
	}),
	actions: {
		/**
		 * Sets the current active rule
		 * @param {TRule | Rule} ruleItem - Rule data to set
		 * @return {void}
		 */
		setRuleItem(ruleItem) {
			this.ruleItem = ruleItem && new Rule(ruleItem)
			console.info('Active rule item set to ' + ruleItem)
		},

		/**
		 * Sets the list of rules
		 * @param {Array<TRule | Rule>} ruleList - Array of rule data
		 * @return {void}
		 */
		setRuleList(ruleList) {
			this.ruleList = ruleList.map(
				(ruleItem) => new Rule(ruleItem),
			)
			console.info('Rule list set to ' + ruleList.length + ' items')
		},

		/**
		 * Refreshes the rule list from the API
		 * @param {string | null} search - Optional search query
		 * @return {Promise} Fetch promise
		 */
		async refreshRuleList(search = null) {
			let endpoint = '/index.php/apps/openconnector/api/rules'
			if (search !== null && search !== '') {
				endpoint = endpoint + '?_search=' + search
			}
			try {
				const response = await fetch(endpoint)
				const data = await response.json()
				this.setRuleList(data.results)
				return data
			} catch (err) {
				console.error(err)
				throw err
			}
		},

		/**
		 * Gets a single rule by ID
		 * @param {string} id - Rule ID
		 * @return {Promise} Fetch promise
		 */
		async getRule(id) {
			const endpoint = `/index.php/apps/openconnector/api/rules/${id}`
			try {
				const response = await fetch(endpoint)
				const data = await response.json()
				this.setRuleItem(data)
				return data
			} catch (err) {
				console.error(err)
				throw err
			}
		},

		/**
		 * Saves or creates a rule
		 * @param {TRule | Rule} ruleItem - Rule data to save
		 * @return {{ response: Response, data: TRule, entity: Rule }} Fetch promise
		 */
		async saveRule(ruleItem) {
			if (!ruleItem) {
				throw new Error('No rule item to save')
			}

			const isNewRule = !ruleItem.id
			const endpoint = isNewRule
				? '/index.php/apps/openconnector/api/rules'
				: `/index.php/apps/openconnector/api/rules/${ruleItem.id}`
			const method = isNewRule ? 'POST' : 'PUT'

			// Clean up the rule data before saving
			const ruleToSave = { ...ruleItem }
			Object.keys(ruleToSave).forEach(key => {
				if (ruleToSave[key] === ''
					|| (Array.isArray(ruleToSave[key]) && !ruleToSave[key].length)
					|| key === 'created'
					|| key === 'updated') {
					delete ruleToSave[key]
				}
			})

			const response = await fetch(
				endpoint,
				{
					method,
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(ruleToSave),
				},
			)

			const data = await response.json()
			const entity = new Rule(data)

			this.setRuleItem(data)
			this.refreshRuleList()

			return { response, data, entity }
		},

		/**
		 * Deletes a rule
		 * @param {string} id - Rule ID
		 * @throws If no rule ID is provided
		 * @return {{ response: Response }} Fetch promise
		 */
		async deleteRule(id) {
			if (!id) {
				throw new Error('No rule ID to delete provided')
			}

			console.info('Deleting rule...')

			const endpoint = `/index.php/apps/openconnector/api/rules/${id}`

			const response = await fetch(endpoint, {
				method: 'DELETE',
			})

			response.ok && this.setRuleItem(null)
			this.refreshRuleList()

			return { response }
		},
		/**
		 * Exports a rule
		 * @param {TRule | Rule} ruleItem - Rule data to export
		 * @throws If no rule item is provided
		 */
		exportRule(ruleItem) {
			if (!ruleItem) {
				throw new Error('No rule item to export')
			}
			importExportStore.exportFile(
				ruleItem.id,
				'rule',
			)
				.then(({ download }) => {
					download()
				})
				.catch((err) => {
					console.error('Error exporting mapping:', err)
					throw err
				})
		},
	},
})
