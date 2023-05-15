const apiId              = "328";
const apiUrl             = "https://dev.infoimoveis.com.br/webservice/hotsites.php";

// export const config = {
//   runtime: 'edge',
//   }

export default async  function requisicoes (req,res) {

//  res.setHeader('Access-Control-Allow-Origin', '*');
let query = await req.text();
query = JSON.parse(query);

const {metodo, valor} = query;

const corpo = JSON.stringify( {
    acoes: [    
        
        { metodo:  metodo, params: [{registro : valor }]}
    ], id: apiId
  });

try {
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