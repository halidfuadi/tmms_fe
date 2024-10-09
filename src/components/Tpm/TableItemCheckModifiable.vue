<template>
  <CCard>
    <CCardBody class="overflow-auto">
      <table class="table table-bordered table-striped" responsive="md">
        <thead>
          <tr>
            <th class="item-check text-center">Line</th>
            <th class="item-check text-center">Machine</th>
            <th class="item-check text-center">Item Check</th>
            <th class="item-check text-center">Details</th>
            <th class="item-check text-center">Item Location</th>
            <th class="item-check text-center" colspan="2">Periodic</th>
            <th class="item-check text-center">MP</th>
            <th class="item-check text-center">Duration</th>
            <th class="item-check text-center">Standard</th>
            <th class="item-check text-center">Methods</th>
            <th class="item-check text-center">Incharge</th>
            <th class="item-check text-center">Upper</th>
            <th class="item-check text-center">Lower</th>
            <th class="actions text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="items && items.length > 0">
            <template v-for="(item, i) in items" :key="i">
              <tr style="vertical-align: middle;">
                <td class="text-center">
                  {{ item.line_nm }}
                </td>
                <td class="text-center">
                  {{ item.machine_nm }}
                </td>
                <td class="item-check text-center">{{ item?.itemcheck_nm }}</td>
                <td class="item-check text-center">
                  <CFormTextarea
                    v-model="item.details"
                    :value="item?.details"
                  />
                </td>
                <td class="item-check text-center">
                  <input v-model="item.itemcheck_loc" class="form-control" />
                </td>
                <td v-if="!item.is_counter" class="item-check text-center">
                  <input v-model="item.val_periodic" class="form-control" />
                </td>
                <td v-if="item.is_counter" class="item-check text-center">
                  <input v-model="item.lifespan_counter" class="form-control" />
                </td>
                <td v-if="!item.is_counter" class="item-check text-center">
                  <input v-model="item.period_nm" class="form-control" />
                </td>
                <td v-if="item.is_counter" class="item-check text-center">
                  CYCLE
                </td>
                <td class="item-check text-center">
                  <input type="number" v-model="item.mp" class="form-control" />
                </td>
                <td class="item-check text-center">{{ item?.duration }}</td>
                <td class="item-check text-center">
                  {{
                    item?.standard_measurement == ""
                      ? "OK"
                      : item?.standard_measurement
                  }}
                </td>
                <td class="item-check text-center">
                  <input v-model="item.method_check" class="form-control" />
                </td>
                <td class="item-check text-center">
                  <input v-model="item.incharge_nm" class="form-control" />
                </td>
                <td class="item-check text-center">
                  <input v-model="item.upper_limit" class="form-control" />
                </td>
                <td class="item-check text-center">
                  <input v-model="item.lower_limit" class="form-control" />
                </td>
                <td>
                  <slot name="action" :item="item" :index="i"> </slot>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td :colspan="15" class="text-center">
                ~ Add Item Check By Filling Form ~
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </CCardBody>
  </CCard>
</template>

<script>
import api from "@/apis/CommonAPI";
import { CIcon } from "@coreui/icons-vue";

export default {
  name: "TableItemCheckModifiable",
  props: {
    items: Array,
  },
  components: {
    CIcon,
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {
    showItemCheckDetail(item = null) {},
  },
};
</script>
