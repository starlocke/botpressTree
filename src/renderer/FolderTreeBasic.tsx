import { useState, useEffect } from 'react';
import FolderTree from 'react-folder-tree';
import PropTypes from 'prop-types';
import 'react-folder-tree/dist/style.css';
import './FolderTreeBasic.css';

export default function FolderTreeBasic(props) {
  const { path } = props;
  const [tree, setTree] = useState({});

  const onTreeStateChange = (state: any, event: any) => {
    // console.log(state, event);
  };

  useEffect(() => {
    async function getTree(targetPath) {
      const t = await window.electron.ipcRenderer.getTree(targetPath);
      setTree(t);
    }
    getTree(path);
  }, [path]);

  // console.log('test-data...');
  // console.log(testData);
  /*
    "data" looks like this...

    {name: "Root-Folder", children: [
      {name: "Foo.txt"},
      {name: "Bar-Folder", children: [{name: "Bar.txt"}]}
    ]}
  */
  window.electron.ipcRenderer.on('get-tree', (arg) => {
    console.log('FolderTreeBasic (get-tree)...');
    console.log(arg);
  });

  return (
    <div>
      <div style={{ color: 'black' }}>{path}</div>
      <FolderTree
        className="FolderTreeBasic"
        showCheckbox={false}
        data={tree}
        onChange={onTreeStateChange}
        readOnly
      />
    </div>
  );
}

FolderTreeBasic.propTypes = {
  path: PropTypes.string.isRequired,
};
