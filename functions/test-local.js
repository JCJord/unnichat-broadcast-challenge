const { getFirestore, Timestamp } = require('firebase-admin/firestore');

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.GCLOUD_PROJECT = 'unnichat-broadcast-challenge';

async function runTest() {
  const { processScheduledBroadcastsHandler } = require('./lib/index.js');
  const db = getFirestore();

  console.log('\n======================================================');
  console.log(' TESTE LOCAL: FIREBASE CLOUD FUNCTION SCHEDULER');
  console.log('======================================================');

  console.log('[TEST] 1. Criando broadcast agendado de teste no Firestore...');
  const testDocRef = await db.collection('broadcasts').add({
    userId: 'test-inspector-01',
    connectionId: 'conn-test-01',
    contactIds: ['c1', 'c2'],
    recipientCount: 2,
    message: 'Mensagem de teste da Cloud Function local',
    status: 'scheduled',
    scheduledFor: Timestamp.fromMillis(Date.now() - 10000), // 10 segundos no passado
    sentAt: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  console.log(`[TEST] Documento criado com sucesso. ID: ${testDocRef.id}`);

  const beforeDoc = await testDocRef.get();
  console.log(`[TEST] Status ANTES da execucao: "${beforeDoc.data().status}" (sentAt: ${beforeDoc.data().sentAt})`);

  console.log('[TEST] 2. Disparando a logica da Cloud Function (processScheduledBroadcastsHandler)...');
  const processedCount = await processScheduledBroadcastsHandler();
  console.log(`[TEST] Total de broadcasts processados pela function: ${processedCount}`);

  console.log('[TEST] 3. Verificando o estado do documento apos o processamento...');
  const afterDoc = await testDocRef.get();
  const data = afterDoc.data();

  console.log(`[TEST] Status DEPOIS da execucao: "${data.status}"`);
  console.log(`[TEST] sentAt preenchido: ${data.sentAt ? data.sentAt.toDate().toISOString() : 'NAO'}`);
  console.log(`[TEST] updatedAt atualizado: ${data.updatedAt ? data.updatedAt.toDate().toISOString() : 'NAO'}`);

  if (data.status === 'sent' && data.sentAt) {
    console.log('\n------------------------------------------------------');
    console.log(' RESULTADO: APROVADO! A Cloud Function processou');
    console.log(' com sucesso o status para "sent" e preencheu sentAt!');
    console.log('------------------------------------------------------\n');
    process.exit(0);
  } else {
    console.error('\n------------------------------------------------------');
    console.error(' RESULTADO: FALHA! O documento nao foi atualizado.');
    console.error('------------------------------------------------------\n');
    process.exit(1);
  }
}

runTest().catch((err) => {
  console.error('[ERRO FATAL NO TESTE]', err);
  process.exit(1);
});
