//UTILIZA A BIBLIOTECA math.js para o cálculo com números complexos

/* global MathJax, Plotly */

function textoLink(linkPossivel) {
    if (linkPossivel)
        return "<p> O link de comunicação é possível. </p>"
    return "<p> Não é possível estabelecer um link de comunicação. </p>"
}

function estiloClasse(classe, estilo) {
    lista = document.getElementsByClassName(classe);
    for (var i = lista.length; i > 0; i--) {
            lista[i-1].style.display = estilo;
    }
}


function mudarEntradas() {
    var modelo = document.getElementsByName("modelo")[0].value;
    if (modelo == "lvd") {
        estiloClasse("gumefaca", "none");
        estiloClasse("solo", "none");
    } else if (modelo == "gumefaca"){
        estiloClasse("gumefaca", "");
        estiloClasse("solo", "none");
    } else if (modelo == "solo") {
        estiloClasse("gumefaca", "none");
        estiloClasse("solo", "");
    } else {
        estiloClasse("gumefaca", "");
        estiloClasse("solo", "");
    }
}


function calcular(direto,ground,gumefaca) {

    var Pt = Number(document.getElementsByName("Pt")[0].value);
    var Sdbm = Number(document.getElementsByName("Sdbm")[0].value);
    var Gtdb = Number(document.getElementsByName("Gtdb")[0].value);
    var Grdb = Number(document.getElementsByName("Grdb")[0].value);
    var f = Number(document.getElementsByName("fmhz")[0].value) * Math.pow(10, 6);
    var dkm = Number(document.getElementsByName("dkm")[0].value);
    var df = Number(document.getElementsByName("df")[0].value);
    var hg = Number(document.getElementsByName("hg")[0].value);
    var ht = Number(document.getElementsByName("ht")[0].value);
    var hr = Number(document.getElementsByName("hr")[0].value);
    

    var Gt = Math.pow(10, Gtdb/10);
    var Gr = Math.pow(10, Grdb/10);


    var PotLvdDbm = Prl(Pt, Gt, Gr, dkm*1000, f, 1);
    var PotLvd = dbmParaW(PotLvdDbm);
    var PotSoloDbm = Prr(Pt, Gt, Gr, ht, hr, dkm*1000)
    var PotSolo = dbmParaW(PotSoloDbm);
    var PotFacaDbm = PotLvdDbm
    if (dkm > df) {
        PotFacaDbm += Gd(v(hg, (dkm - df)*1000, df*1000, f));
    }
    var PotFaca = dbmParaW(PotFacaDbm);

    var linkPossivel = false;
    var texto = "";
    var dados = [];
    
    var quantIter = 100;
    var mult = 10;
    var distancias = [];
    var lvd = [];
    var solo = [];
    var faca = [];
    var mul = 0;
    for (var i = 0; i < quantIter; i++) {
        mul = (1/mult + i/quantIter*mult);
        distancias[i] = dkm*mul;
        lvd[i] = Prl(Pt, Gt, Gr, dkm*1000*mul, f, 1);
        solo[i] = Prr(Pt, Gt, Gr, ht, hr, dkm*1000*mul);
        faca[i] = lvd [i];
        if (dkm > df)
            faca[i] += Gd(v(hg, (dkm - df)*1000*mul, df*1000*mul, f));
    }
    
    
    if (direto) {
        linkPossivel = PotLvdDbm > Sdbm;
        texto += "<p>LVD: Potência Recebida = "+ PotLvd.toExponential(3) + " W = " + PotLvdDbm.toFixed(2) + " dBm</p>";
        dados.push({
            x: distancias,
            y: lvd,
            mode: 'lines',
            name: 'Linha de Visada Direta',
            line: {shape: 'spline'},
            type: 'scatter'
        });
    } 
    if (ground){
        linkPossivel = PotSoloDbm > Sdbm;
        texto += "<p>Reflexão no solo: Potência Recebida = "+ PotSolo.toExponential(3) + " W = " + PotSoloDbm.toFixed(2) + " dBm</p>";
        dados.push({
            x: distancias,
            y: solo,
            mode: 'lines',
            name: 'Reflexão no Solo',
            line: {shape: 'spline'},
            type: 'scatter'
        });
    } 
    if (gumefaca) {
        linkPossivel = PotFacaDbm > Sdbm;
        texto += "<p>Gume de Faca: Potência Recebida = "+ PotFaca.toExponential(3) + " W = " + PotFacaDbm.toFixed(2) + " dBm</p>";
        dados.push({
            x: distancias,
            y: faca,
            mode: 'lines',
            name: 'Difração em Gume de Faca',
            line: {shape: 'spline'},
            type: 'scatter'
        });
    }


    document.getElementById("respostas").innerHTML = textoLink(linkPossivel) + texto;
    
    var estilo = {
        legend: {
            y: 0.5,
            font: {size: 16},
            yref: 'paper'
        },
        title: 'Análise de potência recebida',
        xaxis: {
            type: 'log',
            title: 'Distância entre as antenas (Km)'
        },
        yaxis: {
            title: 'Potência recebida (dBm)'
        }
    };
    Plotly.newPlot('grafico', dados, estilo);

}



$(document).ready(function () {
var gumefaca = false;
var ground = false;
var direto = false;
estiloClasse("gumefaca", "none");
estiloClasse("solo", "none"); 
    $("#direct").on("click", function(){
        $(this).toggleClass("active");
        if(!direto){
        direto = true;
        }
        else
        {
        direto = false;    
        }
    });



    $("#edge").on("click", function(){
        $(this).toggleClass("active");
        if(!gumefaca){
        estiloClasse("gumefaca", "");
        gumefaca = true;
        }
        else
        {
        estiloClasse("gumefaca", "none");
        gumefaca = false;    
        }
    });

    $("#ground_re").on("click", function(){
        $(this).toggleClass("active");
        if(!ground){
        estiloClasse("solo", "");
        ground = true;
        }
        else
        {
        estiloClasse("solo", "none");
        ground = false;    
        }
    });

    $(".btn-success").on("click", function () {
        calcular(direto,ground,gumefaca);
    });


});
