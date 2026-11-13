const CACHE_NAME='elo-financeiro-final-v3';
const arquivosPrincipais=['./','./index.html','./manifest.json'];
const icones=['./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE_NAME);
 await cache.addAll(arquivosPrincipais);
 await Promise.all(icones.map(arquivo=>cache.add(arquivo).catch(()=>console.log('Ícone ainda não disponível:',arquivo))));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const chaves=await caches.keys();
 await Promise.all(chaves.filter(chave=>chave.startsWith('elo-')&&chave!==CACHE_NAME).map(chave=>caches.delete(chave)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 event.respondWith((async()=>{
  const salvo=await caches.match(event.request);if(salvo)return salvo;
  try{
   const resposta=await fetch(event.request);
   if(resposta.ok&&new URL(event.request.url).origin===self.location.origin){const cache=await caches.open(CACHE_NAME);cache.put(event.request,resposta.clone())}
   return resposta;
  }catch(erro){const fallback=await caches.match('./index.html');if(fallback)return fallback;throw erro}
 })());
});