/* eslint-disable no-unused-vars */
interface ILotteryABI {
  halve: (seed: string, weightedPlayers: { [key: string]: number }) => { [key: string]: number };
  numberOfRounds: (weightedPlayers: { [key: string]: number }) => number;
  lottery(seed: string, winners: number, players: any[]): any[];
}

import { useNomad } from '@halving-massacre/nomad';
import { useState } from 'react';
import { removeObjectKeys } from '@/../lib/utils';
import { Button, Divider, Heading, Input, Text, Textarea } from '@lawallet/ui';

export const NomadTest = () => {
  const { halve, numberOfRounds } = useNomad<ILotteryABI>('timba@hodl.ar/lottery');
  const [playersInput, setPlayersInput] = useState('');
  const [error, setError] = useState<string>();
  const [remainingRounds, setRemainingRounds] = useState(0);
  const [seed, setSeed] = useState<string>();
  const [currentPlayers, setCurrentPlayers] = useState<{
    [key: string]: number;
  }>({});
  const [currentWinners, setCurrentWinners] = useState<{
    [key: string]: number;
  }>({});
  const [currentLosers, setCurrentLosers] = useState<{
    [key: string]: number;
  }>({});

  const parseCurrentPlayers = (playersInput: string) => {
    setPlayersInput(playersInput);
    try {
      const players = JSON.parse(playersInput);
      setCurrentPlayers(players);
      setRemainingRounds(numberOfRounds(currentPlayers));
      setError(undefined);
    } catch (e) {
      setCurrentPlayers({});
      setRemainingRounds(0);
      setError('Invalid JSON');
      console.log('Invalid JSON');
    }
  };

  const calcWinners = () => {
    if (!currentPlayers || !seed) {
      return;
    }

    const winners = halve(seed, currentPlayers);
    const losers = removeObjectKeys(currentPlayers, winners);
    setCurrentWinners(winners);
    setCurrentLosers(losers);
  };

  return (
    <div>
      <Heading align="center">Halving Massacre</Heading>
      <Divider y={20} />
      <div>Participantes en JSON</div>
      <Divider y={20} />
      <Textarea
        onChange={(elm) => parseCurrentPlayers(elm.currentTarget.value)}
        placeholder="{}"
        status={error ? 'error' : 'success'}
        value={playersInput || ''}
      ></Textarea>
      {error && <Text color="red">{error}</Text>}
      <Divider y={20} />
      <div>Rondas Restantes : {remainingRounds}</div>
      <Divider y={20} />

      <Input
        type="text"
        placeholder="Blockhash"
        value={seed || ''}
        onChange={(el) => setSeed(el.currentTarget.value)}
      />
      <Divider y={20} />

      <Button disabled={!currentPlayers || !seed} onClick={calcWinners}>
        Calcular Ganadores
      </Button>

      <Divider y={20} />
      {currentWinners && (
        <>
          <Heading>RESULTADO</Heading>

          <div>Sobrevivientes:</div>
          <div>
            {Object.keys(currentWinners).map((winner) => (
              <li key={winner}>
                <span>{winner} : </span>
                <span>
                  {currentPlayers[winner]} (+500) = {currentWinners[winner]}
                </span>
              </li>
            ))}
          </div>

          <div>
            <div>Muertos:</div>
            <div>
              <div>
                {Object.keys(currentLosers).map((loser) => (
                  <li key={loser}>
                    <s>
                      <span>{loser} : </span>
                      <span>{currentPlayers[loser]}</span>
                    </s>
                  </li>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
