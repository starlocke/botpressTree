import { useState, useEffect } from 'react';
import FolderTree from 'react-folder-tree';
import PropTypes from 'prop-types';
import 'react-folder-tree/dist/style.css';
import './FolderTreeBasic.css';

export default function FolderTreeBasic(props: { path: string }) {
  const { path } = props;
  const [mainComponent, setMainComponent] = useState(<div />);

  const onTreeStateChange = (/* state: any, event: any */) => {
    // no-op --- silently drop the info
  };

  useEffect(() => {
    // Setup a reaction
    window.electron.ipcRenderer.on(
      'get-tree',
      (arg: { root: string; tree: object; status: number }) => {
        if (arg.root === path) {
          // console.log('get-tree result...');
          // console.log(arg);
          // The message matches this subscriber's context
          if (arg.status === 200) {
            const component = (
              <FolderTree
                className="FolderTreeBasic"
                showCheckbox={false}
                data={arg.tree}
                onChange={onTreeStateChange}
                readOnly
              />
            );
            setMainComponent(component);
          } else {
            const component = (
              <div className="FolderTreeBasic">
                <p>Status: 404 - Not Found</p>
              </div>
            );
            setMainComponent(component);
          }
          // setTree(arg.tree);
        }
      }
    );
    // Trigger server processing of filesystem contents
    window.electron.ipcRenderer.getTree(path);
  }, [path]);

  return mainComponent;
}

FolderTreeBasic.propTypes = {
  path: PropTypes.string.isRequired,
};
