import React, { useState, useRef, useEffect } from "react";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CFormGroup,
  CLabel,
  CInput,
  CSelect,
  CForm,
  CInvalidFeedback,
} from "@coreui/react";
import { TextMask, InputAdapter } from "react-text-mask-hoc";
import { addUser, editUser } from "src/services/UserService";
import { useSelector } from "react-redux";
import { getMappingOverPassAll } from "src/services/MappingService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { capitalize } from "src/utils/common";
import { roleUserControl, userFullAccess } from "src/config";
import * as Yup from "yup";
import { Formik } from "formik";
import { Redirect } from "react-router-dom";
import UploadPreview from "src/components/UploadPreview"


const MySwal = withReactContent(Swal);

const UserAddEdit = (props) => {
  const {
    action,
    modal,
    setModal,
    itemDetail,
    reloadData,
    roles,
    statuses,
    prefixes,
    handleReset,
  } = props;
  const formikRef = useRef();
  const isAuth = useSelector((state) => state.authen.isAuth);
  const isEdit = action === "add" ? false : true;
  const accessToken = useSelector((state) => state.authen.access_token);
  const [loading, setLoading] = useState(false);
  const userRole = useSelector((state) => state.authen.role);
  const [groupList, setGroupList] = useState([]);
  const [imageProfile, setImageProfile] = useState(null);

  const addUserSchema = () => {
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
      role: Yup.string().required("Role is required!"),
      groupId: Yup.string().required("Group is required!"),
      
    };
    if(isEdit){
      schema = {...schema, status: Yup.string().required("Status is required!"),}
    }
    return Yup.object().shape(schema);
  };

  const handleCloseAddModal = (e, handleReset) => {
    handleReset();
    setModal(false);
  };

  const handleAdd = (values, { resetForm }) => {
    const {
      username,
      prefix,
      firstName,
      lastName,
      role,
      email,
      lineId,
      mobileNo,
      groupId,
      status
    } = values;
    let body = new FormData();
    body.append("username", username);
    body.append("prefix", prefix);
    body.append("firstName", firstName);
    body.append("lastName", lastName);
    body.append("role", role);
    body.append("email", email);
    body.append("lineId", lineId);
    body.append("mobileNo", mobileNo);
    body.append("groupId", groupId);
    body.append("status", status);
    body.append("imageProfile", imageProfile);

    /*if (userFullAccess.includes(userRole)) {
      body = {
        ...body,
      };
    }*/
    if(isEdit){
      editUser(accessToken, body)
      .then((response) => {
        if (response.status === 200) {
          //handleReset();
          setLoading(false);
          MySwal.fire({
            title: "Success",
            text: "Edit user information successfully  ",
            icon: "success",
            didClose: () => {
              setModal(false);
              reloadData();
            },
          });
        } else {
          setLoading(false);
          MySwal.fire({
            title: "Failed",
            text: response.data,
            icon: "error",
            didClose: () => {
              setModal(false);
              reloadData();
            },
          });
        }
      })
      .then(() => {
        //resetForm(initialValues);
      });
    }else{
      addUser(accessToken, body)
      .then((response) => {
        if (response.status === 200) {
          //handleReset();
          setLoading(false);
          MySwal.fire({
            title: "Success",
            text: "Add user information successfully  ",
            icon: "success",
            didClose: () => {
              setModal(false);
              reloadData();
            },
          });
        } else {
          setLoading(false);
          MySwal.fire({
            title: "Failed",
            text: response.data,
            icon: "error",
            didClose: () => {
              setModal(false);
              reloadData();
            },
          });
        }
      })
      .then(() => {
        //resetForm(initialValues);
      });
    }
  };

  const changeImageProfile = e => {
    console.log(e)
    setImageProfile(e)
  }

  useEffect(() => {
    if(groupList.length === 0){
      getMappingOverPassAll(accessToken).then(({ status, data }) => {
        return status === 200 ? setGroupList(data) : setGroupList([]);
      });
    }
    
    formikRef.current.resetForm();
    if(isEdit){
      
     formikRef.current.setFieldValue("username", itemDetail.username);
     formikRef.current.setFieldValue("prefix", itemDetail.prefixId);
     formikRef.current.setFieldValue("firstName", itemDetail.firstName);
     formikRef.current.setFieldValue("lastName", itemDetail.lastName);
     formikRef.current.setFieldValue("email", itemDetail.email);
     formikRef.current.setFieldValue("lineId", itemDetail.lineId);
     formikRef.current.setFieldValue("mobileNo", itemDetail.mobileNo);
     formikRef.current.setFieldValue("role", itemDetail.role);
     formikRef.current.setFieldValue("groupId", itemDetail.groupId);
     formikRef.current.setFieldValue("status", itemDetail.status);
     //formikRef.current.setFieldValue("imageProfile", PATH_IMAGE_PROFILE + "/" + itemDetail.iamge);
    }
  }, [modal]);

  if (!isAuth) {
    return <Redirect to="/" />;
  } else if (!['SUPER_ADMIN', 'ADMIN'].includes(userRole)) {
    return <Redirect to="/dashboard" />;
  }

  return (
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
        role: "",
        groupId: "",
        status: "ACTIVE",
      }}
      validationSchema={addUserSchema}
      onSubmit={handleAdd}
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
        <CForm onSubmit={handleSubmit} noValidate name="addUserForm">
          <CModal size="lg" centered show={modal} closeOnBackdrop={false}>
            {loading && (
              <div className={loading ? "spinner-container" : ""}>
                <div className="position-absolute spinner-center">
                  <div className="sk-grid mx-auto">
                    <div className="sk-grid-cube"></div>
                    <div className="sk-grid-cube"></div>
                    <div className="sk-grid-cube"></div>
                    <div className="sk-grid-cube"></div>
                    <div className="sk-grid-cube"></div>
                    <div className="sk-grid-cube"></div>
                    <div className="sk-grid-cube"></div>
                    <div className="sk-grid-cube"></div>
                    <div className="sk-grid-cube"></div>
                  </div>
                  <div className="text-center">Loading....</div>
                </div>
              </div>
            )}
            <CModalBody className="p-4">
              <CRow>
                <CCol xs={12} md={4} lg={3}>
                  <h4>{(isEdit) ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน"}</h4>
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
                        disabled={isEdit}
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
                      <CLabel className="font-weight-bold" htmlFor="text-input">
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
                      <CLabel className="font-weight-bold" htmlFor="text-input">
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
                      <CLabel className="font-weight-bold" htmlFor="text-input">
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
                      <CLabel className="font-weight-bold" htmlFor="text-input">
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
                      <CLabel className="font-weight-bold" htmlFor="text-input">
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
                      <CLabel className="font-weight-bold" htmlFor="text-input">
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
              <CRow>
                <CCol xs={12} md={4} lg={4}>
                  <CFormGroup>
                    <CCol>
                      <CLabel className="font-weight-bold" htmlFor="text-input">
                        Role:
                      </CLabel>
                    </CCol>
                    <CCol>
                      <CSelect
                        custom
                        name="role"
                        id="role"
                        valid={!!values.role}
                        invalid={touched.role && !!errors.role}
                        value={values.role}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="">Please select</option>
                        {roles.map(
                          (role) =>
                            roleUserControl[userRole].includes(role.value) && (
                              <option key={role.key} value={role.key}>
                                {capitalize(role.value.toLowerCase())}
                              </option>
                            )
                        )}
                      </CSelect>
                      <CInvalidFeedback>{errors.role}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
                {(isEdit) &&
                  <CCol xs={12} md={4} lg={4}>
                  <CFormGroup>
                    <CCol>
                      <CLabel className="font-weight-bold" htmlFor="text-input">
                        Status:
                      </CLabel>
                    </CCol>
                    <CCol>
                      <CSelect
                        custom
                        name="status"
                        id="status"
                        valid={!!values.status}
                        invalid={touched.status && !!errors.status}
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="">Please select</option>
                        {statuses.map((status) => (
                          <option key={status.key} value={status.value}>
                            {status.value}
                          </option>
                        ))}
                      </CSelect>
                      <CInvalidFeedback>{errors.status}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>

                }
                
                <CCol xs={12} md={4} lg={4}>
                  <CFormGroup>
                    <CCol>
                      <CLabel className="font-weight-bold" htmlFor="text-input">
                        Group:
                      </CLabel>
                    </CCol>
                    <CCol>
                      <CSelect
                        custom
                        name="groupId"
                        id="groupId"
                        valid={!!values.groupId}
                        invalid={touched.groupId && !!errors.groupId}
                        value={values.groupId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="0">Please select</option>
                        {groupList.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.groupName}
                          </option>
                        ))}
                      </CSelect>
                      <CInvalidFeedback>{errors.groupId}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12} md={12} lg={12}>
                
                 {/* <UploadPreview onInputChange={changeImageProfile}/>*/}
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton
                type="reset"
                color="light"
                onClick={(e) => handleCloseAddModal(e, handleReset)}
              >
                Cancel
              </CButton>
              <CButton type="submit" color="primary" disabled={loading}>
                Confirm
              </CButton>{" "}
            </CModalFooter>
          </CModal>
        </CForm>
      )}
    </Formik>
  )
};

export default UserAddEdit;
