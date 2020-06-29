let partidas = [];
let partida;



function chamarAPI(url, method, body)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( method, url, false ); 
    xmlHttp.setRequestHeader('Content-Type', 'application/json');

    xmlHttp.send( JSON.stringify(body) );
    return JSON.parse(xmlHttp.responseText);
}

/*
* Função para fjsfjhvj
*/
function inicioPartida(){
    if(!partida){
        partida = chamarAPI('http://localhost:8081/api/game', "POST");
        console.log(partida)
        alert("partida iniciada");
    }
    else{
        alert("Já existe uma partida em andamento.");
    }
  
}


function efetuarJogada(botao, y, x){

    if(partida){

        const { jogadorDaVez, idPartida } = partida;

        const resultadoJogada = chamarAPI("http://localhost:8081/api/game/" + partida.idPartida + "/movement", "POST", {
            y: y,
            x: x, 
            idPartida: idPartida, 
            jogadorDaVez: jogadorDaVez
        });

    
        if(resultadoJogada.status === 200){

            botao.value= jogadorDaVez;

            if(resultadoJogada.winner){
                alert(resultadoJogada.winner)
                zerar();
                partida = undefined;
            }
            else{
                partida.jogadorDaVez = partida.jogadorDaVez === "X" ? "O" : "X";
            }
        }
        else{
            alert(resultadoJogada.msg)
        }
    }
    else{
        alert("Partida não iniciada")
    }
}


function zerar(){
    let botaoJogada = document.getElementsByClassName("botaoJogada");
    let i;
    for (i = 0; i < botaoJogada.length; i++) {
        botaoJogada[i].value = " ";
    }
}

