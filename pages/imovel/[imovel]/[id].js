import { useState, useEffect, useRef, useContext  } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import ContentHeader from '../../../components/ContentHeader';
import { Modal } from 'react-bootstrap';
import placeImg from '../../../public/svg/place.svg';
import semImage from '../../../public/img/sm-foto.jpg';
import ImageGallery from 'react-image-gallery';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from '../../../context';
import { 
    apiId, apiUrl, urlImgs, urlSite, urlFavicon, moneyFormatter,titleSite,existsOrError,
    IsEmail,isMobile,notify ,cloudflareLoader,scrollTopDist,removerSpecials,loaderImage 
} from '../../../utils';

export default function Imovel(props) {
     
    const { dadosimovel, destaques }  = props;
    const idDinamico    = dadosimovel.id
    const { anunciante  } = useContext(AuthContext);
    const [ isOpen , setOpen ] = useState(false);
    const [ showProposta, setShowProposta ] = useState(false);
    const [ showTelefones, setShowTelefones ] = useState(false);
    const [ showScrollTop, setShowScrollTop ] = useState(false);
    const [ showHeaderFixed, setShowHeaderFixed ] = useState(false);

    const dadosEditados = `${removerSpecials(dadosimovel.finalidade)}-${removerSpecials(dadosimovel.tipo)}-${removerSpecials(dadosimovel.bairro)}`; 
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

    const refImovel = useRef(true);
    useEffect(() => {
        if (refImovel.current) {
            refImovel.current = false;            
            return;
        }
  
    },[dadosimovel])
  let images;
  if ( dadosimovel.imagens && dadosimovel.imagens.length) {
      images = dadosimovel.imagens.map(item => {
          return(
              {
                  original: `${urlImgs}/${item.imagem}`,
                  thumbnail: `${urlImgs}/${item.thumb}`,
                  originalTitle : `${item.titulo}`,                            
              }
          )
      });    
  }
  function handleClickMap() {
    window.open(`https://www.google.com/maps?q=${dadosimovel.latitude},${dadosimovel.longitude}`,'_blank');
}


const [ loading, setLoading ] = useState(false);

const [ formulario, setFormulario ] = useState({ 
    nomecompleto: '',
    email: '',
    cidade: '',
    uf: '',
    telefone: '', 
    mensagem: '',
    imovel: dadosimovel.id,
    finalidade: dadosimovel.finalidade,
    lnk_anuncio: `${urlSite}/imovel/${dadosEditados}/${dadosimovel.id}`
});

const [ validate, setValidate ] = useState({ validateName: true,validateEmail: true,validateTel: true,validateCity: true,validateUf: true,validateMensage: true });

async function handleSubmit() {        

  if (!existsOrError(formulario.nomecompleto) || !existsOrError(formulario.email) || !existsOrError(formulario.cidade) || !existsOrError(formulario.uf) || !existsOrError(formulario.telefone) || !existsOrError(formulario.mensagem)) {
      
      const camposinvalidos = {
          validateName: existsOrError(formulario.nomecompleto) ? true : false,
          validateEmail: existsOrError(formulario.email) ? true : false,
          validateCity: existsOrError(formulario.cidade) ? true : false, 
          validateUf: existsOrError(formulario.uf) ? true : false,  
          validateTel: existsOrError(formulario.telefone) ? true : false, 
          validateMensage: existsOrError(formulario.mensagem) ? true : false, 
      }

      setValidate({...validate, ...camposinvalidos});               
      notify('erro', 'Digite os campos obrigatórios'); 
      
  } else if (!IsEmail(formulario.email)) {
      
      setValidate({ validateName: true, validateEmail: false, validateTel: true, validateCity: true, validateUf: true, validateMensage: true });
      notify('erro', 'Digite um e-mail válido');
      
  } else if (!isMobile(formulario.telefone)) {

      setValidate({ validateName: true, validateEmail: true, validateTel: false, validateCity: true, validateUf: true, validateMensage: true });
      notify('erro', 'Digite um celular válido');

  } else {            
      setLoading(true); 
      setValidate({ validateName: true, validateEmail: true, validateTel: true, validateCity: true, validateUf: true, validateMensage: true });
      
        const corpo = JSON.stringify( {
            acoes: [                        
                { 
                    metodo: "enviarproposta", 
                    params: [{ ...formulario }] 
                },                
            ], id: apiId
            });
        
        const response = await fetch(
            
            apiUrl,
            {                    
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: corpo
            } 
            )
        const resp = await response.json()  
                            
            if (resp.proposta.status === 'erro') {
                notify('erro', resp.proposta.erro);
            } 
            else if (resp.proposta.status === 'sucesso') {
                notify('sucesso', 'Mensagem enviada com sucesso');
                setFormulario({ nomecompleto: '',email: '',cidade: '',uf: '',telefone: '', mensagem: '' });
            }
            setLoading(false); 
 

  }

}

function handleForm(valores) {
  setFormulario({ ...formulario, ...valores });
}

function handleClose(value) {
  value === 'telefones' && setShowTelefones(false); 
  value === 'proposta' && setShowProposta(false);
}
function handleShow(value) {
  value === 'telefones' && setShowTelefones(true); 
  value === 'proposta' && setShowProposta(true);
}  

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
            <meta property="og:type" content="website" />
            
            <meta name="description" content={dadosimovel.maisdescricao} />
            <meta name="og:site_name" property="og:site_name" content={titleSite} />
            <meta name="og:url" property="og:url" content={`${urlSite}imovel/${idDinamico}`} />
            <meta name="og:title" property="og:title" content={`${dadosimovel.titulo} | ${dadosimovel.tipo} | ${dadosimovel.finalidade} | Imóvel | ${ titleSite }`} />
            <meta name="og:description" property="og:description" content={dadosimovel.maisdescricao} />                             
            <meta name="og:image" property="og:image" content={images[0].original? `${urlImgs}/${images[0].original}` : semImage} />
            <meta name="og:image:width" property="og:image:width" content="640" />
            <meta name="og:image:height" property="og:image:height" content="480" />
            <title>{ Object.keys(dadosimovel).length > 0 ? `${dadosimovel.titulo} | ${dadosimovel.tipo} | ${dadosimovel.finalidade} | Imóvel | ${titleSite} ` : `${titleSite}`}</title>
        </Head> 

         <div className="main"> 
            <ContentHeader title="Imóvel"  />
         
        
            <div className="container visualizacao px-4 px-sm-0">        
                
              
                <header className="d-flex topo-visualizacao justify-content-between align-items-center pt-5">
                    { dadosimovel.titulo && (
                        <div className="font-16 titulo pr-5">
                            <span className="pr-2">{ dadosimovel.titulo }</span>
                        </div>
                    ) }                        
                </header>
                
                
                    <div className="row py-3">
                        <div className="col-12 col-lg-7">

                            <div className="redes-sociais d-flex d-lg-none" style={{ justifyContent: 'flex-end' }}>
                                <Link href={`https://www.facebook.com/sharer/sharer.php?u=${urlSite}imovel/${dadosEditados}/${dadosimovel.id}`} className="facebook mx-0" target="_blank" rel="noopener noreferrer nofollow">Facebook</Link>   
                                <Link href={`https://twitter.com/intent/tweet?text=${urlSite}imovel/${dadosEditados}/${dadosimovel.id}`} className="instagram mx-1" target="_blank" rel="noopener noreferrer nofollow">Instagram</Link>
                                <Link href={`https://api.whatsapp.com/send?text=${urlSite}imovel/${dadosEditados}/${dadosimovel.id}`} className="whatsapp mx-0" target="_blank" rel="noopener noreferrer follow">Whatsapp</Link>
                            </div>
                            
                            {
                                (
                                    images ?
                                        images.length === 1 ?
                                            <div><Image src={images[0].original} width="300" height="300" alt="imageGallery" /></div>
                                        : <ImageGallery lazyLoad={true} showFullscreenButton={true} items={images} useBrowserFullscreen={ false } />
                                    
                                    : <div><Image src={"/img/sm-foto.jpg"} width="300" height="300" alt="imageGallery" /></div>
                                )
                            }

                            <div className="pt-3 pb-4 d-block d-lg-none">                                

                                
                                <div className=" d-block text-uppercase font-12">{ `${dadosimovel.finalidade} - ${dadosimovel.tipo}` }</div>
                                
                                <div className="d-block font-32 color-primary"><b>{ dadosimovel.valor ? moneyFormatter(dadosimovel.valor): 'Consulte-nos' }</b></div>
                               
                                                              
                                { (dadosimovel.valor_condominio  ) && <div className="font-12">{ `Condomínio: R$ ${moneyFormatter(dadosimovel.valor_condominio)}` }</div> }
                                { (dadosimovel.valor_iptu  ) && <div className="font-12">IPTU: {dadosimovel.valor_iptu}</div> }
                                
                                { (dadosimovel.areatotal && dadosimovel.areaconstruida ) && (
                                    <div className="font-12 opacity-75 pt-2">
                                        Área Total: {dadosimovel.areatotal} m<sup>2</sup> / Construída: {dadosimovel.areaconstruida} m<sup>2</sup>                                        
                                    </div>  
                                )}

                            </div>

                            <div className="d-block d-lg-none">
                               

                                <div className="d-block  border-top border-bottom py-3 flex-column flex-md-row">
                                    <div className="endereco d-flex align-items-center flex-grow-1 pr-4 font-14 line-height-130">
                                        <Image src={placeImg} loader={loaderImage} alt="place" width={100} height={100}/>
                                        {`${dadosimovel.endereco ? `${dadosimovel.endereco} - ` : '' }${dadosimovel.bairro} | ${dadosimovel.cidade}/${dadosimovel.uf}`}
                                    </div>
                                    { (dadosimovel.latitude && dadosimovel.longitude) && <button type="button" onClick={() => handleClickMap()} className="btn btn-secondary shadow-sm text-white font-13 px-4 py-2 m-0 mt-3 mt-md-0"><b>VER NO MAPA</b></button> }
                                </div>
                            </div>

                            <div className="d-block d-lg-none">
                            { dadosimovel.caracteristicas && (
                                <>
                               
                                <div className= "d-block pt-4 font-14"> 
                                    <ul>
                                        { dadosimovel.caracteristicas.map((item, index) => <li key={index}>{item}</li> ) }
                                    </ul>
                                </div>
                                </>
                            ) }  
                            </div>

                            { dadosimovel.maisdescricao && (
                                <>
                              
                                <div className="d-block descricao pt-4">
                                    <div className="d-flex border-bottom mb-3"><h2 className="font-14 border-bottom py-2 color-active mb-0">DESCRIÇÃO DO IMÓVEL</h2></div>
                                    <div className="font-14">{ dadosimovel.maisdescricao }</div>
                                </div>
                                </>
                            )}

                            { dadosimovel.observacoes && (
                                <>
                                <div className="d-block descricao pt-4">
                                    <div className="d-flex border-bottom mb-3"><h2 className="font-14 border-bottom py-2 color-active mb-0">OBSERVAÇÃO</h2></div>
                                    <div className="font-14">{ dadosimovel.observacoes }</div>
                                </div>
                                </>
                            ) }

                            { dadosimovel.infraestrutura && (
                                <>
                              
                                <div className="d-block descricao pt-4">
                                    <div className="d-flex border-bottom mb-3"><h2 className="font-14 border-bottom py-2 color-active mb-0">TEM NAS PROXIMIDADES</h2></div>
                                    <div className="font-14">
                                        <ul>
                                            { dadosimovel.infraestrutura.map((item, index) => <li key={index}>{item}</li> ) }
                                        </ul>
                                    </div>
                                </div>
                                </>
                            ) }

                        </div>
                        <div className="col-12 col-lg-5">
                            
                            <div className="pb-4 d-none d-lg-block">
                                <div className="redes-sociais d-flex" style={{ }}>
                                    <Link href={`https://www.facebook.com/sharer/sharer.php?u=${urlSite}imovel/${dadosEditados}/${dadosimovel.id}`} className="facebook mx-0" target="_blank" rel="noopener noreferrer nofollow">Facebook</Link>   
                                    <Link href={`https://twitter.com/intent/tweet?text=${urlSite}imovel/${dadosEditados}/${dadosimovel.id}`} className="instagram mx-1" target="_blank" rel="noopener noreferrer nofollow">Instagram</Link>
                                    <Link href={`https://api.whatsapp.com/send?text=${urlSite}imovel/${dadosEditados}/${dadosimovel.id}`} className="whatsapp mx-0" target="_blank" rel="noopener noreferrer follow">Whatsapp</Link>
                                </div>

                                
                                <div className="d-block text-uppercase font-12">{ `${dadosimovel.finalidade} - ${dadosimovel.tipo}` }</div>
                                
                                
                                <div className="d-block font-32 color-primary"><b >{ dadosimovel.valor ? `R$ ${moneyFormatter(dadosimovel.valor)}` : 'Consulte-nos' }</b></div>
                                
                             
                                
                                { (dadosimovel.valor_condominio ) && <div className="font-12">{ `Condomínio: R$ ${moneyFormatter(dadosimovel.valor_condominio)}` }</div> }
                                { (dadosimovel.valor_iptu ) && <div className="font-12">IPTU: {dadosimovel.valor_iptu}</div> }
                                
                                { (dadosimovel.areatotal && dadosimovel.areaconstruida) && (
                                    <div className="font-12 opacity-75 pt-2">
                                        Área Total: {dadosimovel.areatotal} m<sup>2</sup> / Construída: {dadosimovel.areaconstruida} m<sup>2</sup>                                        
                                    </div>
                                )}

                            </div>
                            
                            <div className="d-none d-lg-block">
                            
                                <div className="d-block border-top border-bottom py-3">
                                    <div className="endereco d-flex align-items-center flex-grow-1 pr-4 font-14 line-height-130">
                                        <Image src={'../../svg/place.svg'} loader={loaderImage} alt="place" width={100} height={100}/>
                                        {`${dadosimovel.endereco ? `${dadosimovel.endereco} - ` : '' }${dadosimovel.bairro} | ${dadosimovel.cidade}/${dadosimovel.uf}`}
                                    </div>
                                    { (dadosimovel.latitude && dadosimovel.longitude) && <button type="button" onClick={() => handleClickMap()} className="btn btn-secondary shadow-sm w-50 text-white font-13 px-0 py-2  botao-ver-mapa"><b>VER NO MAPA</b></button> }
                                </div>
                            </div>
                            
                            <div className="d-none d-lg-block">
                            { dadosimovel.caracteristicas && (
                                <>
                              

                                <div className="pt-4 font-14"> 
                                    <ul>
                                        { dadosimovel.caracteristicas.map((item, index) => <li key={index}>{item}</li> ) }
                                    </ul>
                                </div>
                                </>
                            ) }  
                            </div>                          

                            <div className="d-none d-md-block border p-4 p-md-5 mt-4">
                                <h2 className="font-24 m-0 p-0">Entre em Contato</h2> 
                                <p className="font-12 opacity-75">Preencha o formulário abaixo</p>
                                
                                <form>                                                                                
                                    <div className="row mx-0 font-14">

                                        <div className="col-12 pb-2 mb-1 px-0">
                                            <input type="text"  placeholder="NOME COMPLETO" value={formulario.nomecompleto} onChange={(e) => handleForm({ nomecompleto: e.target.value })} />
                                        </div>
                                        <div className="col-12 px-0 pb-2 mb-1">
                                            <input type="email"  placeholder="E-MAIL" value={formulario.email} onChange={(e) => handleForm({email: e.target.value})} />
                                        </div>                                        
                                        <div className="col-2 px-0 pb-2 mb-1">                                            
                                            <input type="text" placeholder="UF" maxLength="2"  value={formulario.uf} onChange={(e) => handleForm({uf: e.target.value})} /> 
                                        </div>
                                        <div className="col-10 px-0 pb-2 mb-1">
                                            <input type="text" placeholder="CIDADE" value={formulario.cidade} onChange={(e) => handleForm({cidade: e.target.value})} />
                                        </div>
                                        <div className="col-12 px-0 pb-2 mb-1">
                                            <input  placeholder="CELULAR"  value={formulario.telefone} onChange={(e) => handleForm({telefone: e.target.value})} />
                                        </div>
                                        <div className="col-12 px-0 pb-2 mb-1">
                                            <textarea placeholder="MENSAGEM" value={formulario.mensagem} onChange={(e) => handleForm({mensagem: e.target.value})}></textarea>
                                        </div>
                                        <div className="col-12 pt-4 px-0 d-flex justify-content-end">
                                            <button type="button" onClick={() => handleSubmit()} className="btn btn-primary font-14 py-2 px-5 shadow-sm" disabled={ loading ? true : false }>
                                                { loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> }
                                                ENVIAR
                                            </button>  
                                        </div>

                                    </div>                                        
                                </form>

                            </div>

                        </div>
                    </div>    
                
                
            </div>

        </div>

        <div className={`${isOpen ? 'open ' : ''}d-flex d-md-none justify-content-center nav-bottom${showScrollTop ? ' show' : ''}`}>
            <div className="pb-4">
                { (Object.keys(anunciante).length > 0 && Object.keys(anunciante).includes('telefones')) && (
                    <button type="button" onClick={() => handleShow('telefones')} className="btn-telefone  border-0 mx-2">Telefones</button>
                ) }         
                <button type="button" onClick={() => handleShow('proposta')} className="btn-proposta btn-primary border-0 mx-2">Enviar Proposta</button>
            </div>                
        </div>

        <Modal className="modal-style" centered show={showTelefones} onHide={() => handleClose('telefones')}>          
            <Modal.Body className="p-4">          
                <h2 className="font-24 mb-3 p-0">Telefones</h2> 
                <div className="lista-telefones"> 
                    
                    { (Object.keys(anunciante).length > 0 && Object.keys(anunciante).includes('telefones')) && anunciante.telefones.map((tel, index) => (
                        <>
                            <a href={tel.app !== '0' ? `https://api.whatsapp.com/send?l=pt-BR&amp;phone=55${tel.ddd}${tel.numero.replace('-','')}&text=Oi,%20vim%20pelo%20seu%20site!` : `tel:0${tel.ddd}${tel.numero.replace('-','')}`} key={index} className={`${tel.app !== '0' ? 'whats ' : ''}d-block border p-3 my-4`} rel="noopener noreferrer nofollow" target="_blank"><span style={{color:'#666'}}>{ `(${tel.ddd}) ${tel.numero}`}</span>
                            {tel.app !== '0' ?
                                <Image src="/svg/whatsapp-verde.svg" alt="place" width={10} height={10} className="whatsappMobile"/>
                             : ""
                             }
                            </a>
                        </>
                    ))}

                </div>
                                                                    
            </Modal.Body>
        </Modal>

        <Modal className="modal-style" centered show={showProposta} onHide={() => handleClose('proposta')}>          
            <Modal.Body className="p-4">          
                <h2 className="font-24 m-0 p-0">Entre em Contato</h2> 
                <p className="font-12 opacity-75">Preencha o formulário abaixo</p>
               
                <form>                                                                                
                    <div className="row mx-0 font-14">

                        <div className="col-12 pb-2 mb-1 px-0">
                            <input type="text"  placeholder="NOME COMPLETO" value={formulario.nomecompleto} onChange={(e) => handleForm({ nomecompleto: e.target.value })} />
                        </div>
                        <div className="col-12 px-0 pb-2 mb-1">
                            <input type="email"  placeholder="E-MAIL" value={formulario.email} onChange={(e) => handleForm({email: e.target.value})} />
                        </div>                                        
                        <div className="col-2 px-0 pb-2 mb-1">                                            
                            <input type="text" placeholder="UF" maxLength="2"  value={formulario.uf} onChange={(e) => handleForm({uf: e.target.value})} /> 
                        </div>
                        <div className="col-10 px-0 pb-2 mb-1">
                            <input type="text"  placeholder="CIDADE" value={formulario.cidade} onChange={(e) => handleForm({cidade: e.target.value})} />
                        </div>
                        <div className="col-12 px-0 pb-2 mb-1">
                            <input placeholder="CELULAR"  value={formulario.telefone} onChange={(e) => handleForm({telefone: e.target.value})} />
                        </div>
                        <div className="col-12 px-0 pb-2 mb-1">
                            <textarea  placeholder="MENSAGEM" value={formulario.mensagem} onChange={(e) => handleForm({mensagem: e.target.value})}></textarea>
                        </div>
                        <div className="col-12 pt-4 px-0 d-flex justify-content-end">
                            <button type="button" onClick={() => handleSubmit()} className="btn btn-primary font-14 py-2 px-5 shadow-sm" disabled={ loading ? true : false }>
                                { loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> }
                                ENVIAR
                            </button>  
                        </div>

                    </div>                                        
                </form> 
                                                                    
            </Modal.Body>
        </Modal>

        <div className="pb-3 pb-md-5 mt-5 mb-5 container" >
            <h2 className="color-primary font-28 m-0 pb-2">Veja mais destaques</h2>
            <p className="font-14  pr-0 pr-md-5">Confira mais opções de imóveis disponíveis </p>

            <div className="row">
                { destaques.map(dest => (
                    
                    <div key={dest.id} className="col-12 col-md-6 col-xl-3 py-3 py-xl-0">
                        
                        <Link href={`/imovel/${removerSpecials(dest.finalidade)}-${removerSpecials(dest.tipo)}-${removerSpecials(dest.bairro)}/${dest.id}`} className="d-flex flex-column shadow h-100 item-grid" >                                
                            <div className="foto position-relative"><Image src={dest.imagem} loader={cloudflareLoader} width={300} height={50}  alt={dest.tipo} /></div>
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
                                
                                <div className="endereco font-12 line-height-130">
                                    <Image src={'../../svg/place.svg'} loader={loaderImage}  width={72} height={16} alt="place"  />
                                    {`${dest.bairro} | ${dest.cidade}/${dest.uf}`}
                                </div>
                                
                            </div>                                
                        </Link>
                    </div>

                )) }

            </div>
        </div>
        

         <ToastContainer /> 

    </>
  )
}

export async function getServerSideProps(context) {

  const { query } = context;

 
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


export const config = { runtime: 'experimental-edge' };