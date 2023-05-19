import React, { useState, useEffect, useContext } from 'react';
import { Range } from 'react-range';
import Select from 'react-select';
import { useRouter } from 'next/router';
import {AuthContext} from '../../context';

import {  moneyFormatter, getValores, utils  } from '../../utils';
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
    const { finalidades,tipoimoveis ,estados, valores, loadingDados, setValores} = useContext(AuthContext);
    const { callbackclose} = props
    const arrayFinalidades = finalidades.map(item => {return { value: item, label:item}}) 
    const [ loading, setLoading] = useState(false);
    const [ formulario, setFormulario ] = useState(props.formulario ? props.formulario : (queryInicial ? queryInicial : []));  
    const [ cidades, setCidades ] = useState([]);        
    const [ bairro, setBairro ] = useState([]); 
    const { valor_minimo, valor_maximo } = valores

    function mudarDadosFormulario(dados){
        setFormulario({...formulario, ...dados});
    }

    async function SetValores(){
           let valor=""
           let response = await getValores(valor);
           return  setValores ( { ...valores, ...{ valor_minimo: parseInt(response.valores.valor_minimo), valor_maximo: parseInt(response.valores.valor_maximo)} });
    }
        useEffect(() => {
        
        if (valor_maximo === null && valor_minimo === null  || isNaN(valor_maximo) && isNaN(valor_minimo)){
            SetValores();
        }
       
    },[])


    async function handleOptionChange(tipo, valor) {        
   
        if (tipo === 'finalidade') {
            let response = await getValores(valor);
            console.log("pegando valor", response);
            setValores({ ...valores,  valor_minimo: parseInt(response.valores.valor_minimo), valor_maximo: parseInt(response.valores.valor_maximo) })
            return  setFormulario ( { ...formulario, finalidade: valor, valorde: parseInt(response.valores.valor_minimo), valorate: parseInt(response.valores.valor_maximo) });
       
        } else if (tipo === 'tipo') {
            return setFormulario({ ...formulario, tipo: valor });
        } else if (tipo === 'uf') {
            let acao = "cidades"
            setFormulario({ ...formulario, uf: valor });
            setCidades([{value: '', label: 'Carregando'}]);
            let response = await utils(acao ,valor);
            return  setCidades(response.cidades);
             
        } else if (tipo === 'cidade') {
            let acao = "bairros"
            setFormulario({ ...formulario, cidade: valor });
            setBairro([{value: '', label: 'Carregando'}]);
            let response = await utils(acao ,valor);    
            return setBairro(response.bairros);
            
        } else if (tipo === 'bairro') {
            return setFormulario({ ...formulario, bairro: valor });            
        } 

        
    }

    async function handleSubmit() {
        if(callbackclose){
            callbackclose()
        }
        if(!formulario.finalidade || formulario === undefined){ 
            setFormulario ( { ...formulario, finalidade: "", valorde: parseInt(valor_minimo), valorate: parseInt(valor_maximo) })
            return router.push({ pathname: '/busca', query: setFormulario });
        }
        
        setLoading(false);
         return router.push({ pathname: '/busca', query: formulario });
        
       
    }    
    

        return(
       
            <>
           
            <h2 className="font-24 m-0 pb-3 color-primary">Encontre no Site</h2>
                <div className="flex-grow-1">
                    <div className="row">
    
                        <div className="col-12 pb-2 mb-1">
                            <Select className="select" classNamePrefix="react-select" value={arrayFinalidades.find(item => item.value == (formulario.finalidade) )} placeholder="FINALIDADE" onChange={e => handleOptionChange('finalidade',e.value)}  options={arrayFinalidades} styles={customStyles} />
                        </div>
    
                        <div className="col-12 pb-2 mb-1">
                            <Select className="select" classNamePrefix="react-select" value={tipoimoveis.find(item => item.value == (formulario.tipo) )} placeholder="TIPO DO IMÓVEL" onChange={e => handleOptionChange('tipo', e.value)} options={tipoimoveis} styles={customStyles} />
                        </div>
    
                        <div className="col-12 col-md-4 pb-2 mb-1 pr-3 pr-md-0">
                            <Select className="select" classNamePrefix="react-select" placeholder="UF" value={estados.find(item => item.value == (formulario.uf) )} onChange={e => handleOptionChange('uf', e.value)} options={estados} styles={customStyles} />
                        </div>
    
                        <div className="col-12 col-md-8 pb-2 mb-1 pl-3 pl-md-0">
                            <Select className="select" classNamePrefix="react-select" value={ cidades?.find(item => item.value == formulario.cidade)} placeholder="CIDADE" onChange={e => handleOptionChange('cidade', e.value)} options={cidades} noOptionsMessage={() => 'Selecione'} styles={customStyles} />
                        </div>
    
                        <div className="col-12 pb-2 mb-2">
                            <Select className="select" classNamePrefix="react-select" placeholder="BAIRRO" value={bairro.find(item => item.value == (formulario.bairro) )}  onChange={e => handleOptionChange('bairro', e.value)} options={bairro} styles={customStyles}  noOptionsMessage={() => 'Selecione' }  />
                        </div>
    
                        <div className="col-12 pb-2 mb-1">
    
                            <label className="d-block font-12 pb-3 ms-2"><div className="imputValorDesejado react-select__control ">VALOR DESEJADO</div></label>
    
                            <div>
    
                                    
                                <Range
    
                                    min={parseInt(valor_minimo)}
                                    max={parseInt(valor_maximo)}
                                    values={[ 
                                        formulario.valorde  || valor_minimo  || 0,
                                        formulario.valorate ||  valor_maximo || 100, 
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
    
                                    {loadingDados ? <div style={{ backgroundColor: '#d1d1d1', height: 15, width: 80 }} /> : <div>R$  {moneyFormatter(formulario.valorde  || valor_minimo || 0)} </div>}
                                    {loadingDados ? <div style={{ backgroundColor: '#d1d1d1', height: 15, width: 80 }} /> : <div>R$  {moneyFormatter(formulario.valorate || valor_maximo || 0)} </div>}
    
                                </div>
                            </div>
    
    
                        </div>
    
                    </div>
                </div>
                <button type="button" className="btn btn-primary font-weight-bold font-14 w-100 py-3" onClick={() => handleSubmit()} disabled={loading ? true : false}>
                    {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>}
                    {loading ? 'BUSCANDO' : 'BUSCAR AGORA'}
                </button>
            </>
    
        )
    }