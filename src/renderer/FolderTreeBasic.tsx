import { useState, useEffect } from 'react';
import FolderTree from 'react-folder-tree';
import PropTypes from 'prop-types';
import 'react-folder-tree/dist/style.css';
import './FolderTreeBasic.css';

export default function FolderTreeBasic(props: { path: string }) {
  const { path } = props;
  const [tree, setTree] = useState({});

  const onTreeStateChange = (/* state: any, event: any */) => {
    // no-op --- silently drop the info
  };

  useEffect(() => {
    // Setup a reaction
    window.electron.ipcRenderer.on(
      'get-tree',
      (arg: { root: string; tree: object }) => {
        if (arg.root === path) {
          // The message matches this subscriber's context
          setTree(arg.tree);
        }
      }
    );
    // Trigger server processing of filesystem contents
    window.electron.ipcRenderer.getTree(path);
  }, [path]);

  return (
    <FolderTree
      className="FolderTreeBasic"
      showCheckbox={false}
      data={tree}
      onChange={onTreeStateChange}
      readOnly
    />
  );
}

FolderTreeBasic.propTypes = {
  path: PropTypes.string.isRequired,
};
