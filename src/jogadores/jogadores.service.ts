import { v1 as uuid } from 'uuid';

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;

    const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (jogadorEncontrado) {
      this.atualizar(jogadorEncontrado, criarJogadorDto);
    } else {
      this.criar(criarJogadorDto);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return this.jogadores;
  }

  async consultarJogadorPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);
    }

    return jogadorEncontrado;
  }

  async deletarJogador(email: string): Promise<void> {
    const indiceJogadorEncontrado = this.jogadores.findIndex(
      (jogador) => jogador.email === email,
    );

    if (!indiceJogadorEncontrado) {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);
    }

    this.jogadores.splice(indiceJogadorEncontrado, 1);
  }

  private criar(criarJogadorDto: CriarJogadorDto): void {
    const { nome, telefoneCelular, email } = criarJogadorDto;

    const jogador: Jogador = {
      _id: uuid(),
      nome,
      telefoneCelular,
      email,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'www.google.com.br/foto123.jpg',
    };

    this.logger.log(`criarJogadorDto: ${JSON.stringify(jogador, null, 2)}`);

    this.jogadores.push(jogador);
  }

  private atualizar(
    jogadorEncontrado: Jogador,
    criarJogadorDto: CriarJogadorDto,
  ): void {
    const { nome } = criarJogadorDto;

    jogadorEncontrado.nome = nome;
  }
}
