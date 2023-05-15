import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

import ContentHeader from '../../components/ContentHeader';
import Select from 'react-select';

import { ToastContainer } from 'react-toastify';

import { apiUrl, apiId, descriptionDefault, existsOrError, urlSite, titleSite, notify, IsEmail, isMobile, urlFavicon,cloudflareLoader, loaderImage } from '../../utils';



export default function BancoPedidos(props) { 
    
    // const isOpen = useSelector(state => state.open);
    const [ loading, setLoading ] = useState(true);
    const [ finalidade ] = useState([
        { value: 'comprar', label: 'Venda' },
        { value: 'alugar', label: 'Aluguel' },
        { value: 'alugar por temporada', label: 'Aluguel/Temporada' }
    ]);
    const [ tipoImovel ] = useState([
        { value: 'Apartamento', label: 'Apartamento' },
        { value: 'Casa-Térrea', label: 'Casa-Térrea' },
        { value: 'Sobrado', label: 'Sobrado' },
        { value: 'Terreno', label: 'Terreno' },
        { value: 'Comercial', label: 'Comercial' },
        { value: 'Chácara', label: 'Chácara' },
        { value: 'Fazenda', label: 'Fazenda' },
    ]);
    const [ formulario, setFormulario ] = useState({ nomecompleto: '',email: '',cidade: '',uf: '',telefone: '',bairroPedido: '',ufPedido: '',cidadePedido: '',finalidade: '',tipo: '',min: '',max: '',obs: '' });
    
    useEffect(() => {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        //ReactGA.initialize(gaId, {debug: false});
        //ReactGA.pageview(props.location.pathname);
    },[])

    function handleForm(valores) {
        setFormulario({ ...formulario, ...valores });
    }

    const [ validate, setValidate ] = useState({ validateName: true,validateEmail: true,validateTel: true,validateCity: true,validateUf: true });

    async function handleSubmit() {        

        if (!existsOrError(formulario.nomecompleto) || !existsOrError(formulario.email) || !existsOrError(formulario.cidade) || !existsOrError(formulario.uf) || !existsOrError(formulario.telefone)) {
            const camposinvalidos = {
                validateName: existsOrError(formulario.nomecompleto) ? true : false,
                validateEmail: existsOrError(formulario.email) ? true : false,
                validateCity: existsOrError(formulario.cidade) ? true : false, 
                validateUf: existsOrError(formulario.uf) ? true : false,  
                validateTel: existsOrError(formulario.telefone) ? true : false, 
            }
            setValidate({...validate, ...camposinvalidos});            
            notify('erro', 'Digite os campos obrigatórios');             
        } else if (!IsEmail(formulario.email)) {            
            setValidate({ validateName: true, validateEmail: false, validateTel: true, validateCity: true, validateUf: true });
            notify('erro', 'Digite um e-mail válido');            
        } else if (!isMobile(formulario.telefone)) {
            setValidate({ validateName: true, validateEmail: true, validateTel: false, validateCity: true, validateUf: true });
            notify('erro', 'Digite um celular válido');
        } else {
            setLoading(true); 
            setValidate({ validateName: true, validateEmail: true, validateTel: true, validateCity: true, validateUf: true });

                 
                
                const corpo = JSON.stringify( {
                    acoes: [                        
                        { 
                            metodo: "bancodepedidos", 
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
          
                                 
                if (resp.bancodepedidos.status === 'erro') {
                    notify('erro', resp.bancodepedidos.erro);
                    
                } 
                else if (resp.bancodepedidos.status === 'sucesso') {
                    notify('sucesso', 'Pedido enviado com sucesso');
                    setFormulario({ nomecompleto: '',email: '',cidade: '',uf: '',telefone: '',bairroPedido: '',ufPedido: '',cidadePedido: '',finalidade: '',tipo: '',min: '',max: '' })            
                }
                setLoading(false); 
                                 

         }
         
    }

    useEffect(() => {
        setLoading(false);
            
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

                <meta name="description" content={descriptionDefault} />
                <meta name="og:site_name" property="og:site_name" content={titleSite} />
                <meta name="og:title" property="og:title" content={`Banco de Pedidos | ${titleSite}`} />
                <meta name="og:url" property="og:url" content={`${urlSite}/banco-de-pedidos`} />
                <meta name="og:description" property="og:description" content={descriptionDefault} />                             
                <meta name="og:image" property="og:image" content={`${urlFavicon}padrao.png`} />
                <meta name="og:image:width" property="og:image:width" content="300" />
                <meta name="og:image:height" property="og:image:height" content="300" />
                <title>Banco de Pedidos | { titleSite }</title>
            </Head>
            <ContentHeader title="Banco de Pedidos"  />
            <div className="main">
             
            
                <div className="container py-5 font-14 px-4 px-sm-0">
                    <p>Preencha o formulário abaixo e solicite o imóvel que tanto deseja, descreva as principais características, que iremos procurar para você!</p>
                    <p>Utilizando o Banco de Pedidos, iremos procurar junto aos nossos parceiros o imóvel que está procurando, com isto você aumentará as chances de encontrar o imóvel que tanto deseja.</p>
                    <p>Não perca a oportunidade de utilizar esta ferramenta e se aproximar do imóvel do seus sonhos.</p>


                    <div className="row py-4">

                        <div className="d-none d-xl-block col-4">
                            <Image src={'img/banco-de-pedidos.jpg'} loader={loaderImage} width={200} height={500}alt="imgBancoDePedidos" blurDataURL="URL" placeholder="blur" />
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
                                                <input className={ !validate.validateTel ? 'is-invalid' : '' } placeholder="CELULAR" format="(##) #####-####" mask="_" value={formulario.telefone} onChange={(e) => handleForm({telefone: e.target.value})} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-12 col-md-6 pt-3 pt-md-0 pl-0 pl-md-4 pr-0">
                                        <h2 className="font-24 color-primary pb-4">Dados do Imóvel</h2>
                                        
                                        <div className="row mx-0">
                                            
                                            <div className="col-12 pb-2 mb-1 px-0">
                                                <input type="text" placeholder="BAIRRO" value={formulario.bairroPedido} onChange={(e) => handleForm({bairroPedido: e.target.value})} />
                                            </div>

                                            <div className="col-12 col-md-2 pb-2 mb-1 px-0">
                                                <input type="text" placeholder="UF" className="text-uppercase" maxLength="2" value={formulario.ufPedido} onChange={(e) => handleForm({ufPedido: e.target.value})} />
                                            </div>

                                            <div className="col-12 col-md-10 pb-2 mb-1 px-0">
                                                <input type="text" placeholder="CIDADE" value={formulario.cidadePedido} onChange={(e) => handleForm({cidadePedido: e.target.value})} />
                                            </div>

                                            <div className="col-12 col-md-6 pb-2 mb-1 px-0">
                                                {
                                                    !loading ? 
                                                    <Select className="select selectFormulario" classNamePrefix="react-select" defaultValue={formulario.finalidade} onChange={(e) => handleForm({ finalidade: e.value})} placeholder="FINALIDADE" options={finalidade} />
                                                    : null
                                                }
                                               
                                            </div>

                                            <div className="col-12 col-md-6 pb-2 mb-1 px-0">
                                                {
                                                    !loading ? 
                                                    <Select className="select selectFormulario" classNamePrefix="react-select" defaultValue={formulario.tipo} onChange={(e) => handleForm({ tipo: e.value})} placeholder="TIPO DO IMÓVEL" options={tipoImovel} />
                                                    : null
                                                }
                                            </div>
                                            
                                            <div className="col-12 col-md-6 pb-2 mb-1 px-0">
                                                <input placeholder="VALOR MÍNIMO" value={formulario.min} onChange={(e) => handleForm({ min: e.target.value })} />
                                            </div>

                                            <div className="col-12 col-md-6 pb-2 mb-1 px-0">
                                                <input placeholder="VALOR MÁXIMO"  prefix={'R$ '} value={formulario.max} onChange={(e) => handleForm({ max: e.target.value })} />
                                            </div>
                                            

                                        </div>

                                    </div>
                                    <div className="col-12">
                                        <textarea placeholder="OBSERVAÇÕES" value={formulario.obs} onChange={(e) => handleForm({obs: e.target.value})}></textarea>
                                    </div>

                                    <div className="col-12 pt-4 px-0 d-flex justify-content-end">
                                        <button type="button" onClick={() => handleSubmit()}  className="btn btn-primary font-14 py-2 px-5 shadow-sm" disabled={ loading ? true : false }>
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

            <ToastContainer />

        </>
    );
}