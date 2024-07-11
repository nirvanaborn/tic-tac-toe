import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, message } from 'antd';
import styled from 'styled-components';
import './App.less';
import x_png from './assets/x.png';
import o_png from './assets/o.png';

interface CheckerboardItemDivProps {
  $currentPlayer: string;
  $currentChess: any;
}

const CheckerboardItemDiv = styled.div<CheckerboardItemDivProps>`
  &:after {
    ${(props) => (props.$currentChess ? 'opacity: 0!important;' : '')};
    background-image: url(${(props) => (props.$currentPlayer === 'x' ? x_png : o_png)});
  }
`;

function App() {
  const [current_player, set_current_player] = useState<any>();
  const [winner, set_winner] = useState<any>();
  const init_flag = useRef<boolean>(false);
  const checkerboard_info = useRef<any>({});
  const o_list = useRef<any>([]);
  const x_list = useRef<any>([]);
  const temp_chess = useRef<any>();
  const init_fn = useCallback(() => {
    const temp_arr: any = {};
    const init_status = {
      current_chess: '',
    };
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        temp_arr[`${i}-${j}`] = init_status;
      }
    }
    checkerboard_info.current = temp_arr;
    set_current_player('');
    set_winner('');
    temp_chess.current = '';
    o_list.current = [];
    x_list.current = [];
  }, []);
  const choose_first_player_random_fn = useCallback(() => {
    const player = Math.round(Math.random()) ? 'x' : 'o';
    set_current_player(player);
  }, []);
  const restart_game_fn = useCallback(() => {
    init_fn();
  }, [init_fn]);
  const validation_winner_fn = useCallback((current_player: any) => {
    if (
      (checkerboard_info.current['0-0'].current_chess &&
        checkerboard_info.current['0-0'].current_chess === checkerboard_info.current['0-1'].current_chess &&
        checkerboard_info.current['0-1'].current_chess === checkerboard_info.current['0-2'].current_chess) ||
      (checkerboard_info.current['1-0'].current_chess &&
        checkerboard_info.current['1-0'].current_chess === checkerboard_info.current['1-1'].current_chess &&
        checkerboard_info.current['1-1'].current_chess === checkerboard_info.current['1-2'].current_chess) ||
      (checkerboard_info.current['2-0'].current_chess &&
        checkerboard_info.current['2-0'].current_chess === checkerboard_info.current['2-1'].current_chess &&
        checkerboard_info.current['2-1'].current_chess === checkerboard_info.current['2-2'].current_chess) ||
      (checkerboard_info.current['0-0'].current_chess &&
        checkerboard_info.current['0-0'].current_chess === checkerboard_info.current['1-0'].current_chess &&
        checkerboard_info.current['1-0'].current_chess === checkerboard_info.current['2-0'].current_chess) ||
      (checkerboard_info.current['0-1'].current_chess &&
        checkerboard_info.current['0-1'].current_chess === checkerboard_info.current['1-1'].current_chess &&
        checkerboard_info.current['1-1'].current_chess === checkerboard_info.current['2-1'].current_chess) ||
      (checkerboard_info.current['0-2'].current_chess &&
        checkerboard_info.current['0-2'].current_chess === checkerboard_info.current['1-2'].current_chess &&
        checkerboard_info.current['1-2'].current_chess === checkerboard_info.current['2-2'].current_chess) ||
      (checkerboard_info.current['0-0'].current_chess &&
        checkerboard_info.current['0-0'].current_chess === checkerboard_info.current['1-1'].current_chess &&
        checkerboard_info.current['1-1'].current_chess === checkerboard_info.current['2-2'].current_chess) ||
      (checkerboard_info.current['2-0'].current_chess &&
        checkerboard_info.current['2-0'].current_chess === checkerboard_info.current['1-1'].current_chess &&
        checkerboard_info.current['1-1'].current_chess === checkerboard_info.current['0-2'].current_chess)
    ) {
      message.success(`Player ${current_player} winning this game!`);
      set_winner(current_player);
    }
  }, []);
  const click_checkerboard_fn = useCallback(
    (item: any) => {
      if (checkerboard_info.current[item].current_chess) {
        return;
      }
      const o_length = o_list.current.length || 0;
      const x_length = x_list.current.length || 0;
      checkerboard_info.current = { ...checkerboard_info.current, [item]: { current_chess: current_player } };
      if (temp_chess.current) {
        checkerboard_info.current = { ...checkerboard_info.current, [temp_chess.current]: { current_chess: '' } };
        if (current_player === 'o') {
          o_list.current = [...o_list.current.slice(1, o_list.current.length - 1), item];
          o_list.current.shift();
          o_list.current = [...o_list.current, item];
        } else {
          x_list.current = [...x_list.current.slice(1, x_list.current.length - 1), item];
          o_list.current.shift();
          o_list.current = [...o_list.current, item];
        }
      }
      if (o_length + x_length > 4) {
        if (current_player === 'o') {
          temp_chess.current = x_list.current[0];
        } else {
          temp_chess.current = o_list.current[0];
        }
      }
      validation_winner_fn(current_player);
      if (winner) {
        return;
      }
      setTimeout(() => {
        if (current_player === 'o') {
          o_list.current = [...o_list.current, item];
          set_current_player('x');
        } else {
          x_list.current = [...x_list.current, item];
          set_current_player('o');
        }
      }, 1);
    },
    [current_player, o_list, temp_chess, validation_winner_fn, winner, x_list]
  );
  const checkerboard_ele = useMemo(
    () => (
      <div className='checkerboard-container'>
        <div className='checkerboard'>
          {Object.keys(checkerboard_info.current).map((item: any, index: number) => (
            <CheckerboardItemDiv
              className={`checkerboard-item ${temp_chess.current === item ? 'flicker' : ''} ${
                checkerboard_info.current[item].current_chess === 'x' ? 'x-chess' : checkerboard_info.current[item].current_chess === 'o' ? 'o-chess' : ''
              } ${winner ? 'has-winner' : ''}`}
              key={index}
              $currentPlayer={current_player}
              $currentChess={checkerboard_info.current[item].current_chess}
              onClick={() => {
                !winner && click_checkerboard_fn(item);
              }}
            />
          ))}
        </div>
        <div className='current-player'>{winner ? `WINNER: ${winner}` : `CURRENT PLAYER: ${current_player}`}</div>
        <Button type='dashed' onClick={restart_game_fn}>
          Restart
        </Button>
      </div>
    ),
    [click_checkerboard_fn, current_player, restart_game_fn, winner]
  );
  useEffect(() => {
    if (!init_flag.current) {
      init_flag.current = true;
      init_fn();
    }
  }, [init_fn]);

  return (
    <>
      {current_player ? (
        <div className='main'>
          <div className='player-list o-list'>
            <div className='title'>'O' LIST: </div>
            <ul>
              {o_list.current.map((o_item: any, index: number) => (
                <li key={index}>{o_item}</li>
              ))}
            </ul>
          </div>
          {checkerboard_ele}
          <div className='player-list x-list'>
            <div className='title'>'X' LIST: </div>
            <ul>
              {x_list.current.map((x_item: any, index: number) => (
                <li key={index}>{x_item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <Button type='primary' onClick={choose_first_player_random_fn}>
          PLAY
        </Button>
      )}
    </>
  );
}

export default App;
