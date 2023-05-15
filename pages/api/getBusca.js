const apiId              = "328";
const apiUrl             = "https://dev.infoimoveis.com.br/webservice/hotsites.php";

// export const config = {
//   runtime: 'edge',
//   }
export default async  function getBusca(req,res) {
  // res.setHeader('Access-Control-Allow-Origin', '*');

 try {
    let query = await req.text();
      query = JSON.parse(query);

// console.log(req , "somebody")

let dadosBusca ={};

if(query.finalidade =="Aluguel de Temporada" || query.finalidade=="Aluguel/Temporada" ){
  
  dadosBusca = {
    finalidade : 3 ,
    tipo: query.tipo || "",
    uf: query.uf || "",
    cidade: query.cidade || "",
    bairro: query.bairro || "",
    valorde: query.valorde || "",
    valorate : query.valorate || "",
    pagina: query.pg || "",
    ordenacao: query.ordenacao || ""
  }
}else{

    dadosBusca = {
    finalidade : query.finalidade ? (!parseInt(query.finalidade) ? ((query.finalidade.toLowerCase() == 'venda') ? 2 : 1) : query.finalidade) : "",
    tipo: query.tipo || "",
    uf: query.uf || "",
    cidade: query.cidade || "",
    bairro: query.bairro || "",
    valorde: query.valorde || "",
    valorate : query.valorate || "",
    pagina: query.pg || "",
    ordenacao: query.ordenacao || ""
  }

}


const corpo = JSON.stringify( {
    acoes: [  
        
        { 
            metodo: "busca", 
            params: [ 
                {                             
                    resultados: 12,
                    ...dadosBusca
                }]
        }
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
    // res.status(200).json( list);
  
 
  } catch (error) {
    return new Response(JSON.stringify({erro:" erro na requisiçao"}));
  //  res.status(400).json( {erro:" erro na requisiçao"} )
}

} 