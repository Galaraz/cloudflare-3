import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import Image from 'next/image'
import {  moneyFormatter, cloudflareLoader, titleSite, urlFavicon, descriptionDefault, urlSite, removerSpecials,loaderImage, apiId, apiUrl } from '../utils';
import Link from 'next/link';
import CardBusca from '../components/cardBusca';


export default function Home({list}) {
    const { destaques, ultimasnoticias  } = list
    const isOpen = false
   console.log(urlSite)
      return (
        <>
          <Head>
            <link rel="apple-touch-icon" sizes="57x57" href={ `${urlFavicon}apple-icon-57x57.png`} />
            <link rel="apple-touch-icon" sizes="60x60" href={ `${urlFavicon}apple-icon-60x60.png`} />
            <link rel="apple-touch-icon" sizes="72x72" href={ `${urlFavicon}apple-icon-72x72.png`} />
            <link rel="apple-touch-icon" sizes="76x76" href={ `${urlFavicon}apple-icon-76x76.png`} />
            <link rel="apple-touch-icon" sizes="114x114" href={ `${urlFavicon}apple-icon-114x114.png`} />
            <link rel="apple-touch-icon" sizes="120x120" href={ `${urlFavicon}apple-icon-120x120.png`} />
            <link rel="apple-touch-icon" sizes="144x144" href={ `${urlFavicon}apple-icon-144x144.png`} />
            <link rel="apple-touch-icon" sizes="152x152" href={ `${urlFavicon}apple-icon-152x152.png`} />
            <link rel="apple-touch-icon" sizes="180x180" href={ `${urlFavicon}apple-icon-180x180.png`} />
            <link rel="icon" type="image/png" sizes="192x192"  href={ `${urlFavicon}android-icon-192x192.png`} />
            <link rel="icon" type="image/png" sizes="32x32" href={ `${urlFavicon}favicon-32x32.png`} />
            <link rel="icon" type="image/png" sizes="96x96" href={ `${urlFavicon}favicon-96x96.png`} />
            <link rel="icon" type="image/png" sizes="16x16" href={ `${urlFavicon}favicon-16x16.png`} />
            <link rel="manifest" href={ `${urlFavicon}manifest.json`} />
            <meta name="msapplication-TileColor" content="#ffffff" />
            <meta name="msapplication-TileImage" content={ `${urlFavicon}ms-icon-144x144.png`} />
            <meta name="theme-color" content="#ffffff" />
  
            {/* <!-- Primary Meta Tags --> */}
            <title >{titleSite}</title>
            <meta name="title" content={titleSite} />
            <meta name="description" content={descriptionDefault} />
  
            {/* <!-- Open Graph / Facebook --> */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={urlSite} />
            
            <meta property="og:title" content={titleSite} key={titleSite} />
            <meta property="og:description" content={descriptionDefault} />
            <meta property="og:image" content={`${urlFavicon}padrao.png`} />
  
            {/* <!-- Twitter --> */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={urlSite} />
            <meta property="twitter:title" content={titleSite} />
            <meta property="twitter:description" content={descriptionDefault} />
            <meta property="twitter:image" content={`${urlFavicon}padrao.png`} />
          </Head> 
  
          <div className={`${isOpen ? 'open ': ''}main`}>
            <div className="content-header-primary">
        
                <div className="container py-4 cardbusca">                
                
                    <div className="content-search shadow">
                        <form className="d-flex flex-column h-100">        
                            <CardBusca/>
                        </form>
                    </div>
                </div>
                    
            </div>        
  
            <div className="container py-4 px-4 px-sm-0">
              <div  className="d-none d-md-block  ">
                {/* <Image src={logo} alt="logo" /> */}
              </div>
              <div className="pb-3 pb-md-5 tituloPrincipal">
                  <h2 className="color-primary font-28 m-0 pb-2">Imóveis em Destaque</h2>
                  <p className="font-14  pr-0 pr-md-5">Confira em nossos principais imóveis aquele que mais se adeque as suas necessidades</p>
              </div>
  
              <div className={`row`}>
                { destaques?.map(dest => (
                      
                      <div key={dest.id} className="col-12 col-md-6 col-xl-3 py-3 py-xl-0">
                          <Link href={`/imovel/${removerSpecials(dest.finalidade)}-${removerSpecials(dest.tipo)}-${removerSpecials(dest.bairro)}/${dest.id}`} className="d-flex flex-column shadow h-100 item-grid" >                                
                              <div className="foto position-relative"><Image src={dest.imagem} loader={cloudflareLoader} width={300} height={50}  alt={dest.tipo}  /></div>
                              <div className="d-flex flex-grow-1 flex-column px-3 py-3">
                                  
                                  <div className="flex-grow-2">
                                      <div className="font-12 font-md-11 line-height-100">{dest.finalidade}{dest.tipo && <small className="ml-1 font-italic opacity-50 espaço-card-destaque">({dest.tipo})</small>}</div>
                                      <div className="font-20 color-primary">
                                          { dest.valor ? (
                                              <b>R$ {moneyFormatter(dest.valor)}</b>
                                          ) :
                                          (
                                              <b>Consulte-nos</b>
                                          ) }                                                    
                                      </div>
                                      { dest.valor_condominio && <div className="font-12 font-md-11 line-height-100 color-secondary">Condomínio: R$ {moneyFormatter(dest.valor_condominio)}</div> }
                                  </div>
  
                                  <div className="d-flex infos flex-grow-1 align-items-center py-3">
                                      <div className="d-flex">
                                          { dest.dormitorios != 0 && <div className="info info-dormitorios font-12 font-md-11 line-height-100 pr-3"><div>{dest.dormitorios}</div></div> }
                                          { dest.banheiros != 0 && <div className="info info-banheiros font-12 font-md-11 line-height-100 pr-3"><div>{dest.banheiros}</div></div> }
                                          { dest.area != 0 && <div className="info info-area font-12 font-md-11 line-height-100 pr-3"><div>{dest.area} m<sup>2</sup></div></div> }
                                      </div>
                                  </div>
                                  
                                  <div className="endereco font-12 line-height-130 place">
                                  <Image src="/svg/place.svg" loader={loaderImage} width={72} height={16} alt="place"   />
                                      {`${dest.bairro} | ${dest.cidade}/${dest.uf}`}
                                     
                                    
                                  </div>
                                  
                              </div>                                
                          </Link>
                      </div>
  
                  )) }
              </div>
            </div>
  
            <div className="container py-5 px-4 px-sm-0">
              <div className="pb-3 pb-md-5">
                  <h2 className="color-primary font-28 m-0 pb-2">Notícias Imobiliárias</h2>
                  <p className="font-14 w-50 pr-0 pr-md-5">Fique por dentro das últimas notícias do setor imobiliário.</p>
              </div>
              <div className={`row`}>
                { ultimasnoticias?.map(noti => (
                      <div key={noti.id} className="col-12 col-md-6 col-xl-3 py-3 py-xl-0">
  
                          <Link href={`/noticia/${removerSpecials(noti.titulo)}/${noti.id}`} className="d-flex flex-column shadow h-100 item-grid-noticia">                                
                              <div className="foto"><Image src={noti.imagem} loader={cloudflareLoader} width={300} height={50} alt={noti.titulo} blurDataURL="URL" placeholder="blur" /></div>
                              <div className="d-flex flex-grow-1 flex-column px-3 py-3">                                            
                                  <div className="flex-grow-1"><h2 className="font-14 line-height-130 tituloNoticia  m-0">{noti.titulo}</h2></div>
                                  <div className="py-3"><p className="m-0 font-14 line-height-130">{ noti.resumo }</p></div>
                                  <div className="ler-mais color-primary"><span className="line-height-100 font-14">LER MATÉRIA COMPLETA</span></div>
                              </div>                                
                          </Link>
  
                      </div>
                  )) }
              </div>
            </div> 
  
          </div>
  
        </>
      )
  }
  
  export async function getServerSideProps({ req, res }) {
    try {
      let body = JSON.stringify({
        acoes: [                        
          { metodo: "destaques", params: [ { resultados: "4" }] },
          { metodo: "ultimasnoticias", params: [ { resultados: "4" }] },
          
        ], id: apiId
      }) 
  
      const response = await fetch(apiUrl,{
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      })
      
      let list = await response.json()
      return {    
        props: {list}
      }
  
    } catch(e) {
      return {
        notFound: true
      }
    } 
  }
  export const config = { runtime: 'experimental-edge' }