import React, { useState, useEffect } from 'react';

import Head from 'next/head';

import Image from 'next/image';

import ContentHeader from '../../components/ContentHeader';

import { ToastContainer } from 'react-toastify';

import { apiUrl, apiId, descriptionDefault, existsOrError, urlSite, titleSite, notify, IsEmail, isMobile, urlFavicon,loaderImage } from '../../utils';




export default function Contato(props) {
    
    const [ loading, setLoading ] = useState(false);
    const [ formulario, setFormulario ] = useState({ nomecompleto: '',email: '',cidade: '',uf: '',telefone: '', mensagem: '' });
    const [ validate, setValidate ] = useState({ validateName: true,validateEmail: true,validateTel: true,validateCity: true,validateUf: true,validateMensage: true });

    useEffect(() => {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    },[]);

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
                        metodo: "faleconosco", 
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
          
                                 
                if (resp.faleconosco.status === 'erro') {
                    notify('erro', resp.faleconosco.erro);
                } 
                else if (resp.faleconosco.status === 'sucesso') {
                    notify('sucesso', 'Mensagem enviada com sucesso');
                    
                    setFormulario({ nomecompleto: '',email: '',cidade: '',uf: '',telefone: '', mensagem: '' });
                }
                setLoading(false); 
           

        }

    }

    
    function handleForm(valores) {
        setFormulario({ ...formulario, ...valores });
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

                <meta name="description" content={descriptionDefault} />
                <meta name="og:site_name" property="og:site_name" content={titleSite} />
                <meta name="og:title" property="og:title" content={`Fale Conosco | ${titleSite}`} />
                <meta name="og:url" property="og:url" content={`${urlSite}/fale-conosco`} />
                <meta name="og:description" property="og:description" content={descriptionDefault} />                             
                <meta name="og:image" property="og:image" content={`${urlFavicon}padrao.png`} />
                <meta name="og:image:width" property="og:image:width" content="300" />
                <meta name="og:image:height" property="og:image:height" content="300" />     
                <title>Fale Conosco | { titleSite }</title>
            </Head>
            <ContentHeader title="Fale Conosco" noSearch={true}  routes={props} />
            <div className={`main`}>
            
                <div className="container py-5 font-14">
                    
                    <p>Caso necessite, entre em contato conosco preenchendo o formulário abaixo.</p>                

                    <div className="row py-4">

                        <div className="d-none d-xl-block col-4">
                            <Image src={'../img/banco-de-pedidos.jpg'} loader={loaderImage}   width={72} height={16}  alt="place"  blurDataURL="URL" placeholder="blur"/>
                        </div>
                        <div className="col-12 col-xl-8">
                            <form>
                                <div className="row mx-0">
                                    <div className="col-12 col-md-6 pl-0 pr-0 pr-md-4">                                        
                                        <h2 className="font-24 color-primary pb-4">Seus Dados</h2>                                        
                                        <div className="row mx-0">

                                            <div className="col-12 pb-2 mb-1 px-0">
                                                <input type="text" className={ !validate.validateName ? 'is-invalid' : '' } placeholder="NOME COMPLETO" value={formulario.nomecompleto} onChange={(e) => handleForm({ nomecompleto: e.target.value })} />
                                            </div>
                                            <div className="col-12 px-0 pb-2 mb-1">
                                                <input type="email" className={ !validate.validateEmail ? 'is-invalid' : '' } placeholder="E-MAIL" value={formulario.email} onChange={(e) => handleForm({email: e.target.value})} />
                                            </div>
                                            <div className="col-12 col-md-10 px-0 pb-2 mb-1">
                                                <input type="text" className={ !validate.validateCity ? 'is-invalid' : '' } placeholder="CIDADE" value={formulario.cidade} onChange={(e) => handleForm({cidade: e.target.value})} />
                                            </div>
                                            <div className="col-12 col-md-2 px-0 pb-2 mb-1">                                            
                                                <input type="text" placeholder="UF" maxLength="2" className={ !validate.validateUf ? 'is-invalid text-uppercase' : 'text-uppercase'} value={formulario.uf} onChange={(e) => handleForm({uf: e.target.value})} /> 
                                            </div>
                                            <div className="col-12 px-0 pb-2 mb-1">
                                                <input className={ !validate.validateTel ? 'is-invalid' : '' } placeholder="CELULAR" value={formulario.telefone} onChange={(e) => handleForm({telefone: e.target.value})} /> 
                                            </div>
                                            <div className="col-12 px-0 pb-2 mb-1">
                                                <textarea className={ !validate.validateMensage ? 'is-invalid' : '' } placeholder="MENSAGEM" value={formulario.mensagem} onChange={(e) => handleForm({mensagem: e.target.value})}></textarea>
                                            </div>
                                            <div className="col-12 pt-4 px-0 d-flex justify-content-end">
                                                <button type="button" onClick={() => handleSubmit()} className="btn btn-primary font-14 py-2 px-5 shadow-sm" disabled={ loading ? true : false }>
                                                    { loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> }
                                                    ENVIAR
                                                </button>  
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>

                </div>

            </div>

            <ToastContainer />

        </>
    );
}