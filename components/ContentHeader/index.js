import React, { useState, useEffect,useContext } from 'react';
import { useRouter } from 'next/router';
import { Modal } from 'react-bootstrap';
import {AuthContext} from '../../context';
import Select from 'react-select';
import { Range } from 'react-range';

// import { buscaCidades, buscaBairros, getValores, existsOrError ,moneyFormatter,utils } from '../../utils';
import Image from 'next/image';

import CardBusca from '../cardBusca';



export default function ContentHeader(props) {

    const router = useRouter();
    
    const [ show, setShow ] = useState(false);
    const queryInicial = router.query;
    const handleClose = () => setShow(false);
    const handleShow  = () => setShow(true);
  
    return (
        

        <>
        
        <div className="content-header">        
            <div className="d-flex align-items-center justify-content-between container py-4">
        
                <h1 className="font-20 font-md-28 text-center text-md-left m-0 text-white">{props.title}</h1> 
                <button onClick={handleShow} className={`p-1 m-0 bg-transparent botaoLupa border-0${' d-block d-md-none' }`}  >
                    <Image src="/svg/search.svg" width={30} height={30} alt="busca" />
                </button>
            </div>                
        </div>
        <Modal className="modal-style" centered show={show} onHide={handleClose}>          
            <Modal.Body className="p-4">          
                <CardBusca  show={show}  callbackclose={handleClose}/>                                               
            </Modal.Body>
        </Modal>

        </>
        
    );
    
}