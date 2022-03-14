import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import FolderTreePane from './FolderTreePane';

const Hello = () => {
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <FolderTreePane />
          </Col>
          <Col>
            <div className="Hello">
              <img width="200px" alt="icon" src={icon} />
            </div>
            <h1 style={{ textAlign: 'center' }}>botpressTree</h1>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
