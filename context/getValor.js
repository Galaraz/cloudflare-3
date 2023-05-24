const apiId              = "328";
const apiUrl             = "https://dev.infoimoveis.com.br/webservice/hotsites.php";

export const config = {
  runtime: 'edge',
  }
export default async  function requisicoes (req,res) {

  // res.setHeader('Access-Control-Allow-Origin', '*');
let reqFinalidade ="";
  try {
    
    // let valor =  await req.body;
    let valor =  await req.text();

    
    // valor = JSON.parse(valor)
        
    if (valor === "Aluguel de Temporada"|| valor === "Aluguel/Temporada"){
      reqFinalidade = 3;
    }else{

      reqFinalidade = valor ? (!parseInt(valor) ? ((valor.toLowerCase() == 'venda') ? 2 : 1) : valor) : "";
    }
    
   
    
    const corpo = JSON.stringify( {
        acoes: [    
            
            { metodo: "valores", params: [{finalidade : reqFinalidade }]}
        ], id: apiId
      });

      const response =  await fetch(
        apiUrl,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: corpo
        }
    
    );
    const list = await response.json()
   
     return new Response(JSON.stringify(list));
    // res.status(200).json( list )

  } catch (error) {
    
     return new Response(JSON.stringify({erro:" erro na requisiçao"}));
     
  }
 
        

} 