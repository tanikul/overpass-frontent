import React, { useState } from "react";
import {
  CBadge,
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "src/actions/redirect";
import { Redirect } from "react-router-dom";
import { setLoginExpired } from "src/actions/authen";
import { changePassword } from "src/services/UserService";
import * as Yup from "yup";
import { Formik } from "formik";

const TheHeaderDropdown = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.authen.isAuth);
  const redirectTo = useSelector((state) => state.redirect.redirectTo);
  const accessToken = useSelector((state) => state.authen.access_token);
  const [modal, setModal] = useState(false);

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
          setModal(!modal);
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

  if (!isAuth) {
    return <Redirect to={redirectTo} push={true} />;
  }

  return (
    <>
      <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <div className="c-avatar">
            <CImg
              src={"avatars/6.jpg"}
              className="c-avatar-img"
              alt="admin@bootstrapmaster.com"
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
            <div onClick={() => setModal(!modal)}>
              <CIcon name="cil-user" className="mfe-2" />
              Change password
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
      <CModal show={modal} onClose={() => setModal(!modal)} size="sm">
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
            <CForm onSubmit={handleSubmit} noValidate name="addUserForm">
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
                <CButton color="secondary" onClick={() => setModal(!modal)}>
                  Cancel
                </CButton>
              </CModalFooter>
            </CForm>
          )}
        </Formik>
      </CModal>
    </>
  );
};

export default TheHeaderDropdown;
