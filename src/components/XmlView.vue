<template>
	<div>
		<h2>XML</h2>
		<button id="downloadXmlBtn" @click="downloadXml(xml)">
			Download XML
		</button>
		<pre>{{ xml }}</pre>
	</div>
</template>

<script setup lang="ts">
import { downloadXml } from '../utils';
defineProps<{ xml: string }>();
</script>
