import { useState, useEffect } from 'react';

// API 로직
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

// 데이터 가공 로직
async function fetchOddResults(values) {
  const promises = values.map(value => checkOdd(value));
  const results = await Promise.allSettled(promises);
  return results.map((result, index) => {
    const isOdd = result.status === 'fulfilled';
    const number = isOdd ? result.value : result.reason;
    const message = isOdd ? '성공' : '실패';
    return { id: index + 1, text: `${number}: ${message}`, isOdd };
  });
}

const inputValues = [1, 2, 3, 4, 5];

export default function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOddResults(inputValues);
        setResults(data);
      } catch (error) {
        setErrorMessage(error.message || '알 수 없는 에러가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (errorMessage) {
    return <Error errorMessage={errorMessage} />;
  }

  return <List results={results} />;
}

function Loading() {
  return <h1>로딩 중...</h1>;
}

function Error({ errorMessage }) {
  return <p style={{ color: 'orange' }}>{errorMessage}</p>;
}

function List({ results }) {
  // 함수 인자를 result? result.isOdd?
  const getResultColor = isOdd => (isOdd ? 'green' : 'red');

  return (
    <ul>
      {results.map(result => (
        <li key={result.id} style={{ color: `${getResultColor(result.isOdd)}` }}>
          {result.text}
        </li>
      ))}
    </ul>
  );
}
