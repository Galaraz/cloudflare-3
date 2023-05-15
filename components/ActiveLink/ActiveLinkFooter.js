import React,{useContext} from 'react';
import Link from 'next/link' ;
import { AuthContext } from '../../context';
import { useRouter } from 'next/router';
import { verificarCreci } from '../../utils';

 const  ActiveLinkFooter = (props) => {
    const { openModal } = props;
    const { pathname } = useRouter();
    const { finalidades, anunciante, perfilcorretores  } = useContext(AuthContext);
        
   

    const corretores = verificarCreci(anunciante.creci ).toUpperCase()
    
    const navLink = [

      {
        name:"HOME",
        link:"/",
        enable: true,
      },
         
      {
        name:"ALUGUEL/TEMPORADA",
        link:"/temporada",
        enable:finalidades.includes('Aluguel/Temporada') 
      },
     
      {
        name:"ALUGUEL",
        link:"/aluguel",
        enable:finalidades.includes('Aluguel')
      },
     
      {
        name:"VENDA",
        link:"/venda",
        enable:finalidades.includes('Venda')
      },
      {
        name:corretores,
        link:"",
        enable:perfilcorretores.length > 0

      },
      {
        name:"BANCO DE PEDIDOS",
        link:"/banco-de-pedidos",
        enable:true
      },
      
      {
        name:"FALE CONOSCO",
        link:"/fale-conosco",
        enable:true
      },

    ]; 

    return (
       
    <>
      { navLink.map(({link,name,enable }) =>  {
        if (!enable)  return null
     
              
        return(
 
            <Link
              key={name}
              href={link}
              className={`${pathname === link ? "active-link" : ""} footer-conteudo`}
              onClick={() => {name === corretores && openModal ? openModal() : null}}
            >
              {name}
            </Link>
      
        )


      })}
      
      </> 
    );
  };


   export default ActiveLinkFooter