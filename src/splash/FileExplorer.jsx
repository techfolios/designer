import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createTechFolioWindow, deleteFile } from '../techfolioeditor/TechFolioEditorWindow';

class FileExplorer extends React.Component {
  handleClick(action, fileType, fileName) {
    if (action === 'edit') return createTechFolioWindow({ fileType, fileName });
    if (action === 'delete') return deleteFile(fileType, fileName);
    return -1;
  }

  // TODO add state and arrows on column headers, make footer (create new) fixed (separate file?)
  render() {
    const fileData = this.props.fileData;
    return (
      <Table celled unstackable striped sortable>
        <Table.Body>
          {fileData.map(file => (
            <Table.Row key={file.key} negative={!!file.changed}>
              <Table.Cell width={6}>
                {file.fileName}
              </Table.Cell>
              <Table.Cell width={2}>
                {file.fileType === 'projects' ? 'P' : 'E' /* assumes only projects or essays */}
              </Table.Cell>
              <Table.Cell width={2}>
                <Icon link name="edit" onClick={() => this.handleClick('edit', file.fileType, file.fileName)}/>
              </Table.Cell>
              <Table.Cell width={2}>
                <Icon link name="delete" onClick={() => this.handleClick('delete', file.fileType, file.fileName)}/>
              </Table.Cell>
              <Table.Cell width={4}>
                {file.changed ? 'commitdate' : ''}
              </Table.Cell>
            </Table.Row>))}
        </Table.Body>
      </Table>
    );
  }
}

FileExplorer.defaultProps = {
  fileData: [],
  changed: null,
};

FileExplorer.propTypes = {
  fileData: PropTypes.arrayOf(PropTypes.object),
  changed: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    fileData: state.fileData,
    changed: state.changed,
  };
}

export default connect(mapStateToProps)(FileExplorer);
