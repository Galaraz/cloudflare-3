import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link' ;
import Modal from 'react-modal';
import Image from 'next/image';
import ActiveLink from '../ActiveLink';
import ActiveLinkFooter from '../ActiveLink/ActiveLinkFooter';

import {  scrollTopDist, headerFixed, urlImgs, loaderImage } from '../../utils';
import {  verificarCreci } from '../../utils';
import {  Button } from 'react-bootstrap';
import {  AuthContext } from '../../context';


const customStyles = {
    content: {
      top:  '50%',
      left:  '50%',
      right:  'auto',
      bottom:  'auto',
      maxWidth: 320,
      maxHeight: 600,
      marginRight: '-50%',
      paddingBottom: 50,
      transform: 'translate(-50%, -50%)',
      overlay:{ zIndex: 120},
        
    },
    
  };

  const customModalHorarios = {
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

export default function Header(props) {

    let subtitle ="";
   
    const { anunciante , finalidades, perfilcorretores } = useContext(AuthContext);
    
    const [ isOpen , setOpen ] = useState(false);
    const [ showHeaderFixed, setShowHeaderFixed ] = useState(false);
    const [ showScrollTop, setShowScrollTop ] = useState(false);
    const [ modalIsOpen, setIsOpen] = useState(false);
    const [ modalIsOpenHorarios, setIsOpenHorarios] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [loadingLink] = useState(true);
    
    const {horariosAtendimento} = anunciante;

  
    async function openModal() {
        setIsOpen(true);
        setOpen(false)
        setLoading(false);
         
     }

     async function openModalHorarios() {
        setIsOpenHorarios(true);
        setLoading(false);      
     }
  
     function closeModal() {
        setIsOpen(false);
     }
     function closeModalHorarios() {
        setIsOpenHorarios(false);
     }

     function afterOpenModal() {
        subtitle.style.color = '#f00';
      }
 

     const ListaCorretores = perfilcorretores.map((corretor) =>
                                          
     <div className="corretor" key={corretor.id}>
      <div className ="esquerda imagem-corretor">
        {
            corretor && corretor.foto  ?
             <Image className="imagem-corretor" src= {urlImgs+'/'+corretor.foto} alt="imagem corretor" width={50} height={50}/>
            :
             <Image  className="imagem-corretor" src= {'../../img/sm-perfil.png'} loader={loaderImage} alt="imagem corretor" width={60} height={60}/>
        }
      </div>
      <div className ="direita">
          <div className ="nome-corretor">{corretor.nome}</div>
          <div className="texto font-14">Creci: {corretor.creci}</div>
          <div className="texto font-14">{corretor.texto}</div>
      </div>
     </div>

 );

 const DiasSemana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];

 function formatHorario(horario) {
     const parts = horario.split(':');
    return `${parts[0]}:${parts[1]}`;
  }

const horariosEditados =  DiasSemana.map((diaSemana, index ) => {

    const diaAtual = horariosAtendimento ? horariosAtendimento['hor' + diaSemana] : null;
   
    if (!diaAtual) return 
    return (
        <div className="dia-semana" key={index}>
            <span className="title">{diaSemana.toUpperCase()}</span>
            {diaAtual.length >= 2 && (
                <span className="badge">
                {formatHorario(diaAtual[0])} - {formatHorario(diaAtual[1])}
                </span>
            )}
            {diaAtual.length === 4 && (
                <span className="badge">
                {formatHorario(diaAtual[2])} - {formatHorario(diaAtual[3])}
                </span>
            )}
        </div>
    );
    
})


    useEffect(() => {
          
        window.addEventListener('scroll', function() {
            
            if (window.pageYOffset > scrollTopDist) {
                !showScrollTop && setShowScrollTop(true);
                !showHeaderFixed && setShowHeaderFixed(true);
                
            } else {
                setShowScrollTop(false);
                setShowHeaderFixed(false);
                handleOpenMenu('close');
                
            }                
        });
        
    },[])

  
   
    function handleOpenMenu(close) {
        const show = close ? false : !isOpen;
        setOpen(show)
    }

    return (
        <>

        <header className={`${isOpen ? 'open ' : ''}d-flex align-items-center header`}>              

            <div className="container d-flex flex-column flex-md-row align-items-center pt-1  pt-md-0 pb-md-0">
            
                <div className="logo pt-4 pb-3 pt-lg-0 pb-lg-0">
                    <Link href="/"><Image loader={loaderImage} src={'../../img/logo.png'} unoptimized width='100' height='100'alt="Imobiliaria Test" /></Link>
                </div>

                <button onClick={() => handleOpenMenu()} className={`${isOpen ? 'open ': ''}d-block d-md-none btn-menu primary border-0 font-16 m-3`}>MENU<div><span></span></div></button>

                <div className="d-flex justify-content-end flex-grow-1">
                   
                    <div>
                        
                        <nav className="d-none d-md-block menu-topo pt-0 pb-3 pt-md-2 pb-md-2 pt-xl-0 pb-xl-0 text-center text-md-right" style={{display: 'flex', textAlign: 'right!important' }} >
                        { loadingLink ?  
                            <ActiveLink />
                         :
                            ""
                        }
                        </nav>

                        <div className="header-dados d-flex flex-column flex-md-row justify-content-end pt-0 pt-xl-3 font-12 font-xl-14 " style={{ textAlign: 'right!important' }}>
                            
                            <div className="px-0 px-md-3 px-xl-4 py-1 py-xl-0 text-center text-md-right">
                                <div>
                                    { (Object.keys(anunciante).length > 0 && Object.keys(anunciante).includes('telefones')) && anunciante.telefones.map((tel, index) => (          
                                        <>                              
                                            <a href={tel.app !== '0' ? `https://api.whatsapp.com/send?l=pt-BR&amp;phone=55${tel.ddd}${tel.numero.replace('-','')}&text=Oi,%20vim%20pelo%20seu%20site!` : `tel:0${tel.ddd}${tel.numero.replace('-','')}`} key={index} className={tel.app !== '0' ? 'whats' : ''} rel="noopener noreferrer nofollow" target="_blank">{ `(${tel.ddd}) ${tel.numero}`}</a>
                                            { anunciante.telefones.length !== (index+1) && ' / ' }
                                        </>
                                    ))}
                                </div>
                                <div className="horariosAtendimento">
                                    
                                { Object.keys(anunciante).length > 0 && `${anunciante.horariosAtendimento}` &&  <button onClick={openModalHorarios} className='horariosAtendimentoButton'> Horários de Atendimento </button> }
                                
                                
                                    <Modal
                                        isOpen={modalIsOpenHorarios}
                                        onAfterOpen={afterOpenModal}
                                        onRequestClose={closeModalHorarios}
                                        style={customModalHorarios}
                                        contentLabel="HORÁRIOS DE ATENDIMENTO"
                                        disabled={ loading ? true : false }
                                    >
                                                            
                                        <h2 className="tituloModal font-20 font-md-28" ref={(_subtitle) => (subtitle = _subtitle)}>Horários de Atendimento</h2>
                                        { 
                                            loading ? 
                                                <div className="estilo-carregado"><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" /></div>
                                                :
                                                <div className="box-horarioAtendimento">
                                                {horariosEditados}
                                                </div>
                                        }
                                        <Button onClick={closeModalHorarios} className="btn-fechar-corretor horariosAtendimentoModal">Fechar</Button>
                                        
                                    </Modal>
                                
                                
                                
                                </div>
                               
                            </div>
                            
                            <div className="menuAnunciante px-0 px-md-3 px-xl-4 py-1 py-xl-0 text-md-right">
                           
                                { (Object.keys(anunciante).length > 0 && Object.keys(anunciante).includes('nome')) && `${anunciante.nome}`}<br/>
                                { (Object.keys(anunciante).length > 0 && Object.keys(anunciante).includes('creci')) && `CRECI: ${anunciante.creci}`}
                                    
                            </div>

                        </div>

                    </div>
                    
                </div>
            </div>            
            
        </header>

        { headerFixed && (
            <>
            <header className={`${ showScrollTop ? 'show ' : '' }header-fixed${isOpen ? ' open' : ''}`}>
                <div className="d-flex justify-content-between container py-2">
                    
                    <div className="d-flex align-items-center logo">
                        <Link href="/"> <Image loader={loaderImage} src={'../../img/infoimoveis.png'} alt="lojatest - Corretora de Imóvies"  width={100} height={100}/> </Link>
                    </div>

                    <button onClick={() => handleOpenMenu()} className={`${isOpen ? 'open ': ''}d-block d-md-none btn-menu border-0 font-16`}>MENU<div><span></span></div></button>
                    <nav className="d-none d-md-flex align-items-center justify-content-end menu-topo flex-grow-1">
                    { loadingLink ?  
                            <ActiveLink />
                        :
                            ""
                    }
                    </nav>

                </div>
            </header>

            <nav className={`${isOpen ? 'show ' : ''}d-block d-md-none menu-topo-fixed`}>

            { loadingLink ?  
                    <ActiveLinkFooter /> 
                :
                    ""
            }
   
            </nav>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Modal corretores"
                disabled={ loading ? true : false }
                
            >
                                       
                <h2 className="tituloModal font-20 font-md-28" ref={(_subtitle) => (subtitle = _subtitle)}>{verificarCreci(anunciante.creci )}</h2>
                { 
                    loading ? 
                        <div className="estilo-carregado"><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" /></div>
                        :
                    ListaCorretores
                }
                <Button onClick={closeModal} className="btn-fechar-corretor">Fechar</Button>
                
            </Modal>
            </>
        ) }
        

        <div className={`${ showScrollTop ? 'show ' : '' }btnToTop p-4`}>
            <button className="d-flex justify-content-center align-items-center text-white border-0 font-10" type="button" onClick={() => window.scroll({ top: 0, left: 0, behavior: 'smooth' })}>
                <div>TOPO</div>
            </button>
        </div>

        
        </>
    );
}

