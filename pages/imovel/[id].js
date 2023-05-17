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
  
    const { dadosimovel, destaques }  = props;

return(

<h1>ola meu chapaaa</h1>

)
}
export async function getServerSideProps(context) {

  const { query } = context;
  console.log(context);
 
  const corpo = await JSON.stringify( {
    acoes: [                        
      { metodo: "dadosimovel", params:  [{ registro: query.id }] },
      { metodo: "destaques", params: [ { resultados: "4" }] },
    ], id: apiId
  });
  const resposta = await fetch(
      apiUrl,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: corpo
    }
  
  )
  const listImovel = await resposta.json()

  return {
    props: listImovel
  }
}

export const config = { runtime: 'edge' };
