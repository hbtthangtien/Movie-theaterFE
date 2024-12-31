import { CenterFocusStrong } from "@mui/icons-material";
import { Container,Row,Col } from "react-bootstrap";

const Footer = () => {
    return (
        <Container fluid className="bg-dark p-4">
            <Container style={{color:'white'}}>
            <Row>
                <Col sm={3}>
                    <img alt="pic" style={{width : '100%', height: 150}} src="/images/logo.png"/>
                </Col>
                <Col sm={9}>
                <p><strong>3KTICKETS COMPANY - HoaLac</strong></p>
                <p>3KTICKETS - MOVIE THEATER</p>
                <p>Hotline: 19002099</p>
                </Col>
            </Row>
            </Container>
        </Container>
    );
}

export default Footer;