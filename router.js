var express = require('express');
var router = express.Router();
const DB = require('./database/db');
const oracledb = require('oracledb');
const { searchView, bookingView, payView, flightsView } = require('./controllers/pageController');

// Rota para exibir a página de busca de voos
router.get('/buscaDeVoos', flightsView);

// Rota para exibir a página de reserva
router.get('/booking', bookingView);

// Rota para exibir a página de pagamento
router.get('/pay', payView);

// Rota padrão, exibe a página de busca inicial
router.get('/', async (req, res, next) => {
  try {
    // Consulta ao banco de dados para obter informações sobre aeroportos
    const sql = 'SELECT ID_AEROPORTO, CIDADE || \' - \' || NOME_AEROPORTO AS NOME_COMPLETO FROM AEROPORTOS_CIDADES';
    const result = await DB.Open(sql, [], false);
    const aeroportos = result.rows;

    // Renderiza a página de busca com os aeroportos obtidos do banco de dados
    res.render('search', { title: 'Express', aeroportos });
  } catch (error) {
    console.error(error);
    res.render('error', { error });
  }
});

// Rota para processar a busca de voos
router.post('/buscaDeVoos', async (req, res) => {
  try {
    // Parâmetros da busca de voos
    const origin = req.body.origin;
    const destination = req.body.destination;
    const tripType = req.body.tripType;
    const departureDate = req.body.departureDate;
    const returnDate = req.body.returnDate;

    // Consulta ao banco de dados para obter informações sobre voos
    let sql = `
      SELECT v.ID_VOO, v.DATA, v.HORARIO_PARTIDA, v.HORARIO_CHEGADA, a.ID_AERONAVE, tc.CIDADE AS ORIGEM, td.CIDADE AS DESTINO
      FROM VOOS v
      JOIN AERONAVES a ON v.ID_AERONAVE = a.ID_AERONAVE
      JOIN TRECHOS tr ON v.ID_TRECHO = tr.ID_TRECHO
      JOIN AEROPORTOS_CIDADES tc ON tr.ORIGEM = tc.ID_AEROPORTO
      JOIN AEROPORTOS_CIDADES td ON tr.DESTINO = td.ID_AEROPORTO
      WHERE tr.ORIGEM = ${origin}
        AND tr.DESTINO = ${destination}
        AND (v.DATA = TO_DATE('${departureDate}', 'YYYY-MM-DD') OR v.DATA = TO_DATE('${returnDate}', 'YYYY-MM-DD'))
      ORDER BY v.DATA, v.HORARIO_PARTIDA
    `;
    const result = await DB.Open(sql, [], false);
    const voos = result.rows;
    
    // Renderiza a página de voos com os resultados obtidos
    res.render('flights', { title: 'Express', voos });
  } catch (error) {
    console.error(error);
    res.render('error', { error });
  }
});

// Rota para processar a reserva de voos
router.post('/booking', async (req, res) => {
  try {
    // Parâmetro da reserva
    const flightId = req.body.flightId;
    const voo = req.body;

    // Consulta ao banco de dados para obter informações sobre assentos disponíveis
    const result = await DB.Open('SELECT * FROM Mapa_Assentos WHERE VOO_ID = :flightId', [flightId], false);
    const MapaAssentos = result.rows;

    // Renderiza a página de reserva com os resultados obtidos
    res.render('booking', { title: 'Express', voo, MapaAssentos });
  } catch (error) {
    console.error(error);
    res.render('error', { error });
  }
});

// Rota para processar a escolha de assentos
router.post('/booking/assentos', (req, res) => {
  const { assentoID, novoEstado } = req.body;
  res.status(200).send('Solicitação processada com sucesso');
});

// Rota para processar o pagamento
router.post('/booking/res', async (req, res) => {
  try {
    // Parâmetros do pagamento
    const assentoID = req.body.assentoID;
    const vooId = req.body.vooId;

    // Renderiza a página de pagamento com os resultados obtidos
    res.render('pay', { title: 'Express', assentoID, vooId });
  } catch (error) {
    console.error(error);
    res.render('error', { error });
  }
});

// Rota para processar o pagamento efetivo
router.post('/pay/processPayment', async (req, res) => {
  try {
    // Parâmetros do pagamento efetivo
    const assentoID = req.body.assentoID;
    const vooId = req.body.vooId;

    // Atualiza o status do assento no banco de dados para 'VENDIDO'
    const updateSql = 'UPDATE Mapa_Assentos SET STATUS = :status WHERE ID = :assentoID';
    const updateParams = { assentoID, status: 'VENDIDO' };
    await DB.Open(updateSql, updateParams, true);

    // Envia resposta de sucesso
    res.send('Sua passagem aérea foi emitida e enviada para seu email!');
  } catch (error) {
    const mensagemError = 'Erro';
    res.status(500).send(mensagemError);
  }
});

// Exporta o roteador para uso em outros arquivos
module.exports = { routes: router };
