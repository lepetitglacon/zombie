<template>
	<div class="container">
		<ul class="list">
			<li v-for="message of messages" class="message">
				<p>
					<span class="timestamp">{{ message.timestamp.getTime() }}</span>
					<span class="user">{{ message.user }}</span>
					<span class="message">{{ message.message }}</span>
				</p>
			</li>
		</ul>
		<input
			v-model="inputValue"
			type="text"
			class="input"
		>
	</div>
</template>

<script setup lang="ts">
	import {ref} from "vue";
	import type Message from "@/types/ChatEngine/Message";

	const messages = ref<Array<Message>>([])
	const inputValue = ref('')

	defineExpose({
		messages,
		inputValue
	})
</script>

<style scoped>
.container {
	position: absolute;
	bottom: 0;
	left: 0;
}
</style>