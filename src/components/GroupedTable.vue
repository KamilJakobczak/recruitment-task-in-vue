<template>
   <!-- Scrollable container for virtualized grouped table -->
   <div class="groupedTableContainer" @scroll="$emit('scroll', $event)" ref="container"
      style="position: relative; overflow-y: auto; height: 600px;">

      <!-- Spacer div to simulate full scroll height -->
      <div :style="{ height: totalHeight + 'px' }"></div>

      <!-- Offset container for visible rows -->
      <div :style="{ position: 'absolute', top: startIndex * rowHeight + 'px', left: 0, right: 0 }">
         <table style="width: 100%">
            <thead class="sticky-header">
               <tr class="header">
                  <!-- Render table headers -->
                  <td v-for="header in headers" :key="header">{{ header }}</td>
               </tr>
            </thead>

            <tbody>

               <!-- Render visible rows: group headers, data rows, and totals -->
               <tr v-for="(row, idx) in rows" :key="startIndex + idx" :class="{
                  group: row.type === 'group',
                  'group-total-row': row.type === 'total',
               }" @click="row.type === 'group' ? $emit('groupToggle', row.key) : null">

                  <!-- Group Header Row -->
                  <td v-if="row.type === 'group'" :colspan="headers.length">
                     <div class="group-row">
                        <span class="group-label">{{ row.key }}</span>
                        <span class="group-total" v-if="totals[row.key] !== undefined">
									{{ totals[row.key].toFixed(2) }}
									<span class="group-currency">
										{{ groupBy === 'currency' ? row.key : 'PLN' }}
									</span>
                        </span>
                     </div>
                  </td>

                  <!-- Group Data Row -->
                  <template v-else-if="row.type === 'data'">
                     <td v-for="(value, i) in row.flatRow" :key="i">{{ value }}</td>
                  </template>

                  <!-- Group Total Row -->
                  <td v-else-if="row.type === 'total'" :colspan="headers.length"
                     style="text-align: right">
                     <span class="group-total-label">Total:</span>
                     <span class="group-total-amount">
      {{ totals[row.key]?.toFixed(2) }}
      <span class="group-currency">
         {{ groupBy === 'currency' ? row.key : 'PLN' }}
      </span>
                     </span>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
   </div>
</template>

<script setup lang="ts">

defineProps<{
   rows: {
      type: 'group' | 'data' | 'total';
      key: string;
      flatRow?: string[];
   }[];
   headers: string[];
   totals: Record<string, number>;
   groupBy: 'account' | 'category' | 'currency';
   hidden: Set<string>;
   totalHeight: number;
   rowHeight: number;
   startIndex: number;
}>();

defineEmits(['groupToggle', 'scroll']);
</script>