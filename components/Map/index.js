import React, {useContext} from 'react';
import { AuthContext } from '../../context';

export default function Map(props) {   
    const { anunciante  } = useContext(AuthContext);
    // let mostraMapa = true
    // const {rota} = props;

    // if (rota  === ("/imovel/[id]")) {
    //      mostraMapa = false;
    // }

    function handleClick() {        
        window.open(`https://www.google.com/maps?q=${anunciante.latitude},${anunciante.longitude}`,'_blank');        
    }

    return (
        <div>
                   
            <div className="mapa d-flex justify-content-center align-items-center">                

            { Object.keys(anunciante).length > 0 &&
                <div className="tituloRodape font-11 font-xl-14 d-flex justify-content-center align-items-center text-center">
                    <div className="d-flex flex-column">
                        <span>{anunciante.endereco}</span>
                        <span>{`${anunciante.bairro} - ${anunciante.cidade}/${anunciante.uf}`}</span>
                    </div>
                    {anunciante.latitude && anunciante.longitude &&
                        <div className="pt-2">
                            <button type="button" onClick={handleClick} className="btn btn-primary shadow-sm text-white font-14 px-5 py-2 m-0">
                                <b>VER NO MAPA</b>
                            </button>
                        </div>
                    }
                </div>
            }
               
               
            </div>
        </div>
    );

}