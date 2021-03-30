import React from "react";
import { CCol, CFormGroup, CLabel, CInputFile, CRow, CButton } from "@coreui/react";

class UploadPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = { file: null , name: null };
    this.onChange = this.onChange.bind(this);
    this.resetFile = this.resetFile.bind(this);
  }

  onChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      name: event.target.files[0].name
    });
    this.props.onInputChange(event.target.files[0])
  }

  resetFile(event) {
    event.preventDefault();
    this.setState({ file: null, name: null });
  }
  render() {
    return (
      <CFormGroup>
        <CCol>
          <CLabel className="font-weight-bold" htmlFor="text-input">
            Group:
          </CLabel>
        </CCol>
        <CCol>
        <CCol xs="12"  sm="12" md="6">
        
          <CInputFile 
              id="file-input" 
              name="ffile-input" 
              onChange={this.onChange}
            />
            <CLabel htmlFor="file-input" variant="custom-file">
            {this.state.name ? this.state.name : "Choose Files..."}
            </CLabel>
          </CCol>
          <br/>
          <CCol xs="12" sm="12" md="12">
          {this.state.file && (
            <img
            style={{ width: "100px", height: "100px" }}
            src={this.state.file}
          />
          )}
          </CCol>
          <br />
          <CCol xs="12" sm="12" md="12">
          {this.state.file && (
            <CButton
            type="reset"
            color="light"
            onClick={this.resetFile}
          >
            Remove picture
          </CButton>
            
          )}
          </CCol>
          </CCol>
          
      </CFormGroup>
    );
  }
}

export default UploadPreview;
