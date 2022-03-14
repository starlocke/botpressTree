import Accordion from 'react-bootstrap/Accordion';
import FolderTreeBasic from './FolderTreeBasic';

export default function FolderTreePane() {
  return (
    <Accordion className="FolderTreePane">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Accordion Item #1</Accordion.Header>
        <Accordion.Body>
          <div style={{ maxHeight: '800px', overflow: 'scroll' }}>
            <FolderTreeBasic />
            <FolderTreeBasic />
          </div>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Accordion Item #2</Accordion.Header>
        <Accordion.Body>
          <FolderTreeBasic />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Accordion Item #3</Accordion.Header>
        <Accordion.Body>
          <FolderTreeBasic />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
