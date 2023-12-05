function handlePaymentMethodChange() {
    const metodoPagamento = document.getElementById('customPaymentMethod').value;
    const camposCartaoCredito = document.getElementById('creditCardFields');
    const dataExpiracaoCartao = document.getElementById('creditCardExpiry');

    if (metodoPagamento === 'pix') {
        desabilitarCamposCartaoCredito();
    } else {
        habilitarCamposCartaoCredito();
    }
}

function desabilitarCamposCartaoCredito() {
    const numeroCartaoCredito = document.getElementById('creditCardNumber');
    const dataExpiracaoCartao = document.getElementById('creditCardExpiryDate');

    numeroCartaoCredito.readOnly = true;
    dataExpiracaoCartao.readOnly = true;

    numeroCartaoCredito.value = '';
    dataExpiracaoCartao.value = '';
}

function habilitarCamposCartaoCredito() {
    const numeroCartaoCredito = document.getElementById('creditCardNumber');
    const dataExpiracaoCartao = document.getElementById('creditCardExpiryDate');

    numeroCartaoCredito.readOnly = false;
    dataExpiracaoCartao.readOnly = false;
}

function enviarDadosDePagamento() {
    const nome = document.getElementById('customName').value;
    const email = document.getElementById('customEmail').value;
    const metodoPagamento = document.getElementById('customPaymentMethod').value;

    const idAssento = document.getElementById('AssentoIDInput').value;
    const novoEstado = document.getElementById('novoEstadoInput').value;

    let numeroCartao = '';
    let dataExpiracao = '';
    if (metodoPagamento === 'creditCard') {
        numeroCartao = document.getElementById('creditCardNumber').value;
        dataExpiracao = document.getElementById('creditCardExpiryDate').value;
      
        if (numeroCartao.length < 8) {
            alert('Desculpe, no momento não é possível processar o seu pagamento. Tente novamente mais tarde');
            return; 
        }
    }
    const dadosPagamento = {
        nome,
        email,
        metodoPagamento,
        idAssento,
        novoEstado,
        numeroCartao,
        dataExpiracao,
    };

    fetch('/pay/processPayment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosPagamento),
    })
    .then(response => response.text())
    .then(data => {
        if (data.includes('Erro:')) {
            alert('Desculpe, no momento não é possível processar o seu pagamento. Tente novamente mais tarde');
        } else {
            alert('Sua passagem aérea foi emitida e enviada para seu email!');
        }
    })
    .catch(error => {
        const mensagemErro = 'Erro ao processar o pagamento. Por favor, tente novamente mais tarde.';
        document.getElementById('mensagemErro').innerText = mensagemErro;
        console.error('Erro:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {

    
    const botaoPagar = document.getElementById('payBtn');
    if (botaoPagar) {
        botaoPagar.addEventListener('click', enviarDadosDePagamento);
    }
});
