import { useState, useEffect, useContext } from 'react';
import Link  from 'next/link';
import Image from 'next/image';
import Pagination from 'react-js-pagination';
import ContentHeader from '../ContentHeader';
import Place from '../../public/svg/place.svg';
import CardBusca from '../cardBusca/horizontal';
import { AuthContext } from '../../context';
import { moneyFormatter, itensPorPagina, loaderImage,cloudflareLoader  } from '../../utils';
import { getValores, utils } from '../../utils';
import { useRouter } from 'next/router';
import Select from "react-select";
import Skeleton from '../skeleton';

export default function ListImoveis(props) {    
    const router = useRouter();
    const queryInicial = router.query;
    const { finalidadePagina } = props
    const [ pageSkeleton, setPageSkeleton ] = useState(true);
    const [ imoveis, setImoveis] = useState([])
    const [ total_registros, setTotalRegistros] = useState("")
    const { finalidades,tipoimoveis,estados,valores, setValores} = useContext(AuthContext);
    const [ formulario, setFormulario ] = useState({ finalidade: finalidadePagina || "" }); 
    const [ loadingDados, setLoadingDados ] = useState(true);  
    const [ loading, setLoading ] = useState(true);    

    const [ cidades, setCidades ] = useState([]);        
    const [ bairro, setBairro ] = useState([]); 

    const arrayFinalidades = finalidades.map(item => {return { value: item, label:item}})  
   
    useEffect(()=>{
       
        if (finalidadePagina){getImoveis(formulario)}
        setLoadingDados(false)
        setPageSkeleton(true);
    },[]);

    useEffect(() => {
        
        if(Object.keys(queryInicial).length){
            populaFormulario()
            getImoveis(queryInicial)
            setPageSkeleton(true);
        }
    },[ queryInicial ])

    const filtros = [
        { label : "Ordenação", value: ""},
        { label : "Recentes", value: "recentes"},
        { label : "Relevância", value: "relevancia"},
        { label : "Menor Valor", value: "menorvalor"},
        { label : "Maior Valor", value: "maiorvalor"},
    ]

    async function populaFormulario() {
        
        setFormulario({...formulario, ...queryInicial})
        if(queryInicial.uf || queryInicial.cidade){
            if(queryInicial.uf) await getCidade(queryInicial.uf)
            if(queryInicial.cidade) await getBairro(queryInicial.cidade)
        }
        setLoadingDados(false)
    }

    const getImoveis = async (form) => {
  
        setLoading(true)
        let corpo ={}
        corpo = form ?  JSON.stringify( { ...form }) : JSON.stringify( { ...formulario });
        
        let novaUrl = `api/getBusca`;
        let response =  await fetch(
            novaUrl,
            {
                method: 'POST',
                body: corpo
            }
    
        );
        if (finalidadePagina) {
            handleOptionChange("finalidade", finalidadePagina)
        }
        
        let list = await response.json()
        
        setImoveis(list.busca.imoveis),
        setTotalRegistros(list.busca.total_registros)
        setLoading(false)
    } 
 
    async function getCidade(valor) {
        const metodo =  "cidades";
        
        const data = await utils( metodo ,valor);
        setCidades(data.cidades); 
    }

    async function getBairro(valor) {
        const metodo =  "bairros";
        const data = await utils( metodo ,valor);         
        setBairro(data.bairros); 
    }
    
    async function handleOptionChange(tipo, valor) {
        switch (tipo) {
            case 'finalidade':
                const response = await getValores(valor);
                setValores({ ...valores,  valor_minimo: parseInt(response.valores.valor_minimo), valor_maximo: parseInt(response.valores.valor_maximo) })
                setFormulario({ ...formulario, ...{finalidade: valor, valorde: parseInt(response.valor_minimo), valorate: parseInt(response.valor_maximo),bairro:"",cidade:"",uf:"",tipo:""   } });
                break;
            case 'tipo':
                setFormulario({ ...formulario, ...{tipo: valor} });
                break;

            case 'uf':
                setFormulario({ ...formulario, uf: valor });
                setCidades([{value: '', label: 'Carregando'}]);
                getCidade(valor)
                break;

            case 'cidade':
                setFormulario({ ...formulario, cidade: valor });
                setBairro([{value: '', label: 'Carregando'}]);
                getBairro(valor);
                break;

            case 'bairro':
                setFormulario({ ...formulario, bairro: valor }); 
                break;

            case 'valorde':
                setFormulario({ ...formulario, valorde: valor });
                break;

            case 'valorate':
                setFormulario({ ...formulario, valorate: valor }); 
                break;
                
            default:
                break;
        }
    }

    function mudarDadosFormulario(dados){
       setFormulario({...formulario, ...dados});
    }

    async function handleSubmit(param) {
        setLoading(true);
        router.push({ pathname: '/busca', query: {...formulario, ...{pg: 1}, ...param}},undefined, { shallow: true });
        
    }

    let renderSkeletonList = [];
    for (let i = 0; i < itensPorPagina; i++) { renderSkeletonList[i] = i; }

    return (

        <> 

                 
        
            <div className={`main`}>
            
                <ContentHeader title={finalidadePagina? finalidadePagina : "Resultado da Busca"} formulario={formulario}  noSearch={true}  />
        
                <div className="container px-4 px-sm-0">

                    <CardBusca
                        loadingDados={false}
                        loading={loading}
                        finalidade={finalidades}
                        arrayFinalidades={arrayFinalidades}
                        tipoimoveis={tipoimoveis}
                        formulario={formulario}
                        estados={estados}
                        cidades={cidades}
                        bairro={bairro}
                        valores={valores}
                        handleOptionChange={(tipo, value) => handleOptionChange(tipo,value)}
                        mudarDadosFormulario={(e) => mudarDadosFormulario(e)}
                        handleSubmit={() => handleSubmit()}
                        
                    />
                    { loading && pageSkeleton && (
                        <>
                        <header className={`${ pageSkeleton ? 'd-flex ' : 'd-none '}justify-content-between align-items-md-center flex-column flex-md-row pt-2 pt-md-5`}>
                            <Skeleton width={195} height={27} className="d-none d-md-block" />
                            <Skeleton width={200} height={38} />
                        </header>
                        <div className={`row pt-2 pb-5`}>
                            { renderSkeletonList.map((imovel, index) => {
                                return (
                                    <div key={index} className="col-12 col-md-6 col-xl-3 py-4">
                                        <div className="d-flex flex-column shadow h-100 item-grid">
                                            <div className="foto position-relative">
                                                <Skeleton className="skeleton-absolute" />
                                            </div>
                                            <div className="d-flex flex-grow-1 flex-column px-3 py-3">
                                                
                                                <div className="flex-grow-2">
                                                    <Skeleton width={100} height={12} />
                                                    <Skeleton className="mt-1" width={120} height={24} />                        
                                                </div>

                                                <div className="d-flex infos flex-grow-1 align-items-center py-3">
                                                    <Skeleton width={177} height={11} />
                                                </div>
                                                
                                                <div className="endereco font-12 line-height-130 pl-0">
                                                    <Skeleton width={200} height={32} /> 
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) }
                        </div>
                        </>
                    )}


                    {(!loading && imoveis?.length > 0) ?  (
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
                            
                            {  imoveis.map(imovel => {
                                return (
                                    <div key={imovel.id} className="col-12 col-md-6 col-xl-3 py-4">
                                        <Link href={`/imovel/${imovel.id}`} className="d-flex flex-column shadow h-100 item-grid">
                                        
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
                                        router.push({
                                            pathname: '/busca',
                                            query: {...formulario,...{pg: e}},
                                        })
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