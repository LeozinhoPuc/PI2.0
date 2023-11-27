


document.addEventListener('DOMContentLoaded', function () {
  
  const assentos = document.querySelectorAll('.seat');

  assentos.forEach(assento => {
    assento.addEventListener('click', function () {
      if (!assento.classList.contains('vendido')) {
        selecionarAssento(assento.id);
      }
    });
  });

  const aceitarBtn = document.getElementById('aceitarBtn');
  aceitarBtn.addEventListener('click', function () {
    const assentoSelecionado = document.querySelector('.seat.selecionado');
    const idAssentoSelecionado = assentoSelecionado ? assentoSelecionado.id : null;

    const idVoo = document.getElementById('flightId').value;

    enviarDadosParaServidor(idAssentoSelecionado, idVoo);
  });
});

function selecionarAssento(idAssento) {
  const assentos = document.querySelectorAll('.seat');

  assentos.forEach(assento => {
    assento.style.backgroundColor = '';
  });

  const assentoSelecionado = document.getElementById(idAssento);
  assentoSelecionado.style.backgroundColor = '#2e5219'; 
  assentoSelecionado.classList.add('selecionado');
  
  fetch('/booking/assentos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assentoId: idAssento, novoEstado: 'selecionado' }),
  })
  .then(response => response.text())
  .then(data => {
    console.log(data); 
  })
  .catch(error => {
    console.error('Erro:', error);
  });
}

function enviarDadosParaServidor(idAssento, idVoo) {
  fetch('/booking/res', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assentoId: idAssento, vooId: idVoo }),
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
    window.location.href = `/pay?assentoId=${idAssento}&novoEstado=selecionado`;
  })
  .catch(error => {
    console.error('Erro:', error);
  });
}
