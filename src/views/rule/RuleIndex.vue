<script setup>
import { ruleStore, navigationStore } from '../../store/store.js'
</script>

<template>
	<NcAppContent>
		<template #list>
			<RuleList />
		</template>
		<template #default>
			<NcEmptyContent v-if="!ruleStore.ruleItem || navigationStore.selected != 'rules'"
				class="detailContainer"
				name="No rule"
				description="No rule selected">
				<template #icon>
					<Update />
				</template>
				<template #action>
					<NcButton type="primary" @click="ruleStore.setRuleItem(null); navigationStore.setModal('editRule')">
						Add rule
					</NcButton>
				</template>
			</NcEmptyContent>
			<RuleDetails v-if="ruleStore.ruleItem && navigationStore.selected === 'rules'" />
		</template>
	</NcAppContent>
</template>

<script>
import { NcAppContent, NcEmptyContent, NcButton } from '@nextcloud/vue'
import RuleList from './RuleList.vue'
import RuleDetails from './RuleDetails.vue'
import Update from 'vue-material-design-icons/Update.vue'

export default {
	name: 'RuleIndex',
	components: {
		NcAppContent,
		NcEmptyContent,
		NcButton,
		RuleList,
		RuleDetails,
		Update,
	},
}
</script>
