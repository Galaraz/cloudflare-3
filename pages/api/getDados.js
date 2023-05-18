const apiId              = "328";
const apiUrl             = "https://dev.infoimoveis.com.br/webservice/hotsites.php";

export const config = {
    runtime: 'edge',
    }
export default async  function requisicoes(req, res)  {     
 


  res.setHeader('Access-Control-Allow-Origin', '*');
    const corpo = JSON.stringify( {
        acoes: [                        
            { metodo : "dadosanunciante" },		
            { metodo : "finalidades" },
            { metodo : "estados" }, 
            { metodo : "valores"  },
            { metodo : "tipoimoveis" },
            { metodo: "perfilcorretores", params: [] },
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
   
    //  res.status(200).json( list )
     return new Response(JSON.stringify(list));

} 