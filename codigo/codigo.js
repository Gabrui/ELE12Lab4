//UTILIZA A BIBLIOTECA math.js para o cálculo com números complexos

/* global MathJax, Plotly */

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


function calcular() {

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
    var modelo = document.getElementsByName("modelo")[0].value;

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

    var texto = "";

    texto += "<p>LVD: Potência Recebida = "+ PotLvd.toExponential(3) + " W = " + PotLvdDbm.toFixed(2) + " dBm</p>";
    texto += "<p>Reflexão no solo: Potência Recebida = "+ PotSolo.toExponential(3) + " W = " + PotSoloDbm.toFixed(2) + " dBm</p>";
    texto += "<p>Gume de Faca: Potência Recebida = "+ PotFaca.toExponential(3) + " W = " + PotFacaDbm.toFixed(2) + " dBm</p>";

    document.getElementById("respostas").innerHTML = texto;

}
