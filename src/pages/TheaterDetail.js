import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { IoLogoFacebook } from "react-icons/io";
import { FaInstagramSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa";

const TheaterDetail = () => {
    const { tid } = useParams();
    const [theaters, setTheaters] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:9999/theater");
                setTheaters(res.data);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const findTheater = theaters?.find(f => f.id == tid)

    return (
        <Container fluid className="bg-dark text-white">
            <Container className="pt-4">
                <h1 className="text-success text-center">Our theater</h1>
                <Row className="p-4">
                    <Col className="border" md={9}>
                        <h3 className="pt-2 text-success">{findTheater?.name.toUpperCase()}</h3>
                        <h4>{findTheater?.name.toUpperCase()}</h4>
                        <ul>
                            <li>{findTheater?.place}</li>
                            <li>{findTheater?.phoneNumber}</li>
                            <li>{findTheater?.email}</li>
                        </ul>
                        <img className="m-3" style={{ width: '40%' }} src={findTheater?.img} />
                        <h4>CÁC QUY ĐỊNH GIÁ VÉ</h4>
                        <p>– Giá vé trẻ em áp dụng cho trẻ em có chiều cao dưới 1,3m. Yêu cầu trẻ em có mặt khi mua vé. Trẻ em dưới 0,7m sẽ được miễn phí vé khi mua cùng 01 vé người lớn đi kèm theo. Không áp dụng kèm với chương trình khuyến mãi ưu đãi về giá vé khác.</p>
                        <p>– Giá vé thành viên U22 chỉ áp dụng cho thành viên dưới 22 tuổi khi mua vé. Không áp dụng kèm với chương trình khuyến mãi ưu đãi về giá vé khác. Mỗi thẻ thành viên U22 được áp dụng giá vé ưu đãi tối đa 02 vé/ngày.</p>
                        <p>– Ngày lễ: 1/1, Giổ Tổ Hùng Vương 10/3 Âm Lịch, 30/4, 1/5, 02 ngày Lễ Quốc Khánh</p>
                        <p>– Giá vé Tết Âm Lịch sẽ được áp dụng riêng.                    </p>
                        <p>– Suất chiếu đặc biệt áp dụng giá vé theo khung giờ của ngày. Không áp dụng các giá vé ưu đãi dành cho U22, Privilege Voucher/Staff Voucher, Happy Day. Trong trường hợp Suất chiếu đặc biệt cùng ngày với Happy Day sẽ áp dụng giá vé của Thứ 3</p>
                        <h1><IoLogoFacebook /> <FaInstagramSquare /> <AiFillTikTok /> <FaYoutube /> </h1>
                    </Col>
                    <Col md={3}>
                        <Container className="p-4 border border-success" >
                            <h3 className="pt-2">Other Theater</h3>
                            {
                                theaters?.map(t => (
                                    <Link style={{textDecoration :'none'}} className="text-success p-2 d-block" to={`/theater/${t.id}`}>{t.name}</Link>
                                ))
                            }
                        </Container>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default TheaterDetail;