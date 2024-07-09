import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import './App.less';

interface CheckerboardItemDivProps {
  $currentPlayer: string;
  $currentChess: any;
}

const CheckerboardItemDiv = styled.div<CheckerboardItemDivProps>`
  &:after {
    ${(props) => (props.$currentChess ? 'opacity: 0!important;' : '')};
    content: ${(props) => `'${props.$currentPlayer}'!important`};
  }
`;

function App() {
  const [checkerboard_info, set_checkerboard_info] = useState<any>({});
  const [current_player, set_current_player] = useState<any>();
  const [o_list, set_o_list] = useState<any>([]);
  const [x_list, set_x_list] = useState<any>([]);
  const [temp_chess, set_temp_chess] = useState<any>();
  const init_flag = useRef<boolean>(false);
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
    set_checkerboard_info(temp_arr);
    set_current_player('');
    set_o_list([]);
    set_x_list([]);
  }, []);
  const choose_first_player_random_fn = useCallback(() => {
    const player = Math.round(Math.random()) ? 'X' : 'O';
    set_current_player(player);
  }, []);
  const restart_game_fn = useCallback(() => {
    init_fn();
  }, [init_fn]);
  const validation_winner_fn = useCallback(
    (current_player: any) => {
      console.log(
        checkerboard_info['0-0'].current_chess,
        checkerboard_info['0-1'].current_chess,
        checkerboard_info['0-2'].current_chess,
        checkerboard_info['1-0'].current_chess,
        checkerboard_info['1-1'].current_chess,
        checkerboard_info['1-2'].current_chess,
        checkerboard_info['2-0'].current_chess,
        checkerboard_info['2-1'].current_chess,
        checkerboard_info['2-2'].current_chess
      );
      if (
        (checkerboard_info['0-0'].current_chess === checkerboard_info['0-1'].current_chess &&
          checkerboard_info['0-1'].current_chess === checkerboard_info['0-2'].current_chess) ||
        (checkerboard_info['1-0'].current_chess === checkerboard_info['1-1'].current_chess &&
          checkerboard_info['1-1'].current_chess === checkerboard_info['1-2'].current_chess) ||
        (checkerboard_info['2-0'].current_chess === checkerboard_info['2-1'].current_chess &&
          checkerboard_info['2-1'].current_chess === checkerboard_info['2-2'].current_chess) ||
        (checkerboard_info['0-0'].current_chess === checkerboard_info['1-0'].current_chess &&
          checkerboard_info['1-0'].current_chess === checkerboard_info['2-0'].current_chess) ||
        (checkerboard_info['0-1'].current_chess === checkerboard_info['1-1'].current_chess &&
          checkerboard_info['1-1'].current_chess === checkerboard_info['2-1'].current_chess) ||
        (checkerboard_info['0-2'].current_chess === checkerboard_info['1-2'].current_chess &&
          checkerboard_info['1-2'].current_chess === checkerboard_info['2-2'].current_chess) ||
        (checkerboard_info['0-0'].current_chess === checkerboard_info['1-1'].current_chess &&
          checkerboard_info['1-1'].current_chess === checkerboard_info['2-2'].current_chess) ||
        (checkerboard_info['2-0'].current_chess === checkerboard_info['1-1'].current_chess &&
          checkerboard_info['1-1'].current_chess === checkerboard_info['0-2'].current_chess)
      ) {
        console.log(current_player);
      }
    },
    [checkerboard_info]
  );
  const click_checkerboard_fn = useCallback(
    (item: any) => {
      if (checkerboard_info[item].current_chess) {
        return;
      }
      const o_length = o_list.length || 0;
      const x_length = x_list.length || 0;
      set_checkerboard_info((old_info: any) => ({ ...old_info, [item]: { current_chess: current_player } }));
      if (current_player === 'O') {
        set_o_list((old_list: any) => [...old_list, item]);
        set_current_player('X');
      } else {
        set_x_list((old_list: any) => [...old_list, item]);
        set_current_player('O');
      }
      if (o_length + x_length > 4) {
        if (current_player === 'O') {
          set_temp_chess(x_list[0]);
        } else {
          set_temp_chess(o_list[0]);
        }
        if (o_length + x_length > 5) {
          set_checkerboard_info((old_info: any) => ({ ...old_info, [temp_chess]: { current_chess: '' } }));
          if (current_player === 'O') {
            set_o_list((old_o_list: any) => {
              old_o_list.shift();
              return old_o_list;
            });
            set_temp_chess(x_list[0]);
          } else {
            set_x_list((old_x_list: any) => {
              old_x_list.shift();
              return old_x_list;
            });
            set_temp_chess(o_list[0]);
          }
        }
      }
      validation_winner_fn(current_player);
    },
    [checkerboard_info, current_player, o_list, temp_chess, validation_winner_fn, x_list]
  );
  const checkerboard_ele = useMemo(
    () => (
      <div className='checkerboard-container'>
        <div className='checkerboard'>
          {Object.keys(checkerboard_info).map((item: any, index: number) => (
            <CheckerboardItemDiv
              className={`checkerboard-item ${temp_chess === item ? 'flicker' : ''}`}
              key={index}
              $currentPlayer={current_player}
              $currentChess={checkerboard_info[item].current_chess}
              onClick={() => {
                click_checkerboard_fn(item);
              }}
            >
              {checkerboard_info[item].current_chess}
            </CheckerboardItemDiv>
          ))}
        </div>
        <div>CURRENT PLAYER: {current_player}</div>
        <Button type='dashed' onClick={restart_game_fn}>
          Restart
        </Button>
      </div>
    ),
    [checkerboard_info, click_checkerboard_fn, current_player, restart_game_fn, temp_chess]
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
          <div>
            <div>'O' LIST: </div>
            <ul>
              {o_list.map((o_item: any, index: number) => (
                <li key={index}>{o_item}</li>
              ))}
            </ul>
          </div>
          {checkerboard_ele}
          <div>
            <div>'X' LIST: </div>
            <ul>
              {x_list.map((x_item: any, index: number) => (
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
