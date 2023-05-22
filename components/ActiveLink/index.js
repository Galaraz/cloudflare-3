import React,{useContext,useEffect} from 'react';
import Link from 'next/link' ;
import { AuthContext } from '../../context';
import { useRouter } from 'next/router';

 const  ActiveLink = (  ) => {
    const { pathname } = useRouter();
    const { finalidades } = useContext(AuthContext);
    
   
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
          className={`${pathname === link  ? "active-link" : ""}` }
          >
            {name}
          </Link>  
        
        )
      })}
      
      </> 
    );
  };


   export default ActiveLink