import { useState, useEffect, useRef, useContext  } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import ContentHeader from '../../components/ContentHeader'
import { Modal } from 'react-bootstrap';

import ImageGallery from 'react-image-gallery';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from '../../context';
import { apiId, apiUrl, urlImgs, urlSite, urlFavicon, moneyFormatter,titleSite,existsOrError,IsEmail,isMobile,notify ,cloudflareLoader,scrollTopDist } from '../../utils';

export default function Imovel(props) {
  
    // const { dadosimovel, destaques }  = props;
    // console.log(dadosimovel)

return(
 <>
    
    <h1>ola meu chapaaa</h1>
</>

)
}
export async function getStaticPaths() {
    return {
      fallback: true,
      paths: [
        {
          params: { id: "411030" }
        }
      ]
    };
  }
  
  export async function getStaticProps(context) {
    console.log("fez req")
    const respId = context.params.id;
    const corpo = JSON.stringify({
      acoes: [
        { metodo: "dadosimovel", params: [{ registro: respId }] },
        { metodo: "destaques", params: [{ resultados: "4" }] }
      ],
      id: apiId
    });
  
    const resposta = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: corpo
    });
  
    const listImovel = await resposta.json();
  
    return {
      props: listImovel
    };
  }


