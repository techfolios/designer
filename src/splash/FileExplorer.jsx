import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createTechFolioWindow, deleteFile, newTechFolioWindow } from '../techfolioeditor/TechFolioEditorWindow';
import { setFileData } from '../redux/actions';

class FileExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileData: this.props.fileData,
    };
    setFileData(this.state.fileData);
    this.newClick = this.newClick.bind(this);
  }

  /**
   * Creates a new essay or project file, then opens the Editor for that file
   *
   * @param fileType Type of file to make, either 'essay' or 'project'
   */
  newClick(fileType) {
    // TODO create a way to update state when creating new file
    const promise = new Promise((resolve) => {
      const newFile = newTechFolioWindow(fileType);
      resolve(newFile);
    });

    promise.then((file) => {
      setFileData(this.state.fileData);
      console.log(`Adding file: ${file}`);
      this.state.fileData.push(file);
      this.setState({ fileData: this.state.fileData });
      this.forceUpdate();
    });
  }

  /**
   * Handles either a delete or edit action when pressing an icon in the file system UI
   *
   * @param action Either 'delete' or 'edit', depending on which action to do
   * @param fileType Type of file, either an 'essay' or 'project'
   * @param fileName Name of file
   * @returns {*}
   */
  handleClick(action, file) {
    const modified = moment().fromNow();
    const fileType = file.fileType;
    const fileName = file.fileName;
    file.modified = modified;
    setFileData(this.state.fileData);
    this.setState({ fileData: this.state.fileData });
    this.forceUpdate();
    if (action === 'edit') return createTechFolioWindow({ fileType, fileName });
    else if (action === 'delete') {
      deleteFile(fileType, fileName).then(
          () => {
            let type = 'not defined';
            fileType === 'essays' ? type = 'essay' : type = 'project'; // eslint-disable-line
            const index = this.state.fileData.map(files => files.key).indexOf(`${type}-${fileName}`);
            this.setState(this.state.fileData.splice(index, 1));
            return 0;
          },
      );
    }
    return -1; // this should never happen
  }

  render() {
    const fileData = this.state.fileData;
    console.log(fileData);
    return (
      <div>
        <Table unstackable striped sortable basic>
          <Table.Body>
            {fileData.map(file => (
              <Table.Row key={file.key} negative={!!file.changed}>
                <Table.Cell width={2} textAlign={'center'}>
                  {file.fileType === 'projects' ?
                      <Icon name={'university'} /> : <Icon name={'file alternate outline'} /> }
                </Table.Cell>
                <Table.Cell width={6}>
                  {file.fileName}
                </Table.Cell>
                <Table.Cell width={2} textAlign={'center'}>
                  <Icon
                    link
                    name="edit"
                    onClick={() => this.handleClick('edit', file)}
                  />
                </Table.Cell>
                <Table.Cell width={2} textAlign={'center'}>
                  <Icon
                    link
                    name="delete"
                    onClick={() => this.handleClick('delete', file)}
                  />
                </Table.Cell>
                <Table.Cell width={4} textAlign={'center'}>
                  {file.modified}
                </Table.Cell>
              </Table.Row>))}
          </Table.Body>
        </Table>
        <Table celled unstackable striped sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell selectable textAlign="center" onClick={() => this.newClick({ fileType: 'projects' })}>
                Create a new project
              </Table.HeaderCell>
              <Table.HeaderCell selectable textAlign="center" onClick={() => this.newClick({ fileType: 'essays' })}>
                Create a new essay
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        </Table>
      </div>
    );
  }
}

FileExplorer.defaultProps = {
  fileData: [],
  changed: null,
  modified: '',
};

FileExplorer.propTypes = {
  fileData: PropTypes.arrayOf(PropTypes.object),
};

function mapStateToProps(state) {
  return {
    fileData: state.fileData,
    changed: state.changed,
  };
}

export default connect(mapStateToProps)(FileExplorer);
