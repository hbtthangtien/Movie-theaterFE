
import Flickity from 'react-flickity-component';
import { useState } from "react";
import 'flickity/css/flickity.css';
import { Button, Card, Container } from 'react-bootstrap';
import ModalEvent from './ModalEvent';

const PromoEvent = ({events, detail}) => {

    const [modalShow, setModalShow] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    
    const flickityOptions = {
        initialIndex: 2,
        autoPlay: 1500,
        wrapAround: true,
    };
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
      };
    
    const handleSelectevent = (event) => {
        setSelectedEvent(event)
        setModalShow(true)
    }

    return (
        <Container fluid className='p-4 bg-dark'>
                <h2 className='pt-4 text-center text-white'>{detail}</h2>
            <Container>
            <Flickity
                    className={'carousel p-4'}
                    elementType={'div'}
                    options={flickityOptions}
                    disableImagesLoaded={false} 
                    reloadOnUpdate 
                    static
                >
                    {events.map((o) => (
                        <Card onClick={() => handleSelectevent(o)} className="custom-card bg-dark border-0">
                            <Card.Img variant="top" src={o.image} />
                            <Card.Body>
                                <Card.Title className='text-success'>
                                        {o.title}
                                </Card.Title>
                                <Card.Text>
                                    <p>Time apply: {formatDate(o.startTime)} to {formatDate(o.endTime)}</p>    
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </Flickity> 
                {selectedEvent && (
                    <ModalEvent data={selectedEvent} show={modalShow} onHide={() => setModalShow(false)} />
                )}
            </Container>
        </Container>
    );
}

export default PromoEvent;