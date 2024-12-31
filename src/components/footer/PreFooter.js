import { Col, Container, Row } from "react-bootstrap";
import { IoLogoFacebook } from "react-icons/io";
import { FaInstagramSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa";

const PreFooter = () => {
    return (
        <Container fluid className="border-top border-bottom p-4 bg-dark text-white">
            <Container className="p-4">
                <Row>
                    <Col md={4}>
                        <h3 className="text-success">VỀ 3KTickets</h3>
                        <p>Movie Theater Web</p>
                        <p>3KTICKETS</p>
                        
                    </Col>
                    <Col md={4}>
                        <h3 className="text-success">QUY ĐỊNH & ĐIỀU KHOẢN</h3>
                        <p>Quy định thành viên</p>
                        <p>Điều khoản</p>
                        <p>Hướng dẫn đặt vé trực tuyến</p>
                        <p>Chính sách bảo vệ thông tin cá nhân của người tiêu dùng</p>
                    </Col>
                    <Col md={4}>
                        <h3 className="text-success">CHĂM SÓC KHÁCH HÀNG</h3>
                        <p>Hotline: 19002099                    </p>
                        <p>Giờ làm việc: 9:00 - 22:00 (Tất cả các ngày bao gồm cả Lễ, Tết)
                        </p>
                        <p>Email hỗ trợ: cskh@3KTICKETS.vn</p>
                        <p>MẠNG XÃ HỘI</p>
                        <h1><IoLogoFacebook/> <FaInstagramSquare/> <AiFillTikTok/> <FaYoutube/> </h1>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default PreFooter;