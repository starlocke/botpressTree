import Accordion from 'react-bootstrap/Accordion';
import { useState, useEffect } from 'react';
import FolderTreeBasic from './FolderTreeBasic';

export default function FolderTreePane() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    window.electron.ipcRenderer.on('get-paths', (paths: string[]) => {
      const itemsCollection = paths.map((path: string) => {
        return (
          <Accordion.Item key={path} eventKey={path}>
            <Accordion.Header>{path}</Accordion.Header>
            <Accordion.Body>
              <div style={{ maxHeight: '350px', overflow: 'scroll' }}>
                <FolderTreeBasic path={path} />
              </div>
            </Accordion.Body>
          </Accordion.Item>
        );
      });
      setItems(itemsCollection);
    });
    window.electron.ipcRenderer.getPaths();
  }, []);
  return <Accordion className="FolderTreePane">{items}</Accordion>;
}
