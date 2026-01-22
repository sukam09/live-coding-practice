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
  app.innerHTML = '<h1>로딩 중...</h1>';

  try {
    const promises = inputValues.map(inputValue => checkOdd(inputValue));
    const results = await Promise.allSettled(promises);
    const ul = document.createElement('ul');

    results.forEach(result => {
      const li = document.createElement('li');
      const isSuccess = result.status === 'fulfilled';
      li.textContent = isSuccess ? `${result.value}: 성공` : `${result.reason}: 실패`;
      li.style.color = isSuccess ? 'green' : 'red';
      console.log(li.textContent);
      ul.appendChild(li);
    });

    app.replaceChildren(ul);
  } catch (error) {
    app.innerHTML = `<p style="color: orange">데이터를 불러오는 중 문제가 발생했습니다.</p>`;
  }
}

async function fetchResults(values) {
  const promises = values.map(value => checkOdd(value));
  const results = await Promise.allSettled(promises);
  return results.map((result, index) => {
    const isOdd = result.status === 'fulfilled';
    const number = isOdd ? result.value : result.reason;
    const message = isOdd ? '성공' : '실패';
    return { id: index + 1, text: `${number}: ${message}`, isOdd };
  });
}

function renderList(container, results) {
  const ul = document.createElement('ul');

  results.forEach(result => {
    const li = document.createElement('li');
    li.textContent = result.text;
    li.style.color = result.isOdd ? 'green' : 'red';
    ul.appendChild(li);
  });

  container.replaceChildren(ul);
}

function renderError(container, message) {
  const p = document.createElement('p');
  p.textContent = message;
  p.style.color = 'orange';
  container.replaceChildren(p);
}

async function initApp(inputValues) {
  const app = document.querySelector('#app');
  app.innerHTML = '<h1>로딩 중...</h1>';

  try {
    const results = await fetchResults(inputValues);
    renderList(app, results);
  } catch (error) {
    renderError(app, error.message || '알 수 없는 에러가 발생했습니다.');
  }
}

initApp([1, 2, 3, 4, 5]);

// const app = document.querySelector('#app');
// app.innerHTML = '<h1>로딩 중...</h1>';
// runCheckProcessMulti([1, 2, 3, 4, 5]);

// fetchResults([1, 2, 3, 4, 5])
//   .then(results => renderList(results))
//   .catch(error => console.error(error));
