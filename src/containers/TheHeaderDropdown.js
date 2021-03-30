import React, { useState, useRef, useEffect } from "react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CFormGroup,
  CInput,
  CLabel,
  CForm,
  CInvalidFeedback,
  CRow,
  CCol,
  CSelect,
} from "@coreui/react";
import { TextMask, InputAdapter } from "react-text-mask-hoc";
import CIcon from "@coreui/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "src/actions/redirect";
import { Redirect } from "react-router-dom";
import { setLoginExpired } from "src/actions/authen";
import {
  changePassword,
  getUserByAuthen,
  updateUserProfile,
} from "src/services/UserService";
import * as Yup from "yup";
import { Formik } from "formik";
import { getPrefixes } from "src/services/CommonService";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { PATH_IMAGE_PROFILE } from "src/config"

const TheHeaderDropdown = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.authen.isAuth);
  const redirectTo = useSelector((state) => state.redirect.redirectTo);
  const accessToken = useSelector((state) => state.authen.access_token);
  const [modalChangePassword, setModalChangePassword] = useState(false);
  const [modalUser, setModalUser] = useState(false);
  const [prefixes, setPrefixes] = useState([]);
  const formikRef = useRef();
  const MySwal = withReactContent(Swal);
  const imageProfile = useSelector((state) => state.authen.imageProfile);
  const [pictureProfile, setPictureProfile] = useState(null);

  const editUserProfileSchema = () => {
    let schema = {
      username: Yup.string()
        .min(2, "Username has to be at least 2 characters")
        .required("Username is required!"),
      prefix: Yup.string().required("Prefix is required!"),
      firstName: Yup.string().required("Firstname is required!"),
      lastName: Yup.string().required("Lastname is required!"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required!"),
      lineId: Yup.string().required("Line ID is required!"),
      mobileNo: Yup.string()
        .matches(/[0]{1}\d{9}/, "Mobile No must contain only numbers")
        .required("Mobile No is required!"),
    };
    return Yup.object().shape(schema);
  };

  const addUserSchema = () => {
    let schema = {
      newPassword: Yup.string().required("กรุณาระบุ password"),
    };

    return Yup.object().shape(schema);
  };

  const handleChangePassword = (values, { resetForm }) => {
    changePassword(accessToken, values.newPassword)
      .then((response) => {
        if (response.status === 200) {
          setModalChangePassword(!modalChangePassword);
        } else {
        }
      })
      .then(() => {});
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    dispatch(redirect("/"));
    dispatch(setLoginExpired());
  };

  const handleEditProfile = (values, { resetForm }) => {
    const { prefix, firstName, lastName, email, lineId, mobileNo } = values;

    let body = {
      prefix,
      firstName,
      lastName,
      email,
      lineId,
      mobileNo,
    };
    
    updateUserProfile(accessToken, body)
      .then((response) => {
        if (response.status === 200) {
          MySwal.fire({
            title: "Success",
            text: "Edit user information successfully  ",
            icon: "success",
            didClose: () => {
              setModalUser(false);
            },
          });
        } else {
          MySwal.fire({
            title: "Failed",
            text: response.data,
            icon: "error",
            didClose: () => {
              setModalUser(false);
            },
          });
        }
      })
      .then(() => {
        //resetForm(initialValues);
      });
  };

  const editUser = () => {
    getPrefixes(accessToken).then(({ status, data }) => {
      return status === 200 ? setPrefixes(data) : setPrefixes([]);
    });

    getUserByAuthen(accessToken).then((user) => {
      formikRef.current.setFieldValue("username", user.data.username);
      formikRef.current.setFieldValue("prefix", user.data.prefixId);
      formikRef.current.setFieldValue("firstName", user.data.firstName);
      formikRef.current.setFieldValue("lastName", user.data.lastName);
      formikRef.current.setFieldValue(
        "email",
        user.data.email === null ? "" : user.data.email
      );
      formikRef.current.setFieldValue(
        "lineId",
        user.data.lineId === null ? "" : user.data.lineId
      );
      formikRef.current.setFieldValue(
        "mobileNo",
        user.data.mobileNo === null ? "" : user.data.mobileNo
      );
      setModalUser(!modalUser);
    });
  };

  useEffect(() => {
    setPictureProfile((imageProfile === "" || imageProfile === null) ? "/avatars/avatar.jpg" : PATH_IMAGE_PROFILE + "/" + imageProfile);
  },[])
  
  if (!isAuth) {
    return <Redirect to={redirectTo} push={true} />;
  }
  

  return (
    
     <>
      <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <div className="c-avatar">
          
            <CImg
              src={pictureProfile}
              className="c-avatar-img"
            />
          </div>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          {/*<CDropdownItem header tag="div" color="light" className="text-center">
          <strong>Account</strong>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-bell" className="mfe-2" />
          Updates
          <CBadge color="info" className="mfs-auto">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-envelope-open" className="mfe-2" />
          Messages
          <CBadge color="success" className="mfs-auto">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-task" className="mfe-2" />
          Tasks
          <CBadge color="danger" className="mfs-auto">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-comment-square" className="mfe-2" />
          Comments
          <CBadge color="warning" className="mfs-auto">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>Settings</strong>
        </CDropdownItem>*/}
          <CDropdownItem>
            <div onClick={() => setModalChangePassword(!modalChangePassword)}>
              <CIcon name="cil-user" className="mfe-2" />
              เปลี่ยน password
            </div>
          </CDropdownItem>
          <CDropdownItem>
            <div onClick={() => editUser()}>
              <CIcon name="cil-user" className="mfe-2" />
              แก้ไขข้อมูลส่วนตัว
            </div>
          </CDropdownItem>
          {/*<CDropdownItem>
          <CIcon name="cil-settings" className="mfe-2" />
          Settings
        </CDropdownItem>*/}
          <CDropdownItem onClick={handleSignOut}>
            <CIcon name="cil-account-logout" className="mfe-2" />
            Sign out
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <CModal
        show={modalChangePassword}
        onClose={() => setModalChangePassword(!modalChangePassword)}
        size="sm"
      >
        <Formik
          enableReinitializing={true}
          initialValues={{
            newPassword: "",
          }}
          validationSchema={addUserSchema}
          onSubmit={handleChangePassword}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
          }) => (
            <CForm onSubmit={handleSubmit} noValidate>
              <CModalHeader closeButton>
                <CModalTitle>Change password</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CFormGroup>
                  <CLabel>New password</CLabel>
                  <CInput
                    type="password"
                    name="newPassword"
                    valid={!!values.newPassword}
                    invalid={touched.newPassword && !!errors.newPassword}
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CInvalidFeedback>{errors.newPassword}</CInvalidFeedback>
                </CFormGroup>
              </CModalBody>
              <CModalFooter>
                <CButton color="primary" type="submit">
                  Submit
                </CButton>{" "}
                <CButton
                  color="secondary"
                  onClick={() => setModalChangePassword(!modalChangePassword)}
                >
                  Cancel
                </CButton>
              </CModalFooter>
            </CForm>
          )}
        </Formik>
      </CModal>
      <Formik
        innerRef={formikRef}
        enableReinitializing={true}
        initialValues={{
          username: "",
          prefix: "",
          firstName: "",
          lastName: "",
          email: "",
          lineId: "",
          mobileNo: "",
        }}
        validationSchema={editUserProfileSchema}
        onSubmit={handleEditProfile}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        }) => (
          <CForm onSubmit={handleSubmit} noValidate>
            <CModal size="lg" centered show={modalUser} closeOnBackdrop={true}>
              <CModalBody className="p-4">
                <CRow>
                  <CCol xs={12} md={4} lg={3}>
                    <h4>แก้ไขข้อมูลส่วนตัว</h4>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormGroup>
                      <CCol md="3">
                        <CLabel className="font-weight-bold">Username:</CLabel>
                      </CCol>
                      <CCol xs={12} md={9} lg={8}>
                        <CInput
                          id="username"
                          name="username"
                          placeholder=""
                          valid={!!values.username}
                          invalid={touched.username && !!errors.username}
                          value={values.username}
                          disabled={true}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <CInvalidFeedback>{errors.username}</CInvalidFeedback>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs={12} md={4} lg={4}>
                    <CFormGroup>
                      <CCol>
                        <CLabel
                          className="font-weight-bold"
                          htmlFor="text-input"
                        >
                          คำนำหน้า:
                        </CLabel>
                      </CCol>
                      <CCol>
                        <CSelect
                          custom
                          name="prefix"
                          id="prefix"
                          valid={!!values.prefix}
                          invalid={touched.prefix && !!errors.prefix}
                          value={values.prefix}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">Please select</option>
                          {prefixes.map((prefix) => (
                            <option key={prefix.key} value={prefix.key}>
                              {prefix.value}
                            </option>
                          ))}
                        </CSelect>
                        <CInvalidFeedback>{errors.prefix}</CInvalidFeedback>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xs={12} md={4} lg={4}>
                    <CFormGroup>
                      <CCol>
                        <CLabel
                          className="font-weight-bold"
                          htmlFor="text-input"
                        >
                          ชื่อ:
                        </CLabel>
                      </CCol>
                      <CCol>
                        <CInput
                          id="firstName"
                          name="firstName"
                          valid={!!values.firstName}
                          invalid={touched.firstName && !!errors.firstName}
                          placeholder=""
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <CInvalidFeedback>{errors.firstName}</CInvalidFeedback>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xs={12} md={4} lg={4}>
                    <CFormGroup>
                      <CCol>
                        <CLabel
                          className="font-weight-bold"
                          htmlFor="text-input"
                        >
                          นามสกุล:
                        </CLabel>
                      </CCol>
                      <CCol>
                        <CInput
                          id="lastName"
                          name="lastName"
                          placeholder=""
                          valid={!!values.lastName}
                          invalid={touched.lastName && !!errors.lastName}
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <CInvalidFeedback>{errors.lastName}</CInvalidFeedback>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs={12} md={4} lg={4}>
                    <CFormGroup>
                      <CCol>
                        <CLabel
                          className="font-weight-bold"
                          htmlFor="text-input"
                        >
                          Email:
                        </CLabel>
                      </CCol>
                      <CCol>
                        <CInput
                          id="email"
                          name="email"
                          placeholder=""
                          valid={!!values.email}
                          invalid={touched.email && !!errors.email}
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <CInvalidFeedback>{errors.email}</CInvalidFeedback>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xs={12} md={4} lg={4}>
                    <CFormGroup>
                      <CCol>
                        <CLabel
                          className="font-weight-bold"
                          htmlFor="text-input"
                        >
                          Line ID:
                        </CLabel>
                      </CCol>
                      <CCol>
                        <CInput
                          id="lineId"
                          name="lineId"
                          placeholder=""
                          valid={!!values.lineId}
                          invalid={touched.lineId && !!errors.lineId}
                          value={values.lineId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <CInvalidFeedback>{errors.lineId}</CInvalidFeedback>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xs={12} md={4} lg={4}>
                    <CFormGroup>
                      <CCol>
                        <CLabel
                          className="font-weight-bold"
                          htmlFor="text-input"
                        >
                          Mobile No:
                        </CLabel>
                      </CCol>
                      <CCol>
                        <TextMask
                          placeholder=""
                          mask={[
                            /[0]/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                          ]}
                          id="mobileNo"
                          name="mobileNo"
                          Component={InputAdapter}
                          className={`form-control ${
                            errors.mobileNo && touched.mobileNo
                              ? "is-invalid"
                              : ""
                          } ${values.mobileNo ? "is-valid" : ""}`}
                          value={values.mobileNo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <CInvalidFeedback>{errors.mobileNo}</CInvalidFeedback>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter>
                <CButton
                  type="reset"
                  color="light"
                  onClick={(e) => setModalUser(!modalUser)}
                >
                  Cancel
                </CButton>
                <CButton type="submit" color="primary">
                  Confirm
                </CButton>{" "}
              </CModalFooter>
            </CModal>
          </CForm>
        )}
      </Formik>
    </>
  );
};

export default TheHeaderDropdown;
