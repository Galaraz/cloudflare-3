import { apiUrl } from "@/utils";

export const config = {
  runtime: 'edge',
}

export default async  function requisicoes (req,res) {

  try {

    let body =  await req.text();
    body = JSON.parse(body);

    const response =  await fetch(
        apiUrl,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: JSON.stringify(body)
        }
    
    );
    const list = await response.json()
    
    return new Response(JSON.stringify(list));

  } catch (error) {
     return new Response(JSON.stringify({erro:" erro na requisiçao"}));
  }
}
 