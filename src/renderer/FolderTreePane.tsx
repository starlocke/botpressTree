import Accordion from 'react-bootstrap/Accordion';
import FolderTreeBasic from './FolderTreeBasic';

export default function FolderTreePane() {
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Accordion Item #1</Accordion.Header>
        <Accordion.Body>
          <FolderTreeBasic />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
