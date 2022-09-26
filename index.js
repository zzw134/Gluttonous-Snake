const rows = 30
    const cols = 30
    const size = 20
    let snake = [
      [0, 0]
    ]

    // 创建网格
    const box = document.querySelector('.box')
    box.style.width = `${cols * size}px`
    box.style.height = `${rows * size}px`
    const grids = []
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const isFood = Math.random() > 0.9
        grids.push(`<div data-v="${i}-${j}" style="width: ${size}px; height: ${size}px" class="item ${isFood ? 'food' : ''}"></div>`)
      }
    }
    box.innerHTML = grids.join('')

    // 更新蛇的位置
    const updateSnake = () => {
      document.querySelectorAll('.snake').forEach(s => {
        s.classList.remove('snake')
      })
      snake.forEach(s => {
        document.querySelector(`[data-v="${s.join('-')}"`).classList.add('snake')
      })
    }

    let key = undefined
    let prevKey = undefined // 此变量用于按键非合法时使用
    const listenerFn = e => {
      key = e.key
      switch (prevKey) {
        case 'w':
          if (key === 's') {
            key = 'w'
          }
          break
        case 's':
          if (key === 'w') {
            key = 's'
          }
          break
        case 'a':
          if (key === 'd') {
            key = 'a'
          }
          break
        case 'd':
          if (key === 'a') {
            key = 'd'
          }
          break
      }
    }
    window.addEventListener('keydown', listenerFn)

    const intervalFn = () => {
      let nextSnake = JSON.parse(JSON.stringify(snake.slice(0, snake.length - 1))) // 深拷贝
      let lastSnake = [...snake[snake.length - 1]] // 用于吃到食物时使用
      // 更改蛇头的位置
      switch (key) {
        case 'w':
          snake[0][0] -= 1
          prevKey = 'w'
          break
        case 'a':
          snake[0][1] -= 1
          prevKey = 'a'
          break
        case 's':
          snake[0][0] += 1
          prevKey = 's'
          break
        case 'd':
          snake[0][1] += 1
          prevKey = 'd'
          break
        default:
          key = prevKey
      }

      const snakeHead = document.querySelector(`[data-v="${snake[0].join('-')}"]`) // 获取更新后的蛇头
      // 判断是否有对象，没有的话就是撞墙了
      if (snakeHead) {
        if (snakeHead.className.indexOf('food') !== -1) {
          snakeHead.classList.remove('food')
          nextSnake.push(lastSnake) // 是食物的话就添加原来最后一个蛇尾，用于长身体
        }
        snake = [snake[0], ...nextSnake] // 合并更新后的蛇头和蛇身
        updateSnake()
      } else {
        clearInterval(timer)
        window.removeEventListener('keydown', listenerFn)
        const dialog = document.querySelector('.dialog')
        const over = document.querySelector('.over')
        const restart = document.querySelector('.restart')
        const overFn = () => {
          over.removeEventListener('click', overFn)
          window.close()
        }
        const restartFn = () => {
          location.reload()
        }
        over.addEventListener('click', overFn)
        restart.addEventListener('click', restartFn)
        dialog.style.visibility = 'visible'
      }
    }

    let timer = setInterval(intervalFn, 90)
    updateSnake()