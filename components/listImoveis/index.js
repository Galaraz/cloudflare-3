import { useState, useEffect, useContext } from 'react';
import Link  from 'next/link';
import Image from 'next/image';
import Pagination from 'react-js-pagination';
import ContentHeader from '../ContentHeader';
import Place from '../../public/svg/place.svg';
import CardBusca from '../cardBusca/';
import { moneyFormatter, itensPorPagina, loaderImage,cloudflareLoader, handleRequest,removerSpecials  } from '../../utils';
import { useRouter } from 'next/router';
import Select from "react-select";


export default function ListImoveis(props) {    
    const router = useRouter();
    const queryInicial = router.query;
    const { data, finalidadePagina, finalidadeId } = props
    const { imoveis, total_registros } = data

    const filtros = [
        { label : "Ordenação", value: ""},
        { label : "Recentes", value: "recentes"},
        { label : "Relevância", value: "relevancia"},
        { label : "Menor Valor", value: "menorvalor"},
        { label : "Maior Valor", value: "maiorvalor"},
    ]

    async function handleSubmit(params) {
        return router.push({ pathname: '/busca', query: {...queryInicial, ...params} }); 
    }    

    return (

        <> 
            <div className={`main`}>
            
                <ContentHeader title={finalidadePagina ? finalidadePagina : "Resultado da Busca"} noSearch={true}  />
        
                <div className="container px-4 px-sm-0">

                    <CardBusca horizontal finalidade={finalidadeId}/>

                    {(imoveis?.length > 0) ?  (
                        <>
                        <header className= "d-flex topo-grid justify-content-between align-items-md-center flex-column flex-md-row pt-2 pt-md-5">
                            <div className="d-none d-md-block font-14 font-md-18 qtde pr-5">
                                <b className="pr-2">{total_registros > 1 ? `${total_registros} imóveis` : `${total_registros} imóvel` }</b>                                                               
                            </div>
                            <div>  
                                <Select 
                                    className="select filtro filtroOrdenar" 
                                    classNamePrefix="react-select" 
                                    defaultInputValue={''} 
                                    onChange={(e) => 
                                        handleSubmit({ordenacao : e.value})
                                    } 
                                    name="" placeholder="Ordenar" 
                                    options={filtros}
                                    styles={{
                                        menu: (provided) => ({
                                            ...provided,
                                            zIndex: 10 
                                        })
                                    }}
                                />    
                            </div>
                        </header>
                        <div className={`row pt-2 pb-5`}>
                            
                            {  imoveis?.map(imovel => {
                                return (
                                    <div key={imovel.id} className="col-12 col-md-6 col-xl-3 py-4">
                                        <Link href={`/imovel/${removerSpecials(imovel.finalidade)}-${removerSpecials(imovel.tipo)}-${removerSpecials(imovel.bairro)}/${imovel.id}`} className="d-flex flex-column shadow h-100 item-grid">
                                        
                                            <div className="foto position-relative">
                                                                                       
                                                 { imovel.imagem ? <Image src={imovel.imagem} loader={cloudflareLoader} alt={imovel.tipo} width="290" height="100" blurDataURL="URL" placeholder="blur" />  : ""}
                                                 { !imovel.imagem  && imovel.maisimagens ? <Image src={'/img/sm-1foto.jpg'} alt={imovel.tipo} width="290" height="100" blurDataURL="URL" placeholder="blur" /> : "" }
                                                 { !imovel.imagem  && !imovel.maisimagens ? <Image src={'/img/sm-foto.jpg'} alt={imovel.tipo} width="290" height="100" blurDataURL="URL" placeholder="blur"/> : "" }       
                                            
                                            </div>
                                            <div className="d-flex flex-grow-1 flex-column px-3 py-3">
                                                
                                                <div className="flex-grow-2">
                                                    <div className="font-12 font-md-11 line-height-100">{imovel.finalidade}{imovel.tipo && <small className="ml-1 font-italic opacity-50 espaço-card-destaque"  >({imovel.tipo})</small>}</div>
                                                    <div className="font-20 color-primary">
                                                        { imovel.valor ? (
                                                            <b>R$ {moneyFormatter(imovel.valor)}</b>
                                                        ) :
                                                        (
                                                            <b>Consulte-nos</b>
                                                        ) }
                                                        
                                                    </div>
                                                    { imovel.valor_condominio && <div className="font-12 font-md-11 line-height-100">Condomínio: R$ {moneyFormatter(imovel.valor_condominio)}</div> }
                                                </div>

                                                <div className="d-flex infos flex-grow-1 align-items-center py-3">
                                                    <div className="d-flex">
                                                        { imovel.dormitorios != 0 && <div className="info info-dormitorios font-12 font-md-11 line-height-100 pr-3"><div>{imovel.dormitorios}</div></div> }
                                                        { imovel.banheiros != 0 && <div className="info info-banheiros font-12 font-md-11 line-height-100 pr-3"><div>{imovel.banheiros}</div></div> }
                                                        { imovel.area != 0 && <div className="info info-area font-12 font-md-11 line-height-100 pr-3"><div>{imovel.area} m<sup>2</sup></div></div> }
                                                    </div>
                                                </div>
                                                
                                                <div className="endereco font-12 line-height-130">
                                                    <Image src={Place} loader={loaderImage} alt="place" width="290" height="100" />
                                                    {`${imovel.bairro} | ${imovel.cidade}/${imovel.uf}`}
                                                </div>
                                                
                                            </div>
                                            
                                        </Link>
                                    </div>
                                );

                            })  }

                        </div>

                        { total_registros > itensPorPagina && (
                            <div className="d-flex justify-content-center pt-2 pb-5 pagination-container">
                                <Pagination                                     
                                    hideFirstLastPages={true}
                                    activePage={parseInt(queryInicial.pg) ? parseInt(queryInicial.pg) : 1}
                                    itemsCountPerPage={itensPorPagina}
                                    totalItemsCount={total_registros}
                                    pageRangeDisplayed={5}              
                                    onChange={e => {
                                        handleSubmit({pg: e})
                                    }}
                                /> 
                            </div> 
                        ) }

                        </>                     
                    ) :( 
                            <div className="text-center py-5 my-5 font-32 opacity-50">Nenhum imóvel encontrado</div> 
                                    
                )}                                        

                </div>

            </div>

        </>

    )

    
}