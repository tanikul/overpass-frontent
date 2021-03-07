import React from "react";
import { Link } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

const ResetPassword = () => {
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <CImg
                      src="https://dummyimage.com/100x100/cccccc/ffffff.png"
                      shape="rounded"
                      fluid
                      align="center"
                      className="mb-4 d-block"
                    />
                    <h4 className="mb-3 text-center">Forget Password?</h4>
                    <p className="mb-3 text-center text-black-50">
                      Enter your email and we'll send you instructions to reset
                      your password
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-envelope-closed" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        placeholder="Your email address"
                        autoComplete="email"
                      />
                    </CInputGroup>
                    <Link to="">
                      <CButton
                        color="primary"
                        block
                        className="mb-3 font-weight-bold"
                      >
                        Reset password
                      </CButton>
                    </Link>
                    <div className="d-flex justify-content-center">
                      <Link to="/login">
                        <CButton className="px-0 text-black-50 text-decoration-none shadow-none">
                          {`< Back to Sign in`}
                        </CButton>
                      </Link>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ResetPassword;
