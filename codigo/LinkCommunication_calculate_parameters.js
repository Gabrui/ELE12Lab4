/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * @function dbmParaW Transforma de dBm para Watts
 * @param {number} dbm A potência em dBm
 * @returns {number} A potência em Watts
 */
function dbmParaW(dbm){
    return Math.pow(10, dbm/10)/1000;
}

/**
 * @function [beta] Calcula o comprimento de onda
 * @constant {number} c velocidade da luz
 * @param {number} f frequencia
 * @returns comprimento de onda
 */
function lambda(f){
    c = 300000000;
    return c/f;
}

/**
 * @function [Prr] Calcula a potencia recebida modelo 2 raios refletidos
 * @param {number} Pt potencia transmitida em Watts
 * @param {number} Gt ganho do transmissor NAO eh em dB
 * @param {number} Gr ganho do receptor NAO eh em dB
 * @param {number} ht altura do transmissor
 * @param {number} hr altura do receptor
 * @param {number} d distancia entre as antenas em metros
 * @returns potencia recebida em dBm 
 */
function Prr(Pt,Gt,Gr,ht,hr,d){
    
    return 10*Math.log10((Pt*Gt*Gr*ht*ht*hr*hr/Math.pow(d,4))*1000);
}
/**
 * @function [Prl] Calcula a potencia recebida modelo linha de visada direta
 * @param {number} Pt potencia transmitida em Watts
 * @param {number} Gt ganho do transmissor NAO eh em dB
 * @param {number} Gr ganho do receptor NAO eh em dB
 * @param {number} f frequencia de operacao Hz
 * @param {number} L atenuacao dissipativa 
 * @param {number} d distancia entre as antenas em metros
 * @returns potencia recebida em dBm 
 */
function Prl(Pt,Gt,Gr,d,f,L){
   
    return 10*Math.log10((Pt*Gt*Gr*lambda(f)*lambda(f)/(Math.pow(d*4*Math.PI,2))*L)*1000);
}

/**
 * @function {v}   Calcula o parametro de Fresnel Kirchhoff
 * @param {number} h altura do gume de faca em relacao a LVD em metro
 * @param {number} d1 distancia do transmissor ate o gume de faca em metro
 * @param {number} d2 distancia do receptor ate o gume de faca em metro
 * @param {number} f frequencia de operacao
 * @returns {number} parametro de Fresnel
 */
function v(h,d1,d2,f){
    
   return h*Math.sqrt((2*(d1+d2))/(lambda(f)*d1*d2));
    
}

/**
 * @function {Gd} Calcula perda de ganho
 * @param {number} vfk parametro de Fresnel Kirchhoff 
 * @returns {number} perda de ganho em dB
 */
function Gd(vfk){
    
    if (vfk <= -1){
        return 0;
    }
    else if (-1<vfk<= 0){
        return 20*Math.log10(0.5-0.62*vfk);
    }
    else if(0< vfk <=1 ){
        return 20*Math.log10(0.5*Math.exp(-0.95*vfk));
        
    }
    else if(1< vfk <=2.4){
        return 20*Math.log10(0.4-Math.sqrt(0.1184-(0.38-0.1*vfk)*(0.38-0.1*vfk)));
    }
    else{
        return 20*Math.log10(0.225/vfk);
    }
}

