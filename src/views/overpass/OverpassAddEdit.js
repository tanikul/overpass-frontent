import React, { useState, useEffect, useRef } from "react";
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
import { addOverpass, editOverpass } from "src/services/OverpassService";
import { useSelector } from "react-redux";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { capitalize } from "src/utils/common";
import { roleUserControl, userFullAccess } from "src/config";
import * as Yup from "yup";
import { Formik, Field } from "formik";

const MySwal = withReactContent(Swal);

const OverpassAddEdit = (props) => {
  const {
    action,
    modal,
    setModal,
    itemDetail,
    reloadData,
    provinces,
    statuses
  } = props;

  const formikRef = useRef();
  const isEdit = action === "add" ? false : true;
  const checkId = (itemDetail.id && isEdit) ? itemDetail.id : "";
  const accessToken = useSelector((state) => state.authen.access_token);
  const [loading, setLoading] = useState(false);
  const [amphurs, setAmphurs] = useState([]);
  const [districts, setDistricts] = useState([]);

  const addUserSchema = () => {
    let schema = {
      id: Yup.string()
        //.min(2, "Username has to be at least 2 characters")
        .required("ID is required!"),
      name: Yup.string().required("Name is required!"),
      province: Yup.string().required("Province is required!"),
      amphur: Yup.string().required("Amphur is required!"),
      //district: Yup.string().required("District is required!"),
      latitude: Yup.string().required("Latitude is required!"),
      longtitude: Yup.string().required("Longtitude is required!"),
      setpointWatt: Yup.string().required("Setpoint Watt is required!"),
      status: Yup.string().required("Status is required!")
    };

    return Yup.object().shape(schema);
  };

  const selectProvince = (id) => {
    let a = provinces.find((val) => { return val.key == id });

    formikRef.current.setFieldValue("province", id);
    formikRef.current.setFieldValue("postcode", "");
    setAmphurs(a ?  a.amphur : []);
    setDistricts([]);
  };
  
  const selectAmphur = (e) => {
    let id = e.target.value;
    let ds = amphurs.find((val) => { return val.key == id });
    setDistricts(ds ? ds.district : []);
    formikRef.current.setFieldValue("amphur", id);
    formikRef.current.setFieldValue("postcode", amphurs.find((val) => { return val.key == id }).postCode);
  };


  const handleCloseAddModal = () => {
   setModal(false);
  };

  const handleAdd = (values, { resetForm }) => {
    
   const {
      id,
      name,
      location,
      district,
      amphur,
      province,
      latitude,
      longtitude,
      setpointWatt,
      postcode,
      status
    } = values;

    let body = {
      id,
      name,
      location,
      district,
      amphur,
      province,
      postcode,
      latitude,
      longtitude,
      setpointWatt,
      status
    };
    
    if(isEdit){
      editOverpass(accessToken, body)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          MySwal.fire({
            title: "Success",
            text: "Add Overpass information successfully  ",
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
        //resetForm();
      });
    }else{
      addOverpass(accessToken, body)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          MySwal.fire({
            title: "Success",
            text: "Add Overpass information successfully  ",
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
        resetForm();
      });
    }
  };
  useEffect(() => {
    formikRef.current.resetForm();
    if(isEdit){
      if(itemDetail.province){
        let a = provinces.find((val) => { return val.key == itemDetail.province });
        setAmphurs(a.amphur);
        let d = a.amphur.find((val) => { return val.key == itemDetail.amphur });
        if(d !== null){
          setDistricts(d.district);
        }
      }
     formikRef.current.setFieldValue("id", itemDetail.id);
     formikRef.current.setFieldValue("name", itemDetail.name);
     formikRef.current.setFieldValue("setpointWatt", itemDetail.setpointWatt);
     formikRef.current.setFieldValue("latitude", itemDetail.latitude);
     formikRef.current.setFieldValue("longtitude", itemDetail.longtitude);
     formikRef.current.setFieldValue("district", itemDetail.district);
     formikRef.current.setFieldValue("amphur", itemDetail.amphur);
     formikRef.current.setFieldValue("province", itemDetail.province);
     formikRef.current.setFieldValue("postcode", itemDetail.postcode);
     formikRef.current.setFieldValue("location", itemDetail.location);
    }
  }, [itemDetail, isEdit]);
  
  return (
    <Formik
      innerRef={formikRef}
      enableReinitializing={true}
      initialValues={{ 
        id: "",
        name: "",
        setpointWatt: 0,
        latitude: "",
        longtitude: "",
        location: "",
        district: "",
        amphur: "",
        province: "",
        postcode: "",
        status: ""
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
        handleReset
      }) => 
      (
        <CForm onSubmit={handleSubmit} noValidate name="addUserForm">
          <CModal size="lg" centered show={modal} closeOnBackdrop={false} onClose={handleCloseAddModal}>
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
                <CCol xs={6} className="mb-3 mt-2">
                  <h4>{(isEdit) ? "แก้ไขสะพานลอย" : "เพิ่มสะพานลอย"}</h4>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={6}>
                  <CFormGroup>
                    <CCol md="3">
                      <CLabel className="font-weight-bold">ID:</CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CInput
                        id="id"
                        name="id"
                        placeholder=""
                        valid={!!values.id}
                        invalid={touched.id && !!errors.id}
                        value={values.id}
                        disabled={isEdit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CInvalidFeedback>{errors.id}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol xs={6}>
                  <CFormGroup>
                    <CCol xs={12}>
                      <CLabel className="font-weight-bold" htmlFor="text-input">
                        Name:
                      </CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CInput
                        id="name"
                        name="name"
                        valid={!!values.name}
                        invalid={touched.name && !!errors.name}
                        placeholder=""
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CInvalidFeedback>{errors.name}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={8}>
                  <CFormGroup>
                    <CCol xs={8}>
                      <CLabel className="font-weight-bold" htmlFor="text-input">
                        Location:
                      </CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CInput
                        id="location"
                        name="location"
                        valid={!!values.location}
                        invalid={touched.location && !!errors.location}
                        placeholder=""
                        value={values.location}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CInvalidFeedback>{errors.name}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol xs={4}>
                  <CFormGroup>
                    <CCol xs={4}>
                      <CLabel className="font-weight-bold" htmlFor="text-input">
                        Province:
                      </CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CSelect
                        custom
                        name="province"
                        id="province"
                        onChange={e => {
                          handleChange(e);
                          selectProvince(e.target.value);
                        }}
                        onBlur={handleBlur}
                        valid={!!values.province}
                        invalid={touched.province && !!errors.province}
                        value={values.province}
                      >
                        <option value="">Please select</option>
                        {provinces.map((province) => (
                          <option key={province.key} value={province.key}>
                            {capitalize(province.value.toLowerCase())}
                          </option>
                        ))}
                      </CSelect>
                      <CInvalidFeedback>{errors.province}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
                
              </CRow>
              <CRow>
                <CCol xs={4}>
                  <CFormGroup>
                    <CCol xs={6}>
                      <CLabel className="font-weight-bold" htmlFor="text-input">
                        Amphur:
                      </CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CSelect
                        custom
                        name="amphur"
                        id="amphur"
                        onChange={e => {
                          handleChange(e);
                          selectAmphur(e);
                        }}
                        onBlur={handleBlur}
                        valid={!!values.amphur}
                        invalid={touched.amphur && !!errors.amphur}
                        value={values.amphur}
                      >
                        <option value="">Please select</option>
                        {amphurs.map((amphur) => (
                          <option key={amphur.key} value={amphur.key}>
                            {capitalize(amphur.value.toLowerCase())}
                          </option>
                        ))}
                      </CSelect>
                      <CInvalidFeedback>{errors.amphur}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol xs={4}>
                  <CFormGroup>
                    <CCol xs={12}>
                      <CLabel className="font-weight-bold" htmlFor="text-input">
                        District:
                      </CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CSelect
                        custom
                        name="district"
                        id="district"
                        onChange={e => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        valid={!!values.amphurdistrict}
                        invalid={touched.district && !!errors.district}
                        value={values.district}
                      >
                        <option value="">Please select</option>
                        {districts.map((district) => (
                          <option key={district.key} value={district.key}>
                            {capitalize(district.value.toLowerCase())}
                          </option>
                        ))}
                      </CSelect>
                      <CInvalidFeedback>{errors.district}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol xs={4}>
                  <CFormGroup>
                    <CCol xs={12}>
                      <CLabel className="font-weight-bold" htmlFor="text-input">
                        Post code:
                      </CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CInput
                        id="postcode"
                        name="postcode"
                        valid={!!values.postcode}
                        invalid={touched.postcode && !!errors.postcode}
                        placeholder=""
                        value={values.postcode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        readOnly={!!values.postcode}
                      />
                      <CInvalidFeedback>{errors.postcode}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={3}>
                  <CFormGroup>
                    <CCol xs={12}>
                      <CLabel className="font-weight-bold" htmlFor="text-input">
                        Latitude:
                      </CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CInput
                        id="latitude"
                        name="latitude"
                        valid={!!values.latitude}
                        invalid={touched.latitude && !!errors.latitude}
                        placeholder=""
                        value={values.latitude}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CInvalidFeedback>{errors.latitude}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol xs={3}>
                  <CFormGroup>
                    <CCol xs={12}>
                      <CLabel className="font-weight-bold" htmlFor="text-input">
                        Longtitude:
                      </CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CInput
                        id="longtitude"
                        name="longtitude"
                        valid={!!values.longtitude}
                        invalid={touched.longtitude && !!errors.longtitude}
                        placeholder=""
                        value={values.longtitude}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CInvalidFeedback>{errors.longtitude}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol xs={3}>
                  <CFormGroup>
                    <CCol xs={12}>
                      <CLabel className="font-weight-bold" htmlFor="text-input">
                        Setpoint watt:
                      </CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CInput
                        id="setpointWatt"
                        name="setpointWatt"
                        valid={!!values.setpointWatt}
                        invalid={touched.setpointWatt && !!errors.setpointWatt}
                        placeholder=""
                        value={values.setpointWatt}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CInvalidFeedback>{errors.setpointWatt}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol xs={3}>
                  <CFormGroup>
                    <CCol xs={12}>
                      <CLabel className="font-weight-bold" htmlFor="text-input">
                        Status:
                      </CLabel>
                    </CCol>
                    <CCol xs={12}>
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
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton
                type="reset"
                color="light"
                onClick={(e) => handleCloseAddModal()}
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

export default OverpassAddEdit;
