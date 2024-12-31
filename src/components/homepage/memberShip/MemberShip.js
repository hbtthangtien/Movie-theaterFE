import { Container, Row,Card, Col,Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const MemberShip = ({ memberShip }) => {
    return (
        <Container style={{borderBottom : '1px solid grey'}}  fluid className="pt-4 bg-secondary">
            <Container className="p-4 text-center">
            <h1 >JOIN OUR MEMBERSHIP</h1>
            <Row className="p-4">
                {memberShip.map(m => (
                    <Col md={4}>
                        <Card>
                        <Image src={m.img} rounded/>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Link to='/login' className="btn btn-success transparent-button">ASIGN NOW</Link>
            </Container>
        </Container>
    );
}

export default MemberShip;