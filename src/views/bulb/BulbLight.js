import React, { useEffect, useState, useRef } from "react";
import {
  saveLightBulb,
  updateLightBulb,
  getLightBulbList,
  deleteLightBulb
} from "src/services/LightbulbService";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import {
  CCardBody,
  CButton,
  CDataTable,
  CCard,
  CForm,
  CFormGroup,
  CCol,
  CLabel,
  CInput,
  CCardHeader,
  CInvalidFeedback,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import * as Yup from "yup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "spinkit/spinkit.min.css";

const MySwal = withReactContent(Swal);

const BulbLight = () => {
    
  const accessToken = useSelector((state) => state.authen.access_token);
  const [dataTable, setDataTable] = useState([]);
  const formikRef = useRef();
  const formikRefEdit = useRef();
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteName, setDeleteName] = useState("")
  const [deleteId, setDeleteId] = useState("")
  const [editModal, setEditModal] = useState(false)

  const schema = () => {
    let schema = {
      lightName: Yup.string().required("Light bulb name is required!"),
      watt: Yup.string().required("Watt is required!"),
    };

    return Yup.object().shape(schema);
  };

  const schemaEdit = () => {
    let schema = {
      lightNameEdit: Yup.string().required("Light bulb name is required!"),
      wattEdit: Yup.string().required("Watt is required!"),
    };

    return Yup.object().shape(schema);
  };

  const clickRemove = (id, name) => {
    setDeleteModal(true)
    setDeleteId(id)
    setDeleteName(name)
  }

  const confirmRemove = () => {
    const body = {
        id: deleteId
      };
      setDeleteModal(false)
      deleteLightBulb(accessToken, body)
        .then((response) => {
        if (response.status === 200) {
            MySwal.fire({
                title: "Success",
                text: "ลบหลอดไฟสำเร็จ",
                icon: "success",
                didClose: () => {
                    getLightBulbList(accessToken).then(({ status, data }) => {
                        if (status === 200) {
                        setDataTable(data);
                        }
                    });
                },
            });
        } else {
            MySwal.fire({
                title: "Failed",
                text: "มีสะพานลอยที่ใช้ค่าหลอดไฟนี้อยู่",
                icon: "error",
                didClose: () => {},
            });
        }
        })
        .then(() => {});
  };
  const clickEdit = (item) => {
    //setEditItem(item);
    setEditModal(true)
    
    formikRefEdit.current.setFieldValue("lightNameEdit", item.lightName)
    formikRefEdit.current.setFieldValue("wattEdit", item.watt)
    formikRefEdit.current.setFieldValue("idEdit", item.id)
  };

  const handleEdit = (values) => {
    const body = {
        id: values.idEdit,
        lightName: values.lightNameEdit,
        watt: values.wattEdit
      };
      updateLightBulb(accessToken, body)
        .then((response) => {
        setEditModal(false)
        if (response.status === 200) {
            
            MySwal.fire({
                title: "Success",
                text: "แก้ไขหลอดไฟสำเร็จ",
                icon: "success",
                didClose: () => {
                    getLightBulbList(accessToken).then(({ status, data }) => {
                        if (status === 200) {
                            setDataTable(data);
                        }
                    });
                },
            });
        } else {
            MySwal.fire({
                title: "Failed",
                text: response.data,
                icon: "error",
                didClose: () => {},
            });
        }
        })
        .then(() => {});
  }

  const handleAdd = (values) => {
    const body = {
        lightName: values.lightName,
        watt: values.watt
      };
    
      saveLightBulb(accessToken, body)
        .then((response) => {
        if (response.status === 200) {
            MySwal.fire({
                title: "Success",
                text: "เพิ่มหลอดไฟสำเร็จ",
                icon: "success",
                didClose: () => {
                    getLightBulbList(accessToken).then(({ status, data }) => {
                        if (status === 200) {
                        setDataTable(data);
                        }
                    });
                },
            });
        } else {
            MySwal.fire({
                title: "Failed",
                text: response.data,
                icon: "error",
                didClose: () => {},
            });
        }
        })
        .then(() => {});
  };

  useEffect(() => {
    getLightBulbList(accessToken).then(({ status, data }) => {
      if (status === 200) {
        setDataTable(data);
      }
    });
  }, []);
  return (
    <>
      <CCard>
        <CCardHeader>
          <h5>เพิ่มหลอดไฟ</h5>
        </CCardHeader>
        <CCardBody>
          <Formik
            innerRef={formikRef}
            enableReinitializing={true}
            initialValues={{
              watt: "",
              lightName: "",
            }}
            validationSchema={schema}
            onSubmit={handleAdd}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <CForm onSubmit={handleSubmit} noValidate name="addUserForm">
                <CFormGroup row>
                  <CCol xs="12" md="6">
                    <CCol md="3">
                      <CLabel htmlFor="lightName">ชื่อหลอดไฟ</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput
                        id="lightName"
                        name="lightName"
                        valid={!!values.lightName}
                        invalid={touched.lightName && !!errors.lightName}
                        value={values.lightName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CInvalidFeedback>{errors.lightName}</CInvalidFeedback>
                    </CCol>
                  </CCol>
                  <CCol xs="12" md="6">
                    <CCol md="3">
                      <CLabel htmlFor="watt">จำนวนวัตต์</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput
                        id="watt"
                        name="watt"
                        valid={!!values.watt}
                        invalid={touched.watt && !!errors.watt}
                        value={values.watt}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CInvalidFeedback>{errors.watt}</CInvalidFeedback>
                    </CCol>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="12" md="6">
                    <CCol xs="12" md="9">
                      <CButton
                        type="submit"
                        className="mr-1 mb-1 btn btn-xl"
                        color="primary"
                      >
                        Submit
                      </CButton>
                    </CCol>
                  </CCol>
                </CFormGroup>
              </CForm>
            )}
          </Formik>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <CDataTable
            items={dataTable}
            fields={[
              {
                key: "lightName",
                _style: { width: "40%" },
                label: "ชื่อหลอดไฟ",
              },
              {
                key: "watt",
                _style: { width: "10%" },
                filter: false,
                label: "จำนวนวัตต์",
              },
              {
                key: "delete",
                label: "แก้ไข/ลบ",
                filter: false,
                _style: { width: "5%" },
              },
            ]}
            scopedSlots={{
              delete: (item) => (
                <td>
                  <CButton
                    size="sm"
                    className="btn-github btn-brand mr-1 mb-1"
                    onClick={() => clickEdit(item)}
                  >
                    <CIcon size="sm" name="cil-pencil" />
                  </CButton>
                  <CButton
                    size="sm"
                    className="btn-youtube btn-brand mr-1 mb-1"
                    onClick={() => clickRemove(item.id, item.lightName)}
                  >
                    <CIcon size="sm" name="cil-trash" />
                  </CButton>
                </td>
              ),
            }}
            bordered
            columnFilter
            hover
            sorter
            pagination={false}
          />
        </CCardBody>
      </CCard>
      <CModal
        centered
        show={deleteModal}
        closeOnBackdrop={false}
        >
        <CModalHeader>
            <h5>คุณต้องการลบ ?</h5>
        </CModalHeader>
        <CModalBody>
            ลบการตั้งค่าหลอดไฟ : <strong>{deleteName}</strong>
        </CModalBody>
        <CModalFooter>
            <CButton color="light" onClick={() => {setDeleteModal(false)}}>
            Cancel
            </CButton>
            <CButton
            color="danger"
            onClick={() => { confirmRemove() }}
            >
            Confirm
            </CButton>{" "}
        </CModalFooter>
    </CModal>
    <CModal
        centered
        show={editModal}
        closeOnBackdrop={false}
        >
        <CModalBody>
        <Formik
            innerRef={formikRefEdit}
            enableReinitializing={true}
            initialValues={{
              wattEdit: "",
              lightNameEdit: "",
              idEdit: ""
            }}
            validationSchema={schemaEdit}
            onSubmit={handleEdit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <CForm onSubmit={handleSubmit} noValidate name="addUserForm">
                <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="lightName">ชื่อหลอดไฟ</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput
                        id="lightNameEdit"
                        name="lightNameEdit"
                        valid={!!values.lightNameEdit}
                        invalid={touched.lightNameEdit && !!errors.lightNameEdit}
                        value={values.lightNameEdit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CInvalidFeedback>{errors.lightNameEdit}</CInvalidFeedback>
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="watt">จำนวนวัตต์</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput
                        id="wattEdit"
                        name="wattEdit"
                        valid={!!values.wattEdit}
                        invalid={touched.wattEdit && !!errors.wattEdit}
                        value={values.wattEdit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CInvalidFeedback>{errors.wattEdit}</CInvalidFeedback>
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                  
                    <CCol xs="12" md="12">
                      <CButton
                        type="submit"
                        className="mr-1 mb-1 btn btn-xl"
                        color="primary"
                      >
                        Submit
                      </CButton>
                      <CButton className="mr-1 mb-1 btn btn-xl" color="light" onClick={() => {setEditModal(false)}}>
                        Cancel
                    </CButton>
                    </CCol>
                </CFormGroup>
              </CForm>
            )}
          </Formik>
        </CModalBody>
    </CModal>
    </>
  );
};

export default BulbLight;
