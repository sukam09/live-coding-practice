/*
  리액트 리팩토링 코드 관련 질문 리스트

  1. 로직 분리: 데이터 가공 로직(fetchOddResults)을 useEffect 콜백 내에 두지 않고 외부로 따로 분리한 근거는 무엇인가?
  2. 명명 규칙: 함수 이름을 fetchData가 아닌 loadData로 선택한 특별한 이유가 있는가?
  3. 변수명 충돌: 비동기 호출 결과값을 담는 변수명을 data로 정한 것이 상태(results)와의 이름 충돌을 피하기 위함인가?
  4. 비동기 패턴 비교: then/catch/finally 방식과 async/await 방식의 구체적인 장단점(Trade-off)은 무엇인가?
  5. 조건부 렌더링 구조: if-else가 아닌 여러 개의 if문(Early Return)으로만 분기 처리를 한 이유와 그에 따른 부작용은 없는가?
  6. 명시적 타입 변환: 에러 메시지 체크 시 errorMessage만 쓰는 것보다 !!errorMessage나 errorMessage !== '' 처럼 쓰는 것이 더 나은 방향인가?
  7. Props 명명: Error 컴포넌트의 Props를 errorMessage에서 message로 축약했을 때의 이점과 의도는 무엇인가?
  8. 재사용성과 함수명: getResultColor를 getTextColor로 바꾼 것이 재사용성 때문이라면, 인자명인 isOdd 역시 더 범용적인 이름으로 바꿔야 하지 않는가?
*/
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
    return <Error message={errorMessage} />;
  }

  return <List results={results} />;
}

function Loading() {
  return <h1>로딩 중...</h1>;
}

function Error({ message }) {
  return <p style={{ color: 'orange' }}>{message}</p>;
}

function List({ results }) {
  const getTextColor = isOdd => (isOdd ? 'green' : 'red');

  return (
    <ul>
      {results.map(result => (
        <li key={result.id} style={{ color: `${getTextColor(result.isOdd)}` }}>
          {result.text}
        </li>
      ))}
    </ul>
  );
}
