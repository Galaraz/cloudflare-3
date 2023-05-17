import Link from "next/link";

export default function Teste2({list}){
    return (
      <div style={{paddingTop: 30}}>
        <Link href={"/"}
          style={{
            marginLeft: 10,
            marginTop:30,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft:10,
            paddingRight: 10,
            backgroundColor: 'red',
            borderRadius: 5
          }}
        >
          Ir para pagina home
        </Link>
        <div style={{marginTop: 30}}>DADOS ANUNCIO 1722</div>
        <div style={{marginTop: 30}}>{JSON.stringify(list)}</div>
    </div>
    )
}


export async function getServerSideProps({ req, res, params }) {
  try {
    let corpo = JSON.stringify({
      acoes: 
        [
          {
            metodo: "dadosimovel",
            params: { registro : params.id || 328 }
          }   
        ],
      loja: 328
    }) 

    const response = await fetch("https://dev.infoimoveis.com.br/webservice/hotsites.php",{
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: corpo
    })
    
    let list = await response.json()
    return {    
      props: {list}
    }

  } catch(e) {
    return {
      notFound: true
    }
  } 
}
  const response =  await fetch( "https://dev.infoimoveis.com.br/webservice/hotsites.php");
  const list = await response.json()
  if (!list) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return { props: { list } }
