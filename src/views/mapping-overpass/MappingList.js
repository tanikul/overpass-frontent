import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CButton,
  CButtonGroup,
  CForm,
  CLabel,
  CSelect,
  CFormGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CCollapse,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { LOGIN_FAILED_CODE } from "src/config";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { getMappingAddress } from "src/services/CommonService";
import { setLoginExpired } from "src/actions/authen";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "spinkit/spinkit.min.css";
import { redirect } from "../../actions/redirect";
import {
  getsearchGroupMappingOverpasses,
  getMappingOverPassAll,
  deleteMappingOverpasses,
} from "src/services/MappingService";
import { useHistory } from "react-router-dom";

const MySwal = withReactContent(Swal);

const MappingList = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.authen.isAuth);
  const accessToken = useSelector((state) => state.authen.access_token);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [groupId, setGroupId] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [items, setItems] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [id, setId] = useState("");
  const [deleteGroupName, setDeleteGroupName] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sorterValue, setSorterValue] = useState();
  const [provinces, setProvinces] = useState([]);
  const [details, setDetails] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [reload, setReload] = useState(false);
  const history = useHistory();

  const pageChange = (newPage) => {
    if (newPage - 1 >= 0 && page !== newPage - 1) {
      setPage(newPage - 1);
    }
  };

  const showDeleteModal = (item) => {
    setId(item.groupId);
    setDeleteGroupName(item.groupName);
    setDeleteModal(!deleteModal);
  };

  const handleClosedModal = () => {
    setDeleteModal(false);
  };

  const handleSearch = () => {
    setLoading(true);
    let body = {
      page,
      limit: itemsPerPage,
      filter: {
        id: groupId,
      },
    };

    if (sorterValue && Object.keys(sorterValue).length !== 0) {
      const { column, asc } = sorterValue;
      body = { ...body, sort: column, order: asc ? "asc" : "desc" };
    }

    getsearchGroupMappingOverpasses(accessToken, body).then((users) => {
      if (users.code && users.code === LOGIN_FAILED_CODE) {
        dispatch(setLoginExpired());
        return;
      }
      setItems(users.data);
      setItemsPerPage(itemsPerPage);
      setTotalRecords(Number(users.totalRecords));
      setLoading(false);
    });
  };

  const handleDeleteOverpass = (e) => {
    setDeleteLoading(true);
    const body = new FormData();
    body.append("id", id);
    deleteMappingOverpasses(accessToken, body).then((response) => {
      if (response.status === 200) {
        setDeleteLoading(false);
        setReload(reload ? false : true);
        MySwal.fire({
          title: "Success",
          text: "ลบกลุ่มสำเร็จ  ",
          icon: "success",
          didClose: () => {
            setDeleteModal(false);
            handleSearch();
          },
        });
      } else {
        setDeleteLoading(false);
        MySwal.fire({
          title: "Failed",
          text: "ไม่สามารถลบได้ เนื่องจากมีผู้ใช้งานผูกกับกลุ่มนี้อยู่",
          icon: "error",
          didClose: () => {
            setDeleteModal(false);
          },
        });
      }
    });
  };

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  useEffect(() => {
    if (provinces.length === 0) {
      getMappingAddress(accessToken).then(({ status, data }) => {
        return status === 200 ? setProvinces(data) : setProvinces([]);
      });
    }

    getMappingOverPassAll(accessToken).then(({ status, data }) => {
      return status === 200 ? setGroupList(data) : setGroupList([]);
    });

    handleSearch();
  }, [reload]);

  if (!isAuth) {
    return <Redirect to="/" />;
  }

  const getoAdd = () => {
    dispatch(redirect("/mapping-overpass/add"));
    history.push({
      pathname: "/mapping-overpass/add",
    });
  };

  const getoEdit = (item) => {
    dispatch(redirect(`/mapping-overpass/edit/${item.groupId}`));
    history.push({
      pathname: `/mapping-overpass/edit/${item.groupId}`,
      //data: { 'mode': 'edit', 'data': item }
    });
  };

  return (
    <>
      <CRow>
        <CCol xs={6} md={6} lg={6} className="mb-3 d-flex align-items-center">
          <h2>จับกลุ่มสะพานลอย</h2>
        </CCol>
        <CCol
          xs={6}
          className="d-block d-sm-flex align-items-center justify-content-end mb-4"
        >
          <CButton color="primary" onClick={() => getoAdd()}>
            <CIcon size="sm" name="cil-user-plus" className=" mr-1" />
            เพิ่มกลุ่มสะพานลอย
          </CButton>
        </CCol>
      </CRow>
      <CRow className="justify-content-center">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol className="mb-3 font-weight-bold">ค้นหา</CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="province">ชื่อกลุ่ม</CLabel>
                    <CSelect
                      custom
                      name="group"
                      id="group"
                      onChange={(e) => setGroupId(e.target.value)}
                    >
                      <option value=""></option>
                      {groupList.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.groupName}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                  <CButton
                    variant="outline"
                    color="secondary"
                    className="px-4 text-black-50"
                  >
                    Reset
                  </CButton>
                  <CButton
                    variant="outline"
                    color="primary"
                    className="ml-3 px-3"
                    onClick={handleSearch}
                  >
                    Search
                    <CIcon size="sm" name="cil-search" className="ml-2" />
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CDataTable
                loading={loading}
                items={items}
                fields={[
                  {
                    key: "groupName",
                    _style: { width: "89%" },
                    label: "ชื่อกลุ่ม",
                  },
                  {
                    key: "show_details",
                    label: "",
                    _style: { width: "1%" },
                    filter: false,
                  },
                  {
                    key: "edit",
                    label: "",
                    _style: { width: "10%" },
                    filter: false,
                  },
                ]}
                scopedSlots={{
                  show_details: (item) => {
                    return (
                      <td className="py-2">
                        <CButton
                          color="primary"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={() => {
                            toggleDetails(item.groupId);
                          }}
                        >
                          {details.includes(item.groupId) ? "Hide" : "Show"}
                        </CButton>
                      </td>
                    );
                  },
                  edit: (item) => {
                    return (
                      <td className="py-2">
                        <CButtonGroup className="mr-2">
                          <CButton
                            size="sm"
                            className="btn-github btn-brand mr-1 mb-1"
                            onClick={() => getoEdit(item)}
                          >
                            <CIcon size="sm" name="cil-pencil" />
                          </CButton>
                          <CButton
                            size="sm"
                            className="btn-youtube btn-brand mr-1 mb-1"
                            onClick={() => showDeleteModal(item)}
                          >
                            <CIcon size="sm" name="cil-trash" />
                          </CButton>
                        </CButtonGroup>
                      </td>
                    );
                  },
                  details: (item) => {
                    return (
                      <CCollapse show={details.includes(item.groupId)}>
                        <CCardBody>
                          <CDataTable
                            items={item.overpasses}
                            fields={[
                              { key: "id", label: "ID", filter: false },
                              {
                                key: "name",
                                label: "ชื่อสะพานลอย",
                                filter: false,
                              },
                              {
                                key: "location",
                                label: "สถานที่",
                                filter: false,
                              },
                              {
                                key: "districtName",
                                label: "แขวง/ตำบล",
                                filter: false,
                              },
                              {
                                key: "amphurName",
                                label: "เขต/อำเภอ",
                                filter: false,
                              },
                              {
                                key: "provinceName",
                                label: "จังหวัด",
                                filter: false,
                              },
                            ]}
                          ></CDataTable>
                        </CCardBody>
                      </CCollapse>
                    );
                  },
                }}
                hover
                itemsPerPage={itemsPerPage}
                sorter
                sorterValue={sorterValue}
                onSorterValueChange={setSorterValue}
              />
              <CRow>
                <CCol xs={12} md={6}>
                  <CForm inline className="mt-2">
                    <CLabel className="mr-2">Show</CLabel>{" "}
                    <CSelect
                      size="sm"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </CSelect>
                    <CLabel className="ml-2">entries</CLabel>
                  </CForm>
                </CCol>
                <CCol xs={12} md={6}>
                  <CPagination
                    activePage={page + 1}
                    onActivePageChange={pageChange}
                    pages={Math.ceil(totalRecords / itemsPerPage)}
                    doubleArrows={false}
                    align="end"
                  />
                </CCol>
              </CRow>

              <CModal
                centered
                show={deleteModal}
                closeOnBackdrop={false}
                onClosed={handleClosedModal}
              >
                {deleteLoading && (
                  <div className={deleteLoading ? "spinner-container" : ""}>
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
                <CModalHeader>
                  <h5>คุณต้องการลบ ?</h5>
                </CModalHeader>
                <CModalBody>
                  ลบกลุ่ม <strong>{deleteGroupName}</strong>
                </CModalBody>
                <CModalFooter>
                  <CButton color="light" onClick={handleClosedModal}>
                    Cancel
                  </CButton>
                  <CButton
                    color="danger"
                    onClick={() => {
                      handleDeleteOverpass();
                    }}
                    disabled={deleteLoading}
                  >
                    Confirm
                  </CButton>{" "}
                </CModalFooter>
              </CModal>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default MappingList;
