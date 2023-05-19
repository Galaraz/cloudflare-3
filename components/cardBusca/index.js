import React, { useState, useEffect, useContext } from 'react';
import { Range } from 'react-range';
import Select from 'react-select';
import { useRouter } from 'next/router';
import {AuthContext} from '../../context';

import {  moneyFormatter, getValores, utils, handleRequest  } from '../../utils';
import Skeleton from '../skeleton';
const customStyles = {
    
    menuPortal: provided => ({ ...provided, zIndex: 9999, fontSize: 14 }),
    menuList: (base) => ({
        ...base,
    
        "::-webkit-scrollbar": {
          width: "4px",
          height: "0px",
        },
        "::-webkit-scrollbar-track": {
          background: "#f1f1f1"
        },
        "::-webkit-scrollbar-thumb": {
          background: "#888"
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "#555"
        }
      })
    
  }

export default function CardBusca(props){
    const router = useRouter();
    const queryInicial = router.query;
    const { horizontal, finalidade,callbackclose } = props
    const [ loading, setLoading] = useState(false);
    const [ formulario, setFormulario ] = useState({
        finalidade: '',
        tipo: '',
        uf: '',
        cidade: '',
        bairro: '',
        valorde: '',
        valorate: ''
    }); 
    const [ finalidades, setFinalidades] = useState([]);
    const [ tiposImoveis, setTiposImoveis] = useState([]);
    const [ estados, setEstados ] = useState([]); 
    const [ cidades, setCidades ] = useState([]);        
    const [ bairros, setBairros ] = useState([]); 
    const [ valores, setValores ] = useState({
        valor_minimo : 0,
        valor_maximo : 100
    }); 

    const [ loadingValores, setLoadingValores ] = useState(false)

    function mudarDadosFormulario(dados){
        setFormulario({...formulario, ...dados});
    }
    useEffect(() => {
        setFormulario({...formulario,...queryInicial,  ...{ finalidade : finalidade || queryInicial.finalidade }})
        getFinalidades()
        getTiposImoveis()
        getEstados()
        getCidades(queryInicial?.uf || '')
        getBairros(queryInicial?.cidade || '')
        getValores(finalidade || queryInicial.finalidade || '')
    },[queryInicial]) 

    const getFinalidades = async () => {
        const req = await handleRequest("finalidades", "")
        if(!req.finalidades) return
        setFinalidades(req.finalidades)
    }
    const getValores = async (id = "1") => {
        setLoadingValores(true)
        const req = await handleRequest("valores", [{ finalidade : id }])
        if(!req.valores) return
        setValores({ valor_minimo : req.valores.valor_minimo || 0 , valor_maximo : req.valores.valor_maximo || 100 });
        setFormulario({...formulario, ...{finalidade: id, valorde: req.valores.valor_minimo , valorate : req.valores.valor_maximo }});
        setLoadingValores(false)
    }

    const getTiposImoveis = async () => {
        const req = await handleRequest("tipoimoveis", "")
        if(!req.tipoimoveis) return
        setTiposImoveis(req.tipoimoveis)
    }

    const getEstados = async () => {
          const req = await handleRequest("estados", "")
          if(!req.estados) return
          setEstados(req.estados)
    }
    const getCidades = async (id = "") => {
        const req = await handleRequest("cidades", [{ registro : id }])
        
        if(!req.cidades) return
        setCidades(req.cidades)
    }
    const getBairros = async (id = "") => {
        const req = await handleRequest("bairros",  [{ registro : id }])
        console.log(req)
        if(!req.bairros) return
        setBairros(req.bairros)
    }

    async function handleSubmit() {
        if(callbackclose){
            callbackclose()
        }
        return router.push({ pathname: '/busca', query: formulario }); 
    }    

    return(
        <>
        
            { !horizontal && <h2 className="font-24 m-0 pb-3 color-primary">Encontre no Site</h2>}
            <div className={horizontal ? "d-none d-md-block searchbox mt-2 mt-md-5 " : "flex-grow-1"}>
                <div className={ horizontal ? "row shadow mx-0 p-4" : "row" } >
                    <div className={ horizontal ? "col-3" : "col-12 pb-2 mb-1" } >
                        <Select 
                            className="select" 
                            classNamePrefix="react-select" 
                            value={finalidades.find(item => item.value == (formulario.finalidade))} 
                            placeholder="FINALIDADE" 
                            onChange={e => {
                                mudarDadosFormulario({ finalidade : e.value })
                                getValores(e.value)
                            }}  
                            options={finalidades} 
                            styles={customStyles} 
                        />
                    </div>

                    <div className={ horizontal ? "col-3" : "col-12 pb-2 mb-1" } >
                        <Select 
                            className="select" 
                            classNamePrefix="react-select" 
                            value={tiposImoveis.find(item => item.value == (formulario.tipo) )} 
                            placeholder="TIPO DO IMÓVEL" 
                            onChange={e => {
                                mudarDadosFormulario({ tipo : e.value })
                            }}  
                            options={tiposImoveis} 
                            styles={customStyles} 
                        />
                    </div>

                    <div className={ horizontal ? "col-2" : "col-12 col-md-4 pb-2 mb-1 pr-3 pr-md-0" }>
                        <Select 
                            className="select" 
                            classNamePrefix="react-select" 
                            placeholder="UF" 
                            value={estados.find(item => item.value == (formulario.uf) )} 
                            onChange={e => {
                                mudarDadosFormulario({ uf : e.value })
                                getCidades(e.value)
                            }}  
                            options={estados} 
                            styles={customStyles} 
                        />
                    </div>

                    <div className={ horizontal ? "col-4" : "col-12 col-md-8 pb-2 mb-1 pl-3 pl-md-0" } >
                        <Select 
                            className="select" 
                            classNamePrefix="react-select" 
                            value={cidades?.find(item => item.value == formulario.cidade)} 
                            placeholder="CIDADE" 
                            onChange={e => {
                                mudarDadosFormulario({ cidade : e.value })
                                getBairros(e.value)
                            }}  
                            options={cidades} 
                            noOptionsMessage={() => 'Selecione'}
                            styles={customStyles} 
                        />
                    </div>

                    <div className={ horizontal ? "col-3 pt-3" : "col-12 pb-2 mb-2" }>
                        <Select 
                            className="select" 
                            classNamePrefix="react-select" 
                            placeholder="BAIRRO" 
                            value={bairros.find(item => item.value == (formulario.bairro) )}  
                            onChange={e => {
                                mudarDadosFormulario({ bairro : e.value })
                            }}  
                            options={bairros} 
                            styles={customStyles}  
                            noOptionsMessage={() => 'Selecione' } 
                        />
                    </div>

                    <div className={ horizontal ? "col-5 pt-3" : "col-12 pb-2 mb-1" }>

                        <label className="d-block font-12 pb-3 ms-2"><div className="imputValorDesejado react-select__control ">VALOR DESEJADO</div></label>

                        <div>

                                
                            <Range

                                min={parseInt(valores.valor_minimo)}
                                max={parseInt(valores.valor_maximo)}
                                values={[ 
                                    formulario.valorde  || 0,
                                    formulario.valorate || 100, 
                                ]}
                                allowCross={false}
                                allowOverlap={true}
                                onChange={e => mudarDadosFormulario({ valorde: e[0], valorate: e[1] })}
                                renderTrack={({ props, children }) => (
                                    <div
                                        {...props}

                                        style={{
                                            ...props.style,
                                            height: '6px',
                                            width: '100%',
                                            backgroundColor: '#ccc'
                                        }}
                                    >
                                        {children}
                                    </div>
                                )}
                                renderThumb={({ props }) => (
                                    <div
                                        {...props}

                                        style={{
                                            ...props.style,
                                            height: '20px',
                                            width: '20px',
                                            borderRadius: '5px',
                                            backgroundColor: '#48AAF0'
                                        }} />
                            )} />


                            <div className="d-flex justify-content-between font-12 pt-3 pb-1 text-center">
                                {
                                    loadingValores ? 
                                    (
                                        <>
                                            <Skeleton width={100} height={15}/> 
                                            <Skeleton width={100} height={15}/>
                                        </>
                                    )
                                : 
                                    (
                                        <>
                                            <div>R$  {moneyFormatter(formulario.valorde  || valores.valor_minimo || 0)}</div>
                                            <div>R$  {moneyFormatter(formulario.valorate || valores.valor_maximo || 0)}</div>
                                        </>
                                    )
                                }
                            </div>
                        </div>


                    </div>
                    <div className={horizontal ? "col-3 pt-4 ms-5" : ""}>
                        <button type="button" className="btn btn-primary font-weight-bold font-14 w-100 py-3" onClick={() => handleSubmit()} disabled={loading ? true : false}>
                            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>}
                            {loading ? 'BUSCANDO' : 'BUSCAR AGORA'}
                        </button>
                    </div>
                </div>
                
            </div>


        </>

    )
}