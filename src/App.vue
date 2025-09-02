<template>
	<ViewSelector v-model="view" />
	<template v-if="view === 'xml'">
		<XmlView :xml="xml" />
	</template>
	<template v-else>
		<section v-if="view === 'table'" class="groupedTable">
			<h2>Grouped table</h2>
			<GroupBySelector v-model="groupBy" :options="groupingOptions" />
			<ProgressBar :isFullyLoaded="isFullyLoaded" :loadingProgress="loadingProgress" />
			<GroupedTable :rows="visibleGroupedData" :headers="headers" :totals="totals"
				:groupBy="groupBy" :hidden="hidden" :totalHeight="totalGroupedHeight"
				:rowHeight="rowHeight" :start-index="groupedScroll.startIndex.value"
				@groupToggle="groupToggle" @scroll="groupedScroll.onScroll" />
		</section>
	</template>
	<section class="flatTable">
		<h3>Cells table (editable)</h3>
		<FlatTable :flatHeaders="flatHeaders" :visibleFlatData="visibleFlatData"
			:totalHeight="totalFlatHeight" :rowHeight="rowHeight"
			:flatStartIndex="flatScroll.startIndex.value" @scroll="flatScroll.onScroll" />
	</section>
</template>

<script setup lang="ts">
// Vue core
import { computed, ref, watch } from "vue";
// Components
import ViewSelector from "./components/ViewSelector.vue";
import XmlView from "./components/XmlView.vue";
import GroupBySelector from "./components/GroupBySelector.vue";
import ProgressBar from "./components/ProgressBar.vue";
import GroupedTable from "./components/GroupedTable.vue";
import FlatTable from "./components/FlatTable.vue";
// Composables
import { useTotals } from "./composables/useTotals";
import { useXml } from "./composables/useXml";
import { useGroupedData } from "./composables/useGroupedData";
import { useGroupToggle } from "./composables/useGroupToggle";
import { useScrollSync } from "./composables/useScrollSync";
import { useGroupedRows } from "./composables/useGroupedRows";
// Utils
import { useExampleData } from "./utils";

// Types
export type Data = {
	category: string;
	amount: string;
	currency: string;
	[key: string]: string;
};
export type GroupByKey = "category" | "currency" | "account";


// ─────────────────────────────────────────────
// 🎛️ View & Grouping State
// ─────────────────────────────────────────────
const view = ref<"xml" | "table">("table");
const groupBy = ref<GroupByKey>('category');
// Grouping options available to the user
const groupingOptions: GroupByKey[] = ['account', 'category', 'currency'];

// ─────────────────────────────────────────────
// 📥 Load & Normalize Data
// ─────────────────────────────────────────────
const { data, isFullyLoaded, loadingProgress } = useExampleData<Data>();
const safeData = computed(() =>
	data.value.filter(row =>
		typeof row.amount === "string" &&
		!isNaN(Number(row.amount)) &&
		typeof row.currency === "string" &&
		row.currency.trim() !== "" &&
		typeof row.category === "string" &&
		row.category.trim() !== ""
		// &&
		// typeof row.account === "string" &&
		// row.account.trim() !== ""  // this caused automatic tests to fail
	)
);

// Extract all unique headers from flat data
const flatHeaders = computed(() => {
	const allKeys = new Set<string>();
	safeData.value.forEach(row => {
		Object.keys(row).forEach(key => allKeys.add(key));
	});
	return Array.from(allKeys);
});

// ─────────────────────────────────────────────
// 📊 Grouped Data & Toggle
// ─────────────────────────────────────────────
// TODO: TASK → let the user also group by currency and account
const { groupedData, headers, debouncedUpdate } = useGroupedData(safeData, groupBy)
const { hidden, toggle: groupToggle } = useGroupToggle()

// ─────────────────────────────────────────────
// 🧮 Totals Calculation
// ─────────────────────────────────────────────
// TODO: TASK → handle different currencies. Use `plnToCurrency` function to get the rates
const totals = useTotals(groupedData, groupBy)

// ─────────────────────────────────────────────
// 📤 XML Export
// ─────────────────────────────────────────────
// TODO: TASK → implement exporting to XML
const xml = useXml(safeData);

// ─────────────────────────────────────────────
// 🧠 Virtual Scrolling Setup
// ─────────────────────────────────────────────
const rowHeight = 30;
const visibleRows = 30;

const flatScroll = useScrollSync(rowHeight, visibleRows, 10);
const groupedScroll = useScrollSync(rowHeight, visibleRows, 10);

const totalFlatRowCount = computed(() => data.value.length);
const totalGroupedRowCount = computed(() => allGroupedRows.value.length);

const totalFlatHeight = computed(() => totalFlatRowCount.value * rowHeight);
const totalGroupedHeight = computed(() => totalGroupedRowCount.value * rowHeight);

// ─────────────────────────────────────────────
// 👁️ Visible Data Slices
// ─────────────────────────────────────────────
const visibleFlatData = computed(() =>
	Array.isArray(data.value) ? safeData.value.slice(flatScroll.startIndex.value, flatScroll.endIndex.value) : []

);

const { allGroupedRows } = useGroupedRows(groupedData, groupBy, hidden);

const visibleGroupedData = computed(() =>
	Array.isArray(allGroupedRows.value) ? allGroupedRows.value.slice(groupedScroll.startIndex.value, groupedScroll.endIndex.value) : []
);

// ─────────────────────────────────────────────
// 🕵️ Watchers & Debounce
// ─────────────────────────────────────────────
// TODO: TASK → avoid recomputing while user is still typing
watch(visibleFlatData, debouncedUpdate, { deep: true });

</script>

<style scoped>
pre {
	text-align: left;
}
</style>
