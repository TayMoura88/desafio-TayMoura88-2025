// Aqui estamos criando o nosso Abrigo de Animais.
// Ela guarda informações sobre os aninais que vivem num abrigo.

class AbrigoAnimais {

  // aqui estamos criando a funcionaria que chamamos de  "construtor()"
  // ela começa organizando os animais e os brinquedos que eles gostam.

  constructor() {
    // Aqui temos uma lista dos animais com seus nomes.
    // Cada animal tem um tipo (como cão, gato ou jabuti)
    // e uma lista de brinquedos preferidos.

    this.animais = {
      Rex: { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
      Mimi: { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
      Fofo: { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
      Zero: { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
      Bola: { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
      Bebe: { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
      Loco: { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
    };
    // Aqui está a lista de brinquedos que são permitidos no abrigo.
    // Se alguém tentar usar um brinquedo que não está aqui, o abrigo não aceita.
    this.brinquedosValidos = new Set([
      'RATO', 'BOLA', 'LASER', 'CAIXA', 'NOVELO', 'SKATE'
    ]);
  }

  //Aqui está organizando os brinquedos que cada pessoa tem
  //A ordem dos animais que querem adotar e verificando as regras de adoção conforme especificado.
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const pessoa1 = brinquedosPessoa1.split(',').map(b => b.trim());
    const pessoa2 = brinquedosPessoa2.split(',').map(b => b.trim());
    const ordem = ordemAnimais.split(',').map(a => a.trim());

    // Validação de brinquedos duplicados por pessoa
    if (new Set(pessoa1).size !== pessoa1.length || new Set(pessoa2).size !== pessoa2.length) {
      return { erro: 'Brinquedo inválido' };
    }

    // Verifica se todos os brinquedos são válidos
    const todosBrinquedos = [...pessoa1, ...pessoa2];
    for (let b of todosBrinquedos) {
      if (!this.brinquedosValidos.has(b)) {
        return { erro: 'Brinquedo inválido' };
      }
    }

    // Validação de animais duplicados ou inválidos
    const animaisSet = new Set(ordem);
    if (animaisSet.size !== ordem.length) {
      return { erro: 'Animal inválido' };
    }
    for (let nome of ordem) {
      if (!this.animais[nome]) {
        return { erro: 'Animal inválido' };
      }
    }

        // Analises e atribuição de adoções conforme as regras dadas
    const resultado = [];
    const adotadosPorPessoa = { 1: [], 2: [] };

    for (let nome of ordem.sort()) {
      const animal = this.animais[nome];
      const brinquedos = animal.brinquedos;

      const pessoa1Tem = this.temBrinquedos(pessoa1, brinquedos, animal.tipo === 'gato');
      const pessoa2Tem = this.temBrinquedos(pessoa2, brinquedos, animal.tipo === 'gato');

      let adotadoPor = 'abrigo';

      if (nome === 'Loco') {
        const companhia = resultado.some(r => !r.includes('Loco - abrigo'));
        if (companhia) {
          if (pessoa1Tem && adotadosPorPessoa[1].length < 3) {
            adotadoPor = 'pessoa 1';
            adotadosPorPessoa[1].push(nome);
          } else if (pessoa2Tem && adotadosPorPessoa[2].length < 3) {
            adotadoPor = 'pessoa 2';
            adotadosPorPessoa[2].push(nome);
          }
        }
      } else {
        if (pessoa1Tem && !pessoa2Tem && adotadosPorPessoa[1].length < 3) {
          adotadoPor = 'pessoa 1';
          adotadosPorPessoa[1].push(nome);
        } else if (!pessoa1Tem && pessoa2Tem && adotadosPorPessoa[2].length < 3) {
          adotadoPor = 'pessoa 2';
          adotadosPorPessoa[2].push(nome);
        }
      }

      resultado.push(`${nome} - ${adotadoPor}`);
    }

    return { lista: resultado };
  }

  temBrinquedos(pessoaBrinquedos, brinquedosAnimal, isGato) {
    if (isGato) {
      // Gatos exigem brinquedos na ordem exata e sem interrupções
      for (let i = 0; i <= pessoaBrinquedos.length - brinquedosAnimal.length; i++) {
        const fatia = pessoaBrinquedos.slice(i, i + brinquedosAnimal.length);
        if (JSON.stringify(fatia) === JSON.stringify(brinquedosAnimal)) {
          return true;
        }
      }
      return false;
    } else {
      // Cães e jabutis aceitam brinquedos na ordem, mesmo com interrupções
      let index = 0;
      for (let b of pessoaBrinquedos) {
        if (b === brinquedosAnimal[index]) {
          index++;
        }
        if (index === brinquedosAnimal.length) return true;
      }
      return false;
    }
  }
}



// Teste
const abrigo = new AbrigoAnimais();
console.log(abrigo.encontraPessoas('SKATE,RATO','RATO,BOLA', 'Loco,Rex,Mimi'
));