<script setup>
import { eventStore, navigationStore } from '../../store/store.js'
</script>

<template>
	<NcAppContent>
		<template #list>
			<EventList />
		</template>
		<template #default>
			<NcEmptyContent v-if="!eventStore.eventItem || navigationStore.selected != 'events'"
				class="detailContainer"
				name="No event"
				description="No event selected">
				<template #icon>
					<Update />
				</template>
				<template #action>
					<NcButton type="primary" @click="eventStore.setEventItem(null); navigationStore.setModal('editEvent')">
						Add event
					</NcButton>
				</template>
			</NcEmptyContent>
			<EventDetails v-if="eventStore.eventItem && navigationStore.selected === 'events'" />
		</template>
	</NcAppContent>
</template>

<script>
import { NcAppContent, NcEmptyContent, NcButton } from '@nextcloud/vue'
import EventList from './EventList.vue'
import EventDetails from './EventDetails.vue'
import Update from 'vue-material-design-icons/Update.vue'

export default {
	name: 'EventIndex',
	components: {
		NcAppContent,
		NcEmptyContent,
		NcButton,
		EventList,
		EventDetails,
		Update,
	},
}
</script>
