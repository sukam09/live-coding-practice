function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// delay(1000).then(() => console.log('1초 후 실행되었습니다.'));

function checkOdd(number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (number % 2 === 1) {
        resolve(number);
      } else {
        reject(number);
      }
    }, 500);
  });
}

// checkOdd(10)
//   .then(number => {
//     console.log(`성공: ${number}`);
//   })
//   .catch(number => {
//     console.log(`실패: ${number}는 짝수입니다`);
//   });
// checkOdd(5)
//   .then(number => {
//     console.log(`성공: ${number}`);
//   })
//   .catch(number => {
//     console.log(`실패: ${number}는 짝수입니다`);
//   });

// delay(1000)
//   .then(() => {
//     return checkOdd(5);
//   })
//   .then(result => {
//     console.log(`최종 결과: ${result * 2}`);
//   })
//   .catch(error => {
//     console.error(error);
//   });

async function runCheckProcess(inputValue) {
  try {
    console.log('시작...');
    await delay(1000);
    console.log('1초 후 실행되었습니다.');
    const result = await checkOdd(inputValue);
    console.log(`최종 결과: ${result * 2}`);
  } catch (error) {
    console.error(`에러 발생: ${error}`);
  } finally {
    console.log('프로세스 종료');
  }
}

// runCheckProcess(5);
// runCheckProcess(4);

async function runCheckProcessMulti(inputValues) {
  const ul = document.createElement('ul');

  const promises = inputValues.map(inputValue => checkOdd(inputValue));
  const results = await Promise.allSettled(promises);
  results.forEach(result => {
    const li = document.createElement('li');
    const isSuccess = result.status === 'fulfilled';
    li.textContent = isSuccess ? `${result.value}: 성공` : `${result.reason}: 실패`;
    li.style.color = isSuccess ? 'green' : 'red';
    console.log(li.textContent);
    ul.appendChild(li);
  });

  app.appendChild(ul);
}

const app = document.querySelector('#app');

runCheckProcessMulti([1, 2, 3, 4, 5]);
