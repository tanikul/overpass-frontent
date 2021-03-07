import React from "react";
import { CRow, CCol, CCard, CCardBody } from "@coreui/react";

const DeviceStatus = ({ color, header, text }) => {
  return (
    <CRow>
      <CCol sm="6" lg="3">
        <CCard className={`bg-${color}`}>
          <CCardBody></CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DeviceStatus;
