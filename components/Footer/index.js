import React, { useState, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Map from '../Map';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { existsOrError, urlFacebook, urlInstagram, urlImgs } from '../../utils';
import { verificarCreci,loaderImage,cloudflareLoader } from '../../utils';
import { AuthContext } from '../../context';
import ActiveLink from '../ActiveLink/ActiveLinkFooter';

const customStyles = {
    content: {
      top:  '50%',
      left:  '50%',
      right:  'auto',
      bottom:  'auto',
      maxWidth: 600,
      maxHeight: 600,
      marginRight: '-50%',
      paddingBottom: 50,
      transform: 'translate(-50%, -50%)',
      overlay:{ zIndex: 120},
    
    },
    
  };

export default function Footer(props) {
    const { anunciante, perfilcorretores } = useContext(AuthContext);
    let subtitle ="";
    const { pathname } = useRouter();
    const [ modalIsOpen, setIsOpen] = useState(false);
    const [ loading, setLoading ] = useState(true); 


    async function openModal() {
        setIsOpen(true);
        setLoading(false);
     }

 
     function afterOpenModal() {
        subtitle.style.color = '#f00';
     }
 
     function closeModal() {
         setIsOpen(false);
     }


    const ListaCorretores = perfilcorretores.map((corretor) =>
                                            
        <div className="corretor" key={corretor.id}>
            <div className ="esquerda">
                    {
                        corretor && corretor.foto  ?
                        <Image className="imagem-corretor" src= {urlImgs+'/'+corretor.foto} loader={cloudflareLoader}  width={300} height={50} alt="imagem corretor"  blurDataURL="URL" placeholder="blur"/>
                        :
                        <Image  className="imagem-corretor" src= {'../../img/sm-perfil.png'} loader={loaderImage}  width={300} height={50} alt="imagem corretor"  blurDataURL="URL" placeholder="blur"/>
                    }
            </div>
            <div className ="direita">
                <div className ="nome-corretor">{corretor.nome}</div>
                <div className="texto font-14">Creci: {corretor.creci}</div>
                <div className="texto font-14">{corretor.texto}</div>
            </div>
        </div>

    ); 

    const currentYear = new Date();

    return (
        <>
        <footer>            
                
           
                <Map rota={pathname} />                
                
                <div className="container footer-container d-flex flex-column">                    
                    
                    <div className="topo d-flex flex-grow-1 footerMenu align-items-center pt-0 pt-xl-4">
                        
                        { (existsOrError(urlFacebook) || existsOrError(urlInstagram)) ? (

                            <>
                                <div className="d-flex flex-column flex-xl-row align-items-center justify-content-center w-100">

                                <div className="logo-rodape pr-0 pr-xl-5">
                                    <Link href="/"><Image loader={loaderImage} src={'../../img/infoimoveis.png'} width={100} height={100} alt="Imobiliaria Test"  blurDataURL="URL" placeholder="blur" /></Link>
                                </div>


                                <div className="d-flex align-items-center flex-column mb-1 justify-content-between flex-grow-1">
                                    <div className="d-none d-xl-block">
                                        <nav className="text-right">
                                            <ActiveLink openModal={() => {openModal()}}/> 
                                        </nav>
                                    </div>
                                </div>


                                </div>
                                <div className=" redes-sociais  font-13 font-md-14 pt-3 pt-xl-0 align-items-center justify-content-center w-100">
                                    <span className="mr-2">SIGA-NOS NAS REDES SOCIAIS:</span>
                                    {existsOrError(urlInstagram) && <a href={urlInstagram} className="instagram mx-0" target="_blank" rel="noopener noreferrer nofollow">Instagram</a>}
                                    {existsOrError(urlFacebook) && <a href={urlFacebook} className="facebook mx-0" target="_blank" rel="noopener noreferrer nofollow">Facebook</a>}
                                </div>
                            </>

                              

                        ) : (
                            
                            <div className="d-flex flex-column flex-xl-row align-items-center justify-content-center w-100">
                                                        
                                <div className="logo-rodape logo-espaço pr-0 pr-xl-5">
                                    <Link href="/"><Image src={'../../img/infoimoveis.png'} loader={loaderImage} width={300} height={50} alt="Imobiliaria Teste"  blurDataURL="URL" placeholder="blur" /></Link>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-none d-xl-block">
                                        <nav className="text-right " style={{display: 'flex'  }}>
                                            <ActiveLink openModal={() => openModal()}/> 
                                        </nav>
                                    </div>
                                </div>

                            </div>

                        ) }                        

                    </div>
                   
           

                    <div className="rodape font-11 font-xl-14 d-flex justify-content-center align-items-center text-center">
                        <b>© { currentYear.getFullYear() } INFOIMÓVEIS - Sua Referência em Imóveis - Todos os direitos reservados</b>                        
                    </div>

                </div>            
            
        </footer>
        <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Modal corretores"
            disabled={ loading ? true : false }
        >
                        
            <h2 className="tituloModal font-20 font-md-28" ref={(_subtitle) => (subtitle = _subtitle)}>
                {verificarCreci(anunciante.creci)}
            </h2>
            { 
                loading ? 
                    <div className="estilo-carregado"><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" /></div>
                    :
                ListaCorretores
            }                                                                                                                    
            <Button onClick={closeModal} className="btn-fechar-corretor">Fechar</Button>
                                            
        </Modal>
        </>
    )
}