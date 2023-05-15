
import { createContext, useState ,useEffect} from "react";
import { urlSite } from "../utils";

export const AuthContext = createContext({})
export default function AuthProvider({children}){
  
    const [anunciante,setAnunciante] = useState([])
    const [finalidades, setFinalidades]= useState([])
    const [estados,setEstados] = useState([])
    const [valores,setValores] = useState({ valor_minimo: '', valor_maximo: '' })
    const [tipoimoveis,setTipoImoveis] = useState([])
    const [perfilcorretores,setPerfilcorretores] = useState([])
    const [loadingDados, setLoadingDados] = useState(true)
      
 
    useEffect(() => {
     
     getDados();
     
    },[]);
   
    async function getDados (){
        setLoadingDados(true)
        // const response =  await fetch(`${urlSite}api/getDados`);
        const response =  await fetch(`api/getDados`);
        
        
        const list = await response.json()
       console.log(list ,"list veioo")
        Object.keys(list).includes('anunciante') && setAnunciante(list.anunciante)
        Object.keys(list).includes('finalidades') && setFinalidades(list.finalidades.map( (item) => {return item.label} ))
        Object.keys(list).includes('estados')&& setEstados(list.estados);
        Object.keys(list).includes('valores')&& setValores(list.valores);
        Object.keys(list).includes('tipoimoveis')&& setTipoImoveis(list.tipoimoveis) ;
        Object.keys(list).includes('perfilcorretores') && setPerfilcorretores(list.perfilcorretores)
        setLoadingDados(false) ;
    }

    return(
        <AuthContext.Provider 
        value={{ 
            anunciante, 
            finalidades, 
            estados,
            valores,
            tipoimoveis,
            perfilcorretores, 
            loadingDados,
            setLoadingDados,            
            setValores
           
        }}>
            {children}
        </AuthContext.Provider>
    )

}