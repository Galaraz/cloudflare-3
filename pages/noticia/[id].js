import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import ContentHeade from '../../components/ContentHeader';
import { apiUrl,  apiId, urlImgs, urlSite, titleSite, urlFavicon } from '../../utils';

export default function Noticia(props) {    

    const {noticia}= props;
   
    useEffect(() => {
        let iframeVideo = document.getElementsByTagName("iframe")
        let tela = window.screen;
        for (var i = 0; i < iframeVideo.length; i++) {
           if(tela.width < 700){
            iframeVideo[i].width = tela.width * 0.85 
            iframeVideo[i].height = (tela.width * 0.85) * 0.6 
           }
        }
    },[])


    return (
        <>        
            <Head>

                <link rel="apple-touch-icon" sizes="57x57" href={ `${urlFavicon}apple-icon-57x57.png`} />
                <link rel="apple-touch-icon" sizes="60x60" href={ `${urlFavicon}apple-icon-60x60.png` } />
                <link rel="apple-touch-icon" sizes="72x72" href={ `${urlFavicon}apple-icon-72x72.png` } />
                <link rel="apple-touch-icon" sizes="76x76" href={ `${urlFavicon}apple-icon-76x76.png` } />
                <link rel="apple-touch-icon" sizes="114x114" href={ `${urlFavicon}apple-icon-114x114.png` } />
                <link rel="apple-touch-icon" sizes="120x120" href={ `${urlFavicon}apple-icon-120x120.png` } />
                <link rel="apple-touch-icon" sizes="144x144" href={ `${urlFavicon}apple-icon-144x144.png` } />
                <link rel="apple-touch-icon" sizes="152x152" href={ `${urlFavicon}apple-icon-152x152.png` } />
                <link rel="apple-touch-icon" sizes="180x180" href={ `${urlFavicon}apple-icon-180x180.png` } />
                <link rel="icon" type="image/png" sizes="192x192"  href={ `${urlFavicon}android-icon-192x192.png` } />
                <link rel="icon" type="image/png" sizes="32x32" href={ `${urlFavicon}favicon-32x32.png` } />
                <link rel="icon" type="image/png" sizes="96x96" href={ `${urlFavicon}favicon-96x96.png` } />
                <link rel="icon" type="image/png" sizes="16x16" href={ `${urlFavicon}favicon-16x16.png` } />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="msapplication-TileImage" content={ `${urlFavicon}ms-icon-144x144.png` } />
                <meta name="theme-color" content="#ffffff" />

                <meta name="description" content={noticia.resumo} />
                <meta name="og:site_name" property="og:site_name" content={titleSite} />
                <meta name="og:url" property="og:url" content={`${urlSite}/noticia/${noticia.id}`} />
                <meta name="og:title" property="og:title" content={noticia.titulo} />
                <meta name="og:description" property="og:description" content={noticia.resumo} />                             
                <meta name="og:image" property="og:image" content={`${urlImgs}/${noticia.imagem}`} />
                <meta name="og:image:width" property="og:image:width" content="640" />
                <meta name="og:image:height" property="og:image:height" content="480" />
                <title>{ Object.keys(noticia).length > 0 ? `${noticia.titulo} | Notícia | ${titleSite}` : `${titleSite}`}</title>
            </Head>

            <div  className="main">
            
                <ContentHeade title="Notícia"  />

                <div className="container noticia px-4 px-sm-0">        
                    
                        <>
                        <div className="pt-5 pb-4 border-bottom">
                            <div className="font-12 opacity-75 pb-3">{ noticia.data }</div>
                            <h2 className="font-32 font-md-40 line-height-130 color-primary m-0 p-0">{ noticia.titulo }</h2>
                        </div>

                        <div className="d-table w-100 pt-4 pb-5 font-16 line-height-160 texto">
                            
                            { noticia.imagem && ( 
                                <div className=" float-md-left mr-0 mr-md-4 mb-4 opacity-75 noticiaOrganizada">
                                    <Image className="mx-auto mx-md-0" src={`${urlImgs}/${noticia.imagem}`} alt={noticia.titulo}  width="300" height="300"/> 
                                    <span className="d-block font-12 font-italic pt-1 text-center">{ noticia.fonte }</span>
                                </div> 
                            ) }

                            <div>
                                <div className="redes-sociais d-flex align-items-center justify-content-end py-2 mb-3">
                                    <span className="font-11 font-italic mr-2">Compartilhar:</span>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${urlSite}/noticia/${noticia.id}`} className="facebook mx-0" target="_blank" rel="noopener noreferrer nofollow">Facebook</a>   
                                    <a href={`https://twitter.com/intent/tweet?text=${urlSite}/noticia/${noticia.id}`} className="instagram mx-1" target="_blank" rel="noopener noreferrer nofollow">Instagram</a>
                                    <a href={`https://api.whatsapp.com/send?text=${urlSite}/noticia/${noticia.id}`} className="whatsapp mx-0" target="_blank" rel="noopener noreferrer nofollow">Whatsapp</a>
                                </div>
                                <div className="texto" dangerouslySetInnerHTML={{__html: noticia.texto}}></div>                         
                            </div>

                        </div>
                        </>
                   

                          

                </div>    

            </div>            
                
        </>
            
    );
}


export async function getServerSideProps(context) {
  const {query} = context;
   
    const corpo = await JSON.stringify( {
      acoes: [                        
        { metodo: "noticia", params:  [{ registro: query.id }] },
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
   
    const list = await resposta.json()
      
    return {
      props: list, 
    }
}

