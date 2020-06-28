const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

const app = express();

app.use(express.static('frontend'));

let partidas = [];


app.use( bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json());

app.use(cors());



app.post("/api/game", function(req, res){
    let idPartida = partidas.length + 1;

    let jogador = Math.floor(Math.random() * 2);

    const novaPartida =  {
        idPartida: idPartida,
        jogadorDaVez: jogador === 0 ? "X" : "O",
        matriz: [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ]
    };
    partidas[partidas.length] = novaPartida;
    
    return res.status(201).json(novaPartida);

})


function VerificaFimdaPartida(partida){
    if(
        (partida.matriz[0][0] == "X" && partida.matriz[0][1] == "X" && partida.matriz[0][2] == "X") ||
        (partida.matriz[1][0] == "X" && partida.matriz[1][1] == "X" && partida.matriz[1][2] == "X") ||
        (partida.matriz[2][0] == "X" && partida.matriz[2][1] == "X" && partida.matriz[2][2] == "X") || 
        (partida.matriz[0][0] == "X" && partida.matriz[1][1] == "X" && partida.matriz[2][2] == "X") || 
        (partida.matriz[0][2] == "X" && partida.matriz[1][1] == "X" && partida.matriz[2][0] == "X") || 
        (partida.matriz[0][0] == "X" && partida.matriz[1][0] == "X" && partida.matriz[2][0] == "X") || 
        (partida.matriz[0][1] == "X" && partida.matriz[1][1] == "X" && partida.matriz[2][1] == "X") || 
        (partida.matriz[0][2] == "X" && partida.matriz[1][2] == "X" && partida.matriz[2][2] == "X")
    ){
        return "X ganhou"
    }
    else if(
        (partida.matriz[0][0] == "O" && partida.matriz[0][1] == "O" && partida.matriz[0][2] == "O") ||
        (partida.matriz[1][0] == "O" && partida.matriz[1][1] == "O" && partida.matriz[1][2] == "O") ||
        (partida.matriz[2][0] == "O" && partida.matriz[2][1] == "O" && partida.matriz[2][2] == "O") || 
        (partida.matriz[0][0] == "O" && partida.matriz[1][1] == "O" && partida.matriz[2][2] == "O") || 
        (partida.matriz[0][2] == "O" && partida.matriz[1][1] == "O" && partida.matriz[2][0] == "O") || 
        (partida.matriz[0][0] == "O" && partida.matriz[1][0] == "O" && partida.matriz[2][0] == "O") || 
        (partida.matriz[0][1] == "O" && partida.matriz[1][1] == "O" && partida.matriz[2][1] == "O") || 
        (partida.matriz[0][2] == "O" && partida.matriz[1][2] == "O" && partida.matriz[2][2] == "O")
    ){
        return "O ganhou"
    }
    else if(
        partida.matriz[0][0] != 0 && partida.matriz[0][1] != 0 && partida.matriz[0][2] != 0 &&
        partida.matriz[1][0] != 0 && partida.matriz[1][1] != 0 && partida.matriz[1][2] != 0 &&
        partida.matriz[2][0] != 0 && partida.matriz[2][1] != 0 && partida.matriz[2][2] != 0)   
    {
        return "Deu velha"
    }
    else{
        return false
    }
}

app.post("/api/game/:id/movement", function(req, res){

    const idPartida = req.params.id;

    const { y, x, jogadorDaVez } = req.body;

    const indexPartida = partidas.findIndex( function ( partida ){
        return partida.idPartida == idPartida;
    });


    if(indexPartida != -1 ){

        if(partidas[indexPartida].jogadorDaVez == jogadorDaVez ){

            if(partidas[indexPartida].matriz[y][x] == 0){
                partidas[indexPartida].matriz[y][x] = jogadorDaVez;

                const verificacaoFimPartida = VerificaFimdaPartida(partidas[indexPartida]);
    
                if(verificacaoFimPartida){
                    return res.status(200).json({
                        msg: "Partida Finalizada",
                        status: 200,
                        winner: verificacaoFimPartida
                    });
                }
                else{
                    partidas[indexPartida].jogadorDaVez  = partidas[indexPartida].jogadorDaVez === "X" ? "O" : "X";
                    return res.status(200).json({
                        msg: "Movimento efetuado",
                        status: 200
                    });
                }
            }
            else{
                return res.status(401).json({
                    msg: "Jogada inválida",
                    status: 401
                })
            }
        }
        else{
            return res.status(401).json({
                msg: "Não é a vez do jogador",
                status: 401
            });
        }
    }
    else{
        return res.status(404).json({
            msg: "Partida não encontrada",
            status: 404
        });
    }
})

 app.listen(8081, function(){
     console.log("servidor iniciado")
 });