<template>
  <CCard>
    <CCardHeader>
      <CCardTitle>Rasio MH Planning VS MH Resources</CCardTitle>
    </CCardHeader>
    <CCardBody>
      <CRow>
        <CCol lg="9">
          <CChartMPvsItem />
        </CCol>
        <CCol lg="3">
          <CCard style="height: 100%;">
            <CCardHeader>
              <CCardTitle>
                Input
              </CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol lg="6">
                  <CForm>
                    <CFormInput
                      type="month"
                      label="Start"
                    />
                  </CForm>
                </CCol>
                <CCol lg="6">
                  <CForm>
                    <CFormInput
                      type="month"
                      label="End"
                    />
                  </CForm>
                </CCol>
              </CRow>
              <CForm>
                <CFormInput
                  type="number"
                  label="Man Power"
                />
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CCardBody>
    <CCardFooter>

    </CCardFooter>
  </CCard>
</template>

<script>
import api from "@/apis/CommonAPI";
import CChartMPvsItem from "../../views/charts/CChartMPvsItem.vue";

export default {
  name: 'ItemAndMPtrends',

  components: {
    CChartMPvsItem
  }
}
</script>
