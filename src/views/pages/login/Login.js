import React, { useState } from "react";
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
  CInvalidFeedback,
  CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Formik } from "formik";
import * as Yup from "yup";
import { requestLogin } from "../../../actions/authen";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";
import logos from "../../../assets/icons/logo_inno_sq.png";

const Login = () => {
  const dispatch = useDispatch();
  const authen = useSelector((state) => state.authen, shallowEqual);
  const redirectTo = useSelector((state) => state.redirect.redirectTo);
  const [errorMsg, setErrorMsg] = useState(authen && authen.error && authen.error.message);

  const validationSchema = () => {
    return Yup.object().shape({
      userName: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    });
  };

  const validate = (getValidationSchema) => {
    return (values) => {
      const validationSchema = getValidationSchema(values);
      try {
        validationSchema.validateSync(values, { abortEarly: false });
        return {};
      } catch (error) {
        return getErrorsFromValidationError(error);
      }
    };
  };

  const getErrorsFromValidationError = (validationError) => {
    const FIRST_ERROR = 0;
    return validationError.inner.reduce((errors, error) => {
      return {
        ...errors,
        [error.path]: error.errors[FIRST_ERROR],
      };
    }, {});
  };

  const onSubmit = (values, { setSubmitting }) => {
    const { userName, password, rememberMe } = values;
    const rs = dispatch(requestLogin(userName, password, rememberMe)).then(data => {
      if(data !== undefined && data.status === 401){
        setErrorMsg("username หรือ password ไม่ถูกต้อง")
      }
    });
    setSubmitting(false);
  };

  if (redirectTo && redirectTo !== "/") {
    return <Redirect to={redirectTo} push={true} />;
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CImg
                    src={logos}
                    shape="rounded"
                    fluid
                    align="center"
                    className="mb-4 d-block"
                    width="100"
                    height="100"
                  />
                  <h4 className="text-center">Welcome Back,</h4>
                  <p className="mb-4 text-center text-black-50">
                    Sign in to use your account
                  </p>
                  <CAlert color="danger" show={!!errorMsg}>
                    <CIcon size="sm" name="cil-warning" />
                    <span className="ml-2">{errorMsg}</span>
                  </CAlert>
                  <Formik
                    initialValues={{
                      userName: "",
                      password: "",
                      rememberMe: false,
                    }}
                    validate={validate(validationSchema)}
                    onSubmit={onSubmit}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      isValid,
                    }) => (
                      <CForm
                        onSubmit={handleSubmit}
                        noValidate
                        name="signInForm"
                      >
                        <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="cil-user" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput
                            type="text"
                            id="userName"
                            placeholder="Username"
                            autoComplete="username"
                            valid={!!values.userName}
                            invalid={touched.userName && !!errors.userName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.userName}
                          />
                          <CInvalidFeedback>{errors.userName}</CInvalidFeedback>
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="cil-lock-locked" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput
                            type="password"
                            placeholder="Password"
                            id="password"
                            autoComplete="current-password"
                            valid={!!values.password}
                            invalid={touched.password && !!errors.password}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                          />
                          <CInvalidFeedback>{errors.password}</CInvalidFeedback>
                        </CInputGroup>
                        {/* <CFormGroup
                          variant="checkbox"
                          className="checkbox mb-3"
                        >
                          <CInputCheckbox
                            name="rememberMe"
                            onChange={handleChange}
                            value={values.rememberMe}
                          />
                          <CLabel
                            variant="checkbox"
                            className="form-check-label"
                            htmlFor="remember-me"
                          >
                            Remember me
                          </CLabel>
                        </CFormGroup> */}
                        <CButton
                          type="submit"
                          color="primary"
                          block
                          className="mb-3 font-weight-bold"
                          disabled={isSubmitting || !isValid}
                        >
                          {isSubmitting ? "Signing In..." : "Sign In"}
                        </CButton>
                        {/*<div className="d-flex justify-content-center">
                          <Link to="/reset-password">
                            <CButton className="px-0 text-black-50 text-decoration-none shadow-none">
                              Forgot Password?
                            </CButton>
                          </Link>
                      </div>*/}
                      </CForm>
                    )}
                  </Formik>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
